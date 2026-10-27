import { Tx } from '@/lib/ledger'
import { InvestorEngineError } from './lots'

/**
 * Goods an investor takes away under the old (pre-ledger) withdrawal flow leave the shop's
 * stock too, so the website and the till stop selling units that are no longer there.
 * Refuses when fewer units are on the shelf than are leaving (the rest are held by orders).
 */
export async function takeGoodsOffShelf(
  tx: Tx,
  input: { productId: string; variantId: string | null; quantity: number; userId: string; note: string }
) {
  if (!Number.isInteger(input.quantity) || input.quantity <= 0) throw new InvestorEngineError('Quantity must be a whole number above 0')
  const product = await tx.product.findUniqueOrThrow({ where: { id: input.productId }, select: { name: true, inventoryCount: true } })
  const shelf = input.variantId
    ? (await tx.productVariant.findUniqueOrThrow({ where: { id: input.variantId }, select: { inventoryCount: true } })).inventoryCount
    : product.inventoryCount
  if (shelf < input.quantity) {
    throw new InvestorEngineError(
      `Only ${Math.max(0, shelf)} unit(s) of ${product.name} are on the shelf; the rest are held by orders not yet delivered. Hand over fewer units, or wait for those orders.`
    )
  }
  const after = await tx.product.update({ where: { id: input.productId }, data: { inventoryCount: { decrement: input.quantity } } })
  if (input.variantId) await tx.productVariant.update({ where: { id: input.variantId }, data: { inventoryCount: { decrement: input.quantity } } })
  await tx.inventoryLog.create({
    data: {
      productId: input.productId,
      variantId: input.variantId,
      action: 'adjustment',
      quantityChange: -input.quantity,
      quantityAfter: after.inventoryCount,
      userId: input.userId,
      notes: input.note,
    },
  })
}
