import { Prisma } from '@prisma/client'
import { randomBytes } from 'crypto'
import { db } from '@/lib/db'
import { toDecimal, Xaf } from '@/lib/money'
import { getSetting } from '@/lib/settings'
import { LineInput, priceLines, PricingError, reserveStock, subtotalOf } from './pricing'

export const SHIPPING_METHODS = ['standard', 'express', 'overnight', 'in_store'] as const
export type ShippingMethodName = (typeof SHIPPING_METHODS)[number]

/** Payment methods customers can choose. Cards are not offered. */
export const CUSTOMER_PAYMENT_METHODS = ['cash', 'mobile_payment'] as const
export type CustomerPaymentMethod = (typeof CUSTOMER_PAYMENT_METHODS)[number]

export const PICKUP_HOLD_HOURS = 12

export function generateOrderNumber(prefix = 'ORD'): string {
  return `${prefix}-${Date.now()}-${randomBytes(3).toString('hex').toUpperCase()}`
}

export async function shippingCostFor(method: ShippingMethodName): Promise<Xaf> {
  const rates = await getSetting('shipping.rates')
  const value = rates[method]
  return BigInt(Math.max(0, Math.round(Number(value) || 0)))
}

export interface AddressInput {
  fullName?: string
  email?: string
  phone?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface CreateOrderInput {
  userId: string | null
  userEmail: string | null
  lines: LineInput[]
  shippingMethod: string
  paymentMethod: string
  shippingAddress?: AddressInput | null
  billingAddress?: AddressInput | null
  customerNotes?: string | null
}

function cleanAddress(address: AddressInput | null | undefined): AddressInput | null {
  if (!address || typeof address !== 'object') return null
  const pick = (v: unknown) => (typeof v === 'string' ? v.trim().slice(0, 300) : undefined)
  return {
    fullName: pick(address.fullName),
    email: pick(address.email),
    phone: pick(address.phone),
    addressLine1: pick(address.addressLine1),
    addressLine2: pick(address.addressLine2),
    city: pick(address.city),
    state: pick(address.state),
    postalCode: pick(address.postalCode),
    country: pick(address.country),
  }
}

/**
 * Create an order priced entirely on the server. Nothing is marked paid here: cash orders
 * are paid on delivery or pickup, Mobile Money orders when PayWithCAMSOL confirms.
 * Stock is taken in the same transaction and the order fails if any item is short.
 */
export async function createOrder(input: CreateOrderInput) {
  const shippingMethod = input.shippingMethod as ShippingMethodName
  if (!SHIPPING_METHODS.includes(shippingMethod)) throw new PricingError('Choose a delivery method')
  if (input.paymentMethod === 'card') {
    throw new PricingError('Card payments are not available. Please pay with Mobile Money or cash.')
  }
  const paymentMethod = input.paymentMethod as CustomerPaymentMethod
  if (!CUSTOMER_PAYMENT_METHODS.includes(paymentMethod)) throw new PricingError('Choose a payment method')

  const isPickup = shippingMethod === 'in_store'
  const shippingAddress = cleanAddress(input.shippingAddress)
  const billingAddress = cleanAddress(input.billingAddress) ?? shippingAddress
  if (!isPickup && (!shippingAddress?.addressLine1 || !shippingAddress.city || !shippingAddress.fullName)) {
    throw new PricingError('Shipping and billing addresses are required')
  }
  const email = input.userEmail ?? shippingAddress?.email ?? null
  if (!input.userId && !email) throw new PricingError('An email address is required for guest orders')

  const shippingCost = isPickup ? 0n : await shippingCostFor(shippingMethod)
  const holdMinutes = await getSetting('checkout.paymentHoldMinutes')

  return db.$transaction(async (tx) => {
    const priced = await priceLines(tx, input.lines)
    const subtotal = subtotalOf(priced)
    const total = subtotal + shippingCost
    const now = Date.now()
    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: input.userId,
        guestEmail: email,
        orderStatus: 'pending',
        paymentStatus: 'pending',
        paymentMethod,
        shippingMethod,
        subtotal: toDecimal(subtotal),
        shippingCost: toDecimal(shippingCost),
        taxAmount: 0,
        totalAmount: toDecimal(total),
        shippingAddress: (shippingAddress as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        billingAddress: (billingAddress as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        customerName: shippingAddress?.fullName ?? null,
        customerPhone: shippingAddress?.phone ?? null,
        customerNotes: input.customerNotes?.slice(0, 2000) ?? null,
        // Pickup orders wait 12 hours for the customer, then their stock goes back on sale
        pickupDeadline: isPickup ? new Date(now + PICKUP_HOLD_HOURS * 3600_000) : null,
        // Mobile Money orders hold their stock only this long; unpaid, they are cancelled
        paymentDueAt: paymentMethod === 'mobile_payment' ? new Date(now + holdMinutes * 60_000) : null,
        orderItems: {
          create: priced.map((line) => ({
            productId: line.productId,
            variantId: line.variantId,
            productName: line.name,
            productSku: line.sku,
            productImage: line.image,
            variantOptions: line.variantOptions ?? Prisma.JsonNull,
            quantity: line.quantity,
            price: toDecimal(line.unitPrice),
            total: toDecimal(line.total),
          })),
        },
      },
      include: { orderItems: true },
    })
    await reserveStock(tx, priced, {
      orderId: order.id,
      userId: input.userId,
      notes: `Reserved for order ${order.orderNumber}`,
    })
    return order
  })
}
