import { Prisma } from '@prisma/client'
import { toXaf, Xaf } from '@/lib/money'

type Client = Prisma.TransactionClient

export interface LineInput {
  productId: string
  variantId?: string | null
  quantity: number
}

export interface PricedLine {
  productId: string
  variantId: string | null
  name: string
  sku: string
  image: string | null
  variantOptions: Prisma.JsonValue | null
  quantity: number
  unitPrice: Xaf
  total: Xaf
  trackInventory: boolean
}

export class PricingError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message)
  }
}

export interface OutOfStockItem {
  name: string
  available: number
  requested: number
}

export class OutOfStockError extends PricingError {
  constructor(public items: OutOfStockItem[]) {
    super('Insufficient stock for some items', items)
  }
}

const MAX_QUANTITY = 1000

/** Parse what a client sent into clean lines, merging repeats of the same product. */
export function parseLines(raw: unknown): LineInput[] {
  if (!Array.isArray(raw) || raw.length === 0) throw new PricingError('Cart is empty')
  if (raw.length > 100) throw new PricingError('Too many different items in one order')
  const merged = new Map<string, LineInput>()
  for (const item of raw) {
    const productId = (item as any)?.productId ?? (item as any)?.id
    const variantId = (item as any)?.variantId || null
    const quantity = Number((item as any)?.quantity)
    if (typeof productId !== 'string' || !productId) throw new PricingError('Every item needs a product')
    if (variantId !== null && typeof variantId !== 'string') throw new PricingError('Invalid variant')
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new PricingError(`Quantity must be a whole number between 1 and ${MAX_QUANTITY}`)
    }
    const key = `${productId}:${variantId ?? ''}`
    const existing = merged.get(key)
    if (existing) existing.quantity += quantity
    else merged.set(key, { productId, variantId, quantity })
  }
  return [...merged.values()]
}

/**
 * Price lines from the catalogue. Prices sent by a browser or a till are never used:
 * only the database decides what something costs.
 */
export async function priceLines(client: Client, lines: LineInput[]): Promise<PricedLine[]> {
  const products = await client.product.findMany({
    where: { id: { in: lines.map((l) => l.productId) } },
    include: { variants: true },
  })
  return lines.map((line) => {
    const product = products.find((p) => p.id === line.productId)
    if (!product || !product.isActive) throw new PricingError('A product in your cart is no longer available')
    const variant = line.variantId ? product.variants.find((v) => v.id === line.variantId) : null
    if (line.variantId && (!variant || !variant.isActive)) {
      throw new PricingError(`The selected option of ${product.name} is no longer available`)
    }
    const unitPrice = toXaf(variant ? variant.price : product.price)
    return {
      productId: product.id,
      variantId: variant?.id ?? null,
      name: variant ? `${product.name} - ${variant.name}` : product.name,
      sku: variant?.sku ?? product.sku,
      image: variant?.imageUrl ?? product.featuredImage ?? product.images[0] ?? null,
      variantOptions: (variant?.options as Prisma.JsonValue) ?? null,
      quantity: line.quantity,
      unitPrice,
      total: unitPrice * BigInt(line.quantity),
      trackInventory: product.trackInventory,
    }
  })
}

export function subtotalOf(lines: PricedLine[]): Xaf {
  return lines.reduce((sum, l) => sum + l.total, 0n)
}

/**
 * Take stock for these lines. Each decrement only happens if enough stock is left, in the
 * same statement, so two buyers can never take the last item twice. Throws OutOfStockError
 * (and the caller's transaction rolls back) when anything is short.
 */
export async function reserveStock(
  tx: Client,
  lines: PricedLine[],
  log: { orderId: string; userId: string | null; notes: string }
): Promise<void> {
  const short: OutOfStockItem[] = []
  for (const line of lines) {
    if (!line.trackInventory) continue
    const productUpdate = await tx.product.updateMany({
      where: { id: line.productId, inventoryCount: { gte: line.quantity } },
      data: { inventoryCount: { decrement: line.quantity } },
    })
    let variantOk = true
    if (line.variantId) {
      const variantUpdate = await tx.productVariant.updateMany({
        where: { id: line.variantId, inventoryCount: { gte: line.quantity } },
        data: { inventoryCount: { decrement: line.quantity } },
      })
      variantOk = variantUpdate.count === 1
    }
    if (productUpdate.count !== 1 || !variantOk) {
      const current = line.variantId
        ? await tx.productVariant.findUnique({ where: { id: line.variantId }, select: { inventoryCount: true } })
        : await tx.product.findUnique({ where: { id: line.productId }, select: { inventoryCount: true } })
      short.push({ name: line.name, available: Math.max(0, current?.inventoryCount ?? 0), requested: line.quantity })
      continue
    }
    const after = await tx.product.findUniqueOrThrow({ where: { id: line.productId }, select: { inventoryCount: true } })
    await tx.inventoryLog.create({
      data: {
        productId: line.productId,
        variantId: line.variantId,
        action: 'reserved',
        quantityChange: -line.quantity,
        quantityAfter: after.inventoryCount,
        orderId: log.orderId,
        userId: log.userId,
        notes: log.notes,
      },
    })
  }
  if (short.length > 0) throw new OutOfStockError(short)
}

/** Give stock back (order cancelled or payment expired). */
export async function releaseStock(
  tx: Client,
  items: { productId: string; variantId: string | null; quantity: number }[],
  log: { orderId: string; userId: string | null; notes: string }
): Promise<void> {
  for (const item of items) {
    const product = await tx.product.findUnique({ where: { id: item.productId }, select: { trackInventory: true } })
    if (!product?.trackInventory) continue
    const updated = await tx.product.update({
      where: { id: item.productId },
      data: { inventoryCount: { increment: item.quantity } },
    })
    if (item.variantId) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { inventoryCount: { increment: item.quantity } },
      })
    }
    await tx.inventoryLog.create({
      data: {
        productId: item.productId,
        variantId: item.variantId,
        action: 'released',
        quantityChange: item.quantity,
        quantityAfter: updated.inventoryCount,
        orderId: log.orderId,
        userId: log.userId,
        notes: log.notes,
      },
    })
  }
}
