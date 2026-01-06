import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { format } from 'date-fns'

/**
 * GET /api/pos/receipt/[id]
 * Generate printable receipt for POS order
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get order with all details
    const order = await db.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                sku: true
              }
            }
          }
        },
        cashier: {
          select: {
            fullName: true,
            employeeId: true
          }
        },
        posSession: {
          select: {
            sessionNumber: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (!order.isPosOrder) {
      return NextResponse.json(
        { error: 'Not a POS order' },
        { status: 400 }
      )
    }

    // Generate HTML receipt
    const receipt = generateReceiptHTML(order)

    // Return HTML for printing
    return new Response(receipt, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error generating receipt:', error)
    return NextResponse.json(
      { error: 'Failed to generate receipt' },
      { status: 500 }
    )
  }
}

function generateReceiptHTML(order: any): string {
  const subtotal = Number(order.subtotal)
  const taxAmount = Number(order.taxAmount)
  const discountAmount = Number(order.discountAmount)
  const totalAmount = Number(order.totalAmount)
  const amountTendered = order.amountTendered ? Number(order.amountTendered) : null
  const changeGiven = order.changeGiven ? Number(order.changeGiven) : null

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt - ${order.orderNumber}</title>
  <style>
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }

    body {
      font-family: 'Courier New', monospace;
      max-width: 80mm;
      margin: 0 auto;
      padding: 10mm;
      font-size: 12px;
      line-height: 1.4;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px dashed #000;
      padding-bottom: 10px;
    }

    .header h1 {
      margin: 0 0 5px 0;
      font-size: 24px;
      font-weight: bold;
    }

    .header p {
      margin: 2px 0;
      font-size: 11px;
    }

    .order-info {
      margin: 15px 0;
      font-size: 11px;
    }

    .order-info p {
      margin: 3px 0;
      display: flex;
      justify-content: space-between;
    }

    .items {
      border-top: 1px dashed #000;
      border-bottom: 1px dashed #000;
      padding: 10px 0;
      margin: 15px 0;
    }

    .item {
      margin: 8px 0;
    }

    .item-header {
      font-weight: bold;
      margin-bottom: 2px;
    }

    .item-details {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      margin-top: 2px;
    }

    .totals {
      margin: 15px 0;
      font-size: 12px;
    }

    .totals p {
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
    }

    .totals .total {
      font-weight: bold;
      font-size: 14px;
      border-top: 2px solid #000;
      padding-top: 5px;
      margin-top: 10px;
    }

    .payment {
      margin: 15px 0;
      border-top: 1px dashed #000;
      padding-top: 10px;
    }

    .payment p {
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
      font-size: 12px;
    }

    .payment .change {
      font-weight: bold;
      font-size: 14px;
    }

    .footer {
      text-align: center;
      margin-top: 20px;
      border-top: 2px dashed #000;
      padding-top: 10px;
      font-size: 11px;
    }

    .print-button {
      text-align: center;
      margin: 20px 0;
    }

    button {
      background: #000;
      color: #fff;
      border: none;
      padding: 10px 30px;
      font-size: 14px;
      cursor: pointer;
      border-radius: 4px;
    }

    button:hover {
      background: #333;
    }
  </style>
</head>
<body>
  <div class="print-button no-print">
    <button onclick="window.print()">Print Receipt</button>
  </div>

  <div class="header">
    <h1>SuberCraftex</h1>
    <p>Craftsmanship Excellence</p>
    <p>123 Main Street, Your City</p>
    <p>Tel: (123) 456-7890</p>
    <p>www.subercraftex.com</p>
  </div>

  <div class="order-info">
    <p><span>Receipt #:</span><span>${order.orderNumber}</span></p>
    <p><span>Date:</span><span>${format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}</span></p>
    <p><span>Cashier:</span><span>${order.cashier?.fullName || 'N/A'}</span></p>
    ${order.cashier?.employeeId ? `<p><span>Emp ID:</span><span>${order.cashier.employeeId}</span></p>` : ''}
    ${order.posSession ? `<p><span>Session:</span><span>${order.posSession.sessionNumber}</span></p>` : ''}
    ${order.customerName && order.customerName !== 'Walk-in Customer' ? `<p><span>Customer:</span><span>${order.customerName}</span></p>` : ''}
    ${order.customerPhone ? `<p><span>Phone:</span><span>${order.customerPhone}</span></p>` : ''}
  </div>

  <div class="items">
    ${order.orderItems.map((item: any) => `
      <div class="item">
        <div class="item-header">${item.productName}</div>
        <div class="item-details">
          <span>${item.quantity} x $${Number(item.price).toFixed(2)}</span>
          <span>$${Number(item.total).toFixed(2)}</span>
        </div>
        ${item.variantOptions ? `<div style="font-size: 10px; color: #666;">${JSON.stringify(item.variantOptions)}</div>` : ''}
      </div>
    `).join('')}
  </div>

  <div class="totals">
    <p><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></p>
    ${discountAmount > 0 ? `<p><span>Discount:</span><span>-$${discountAmount.toFixed(2)}</span></p>` : ''}
    ${taxAmount > 0 ? `<p><span>Tax:</span><span>$${taxAmount.toFixed(2)}</span></p>` : ''}
    <p class="total"><span>TOTAL:</span><span>$${totalAmount.toFixed(2)}</span></p>
  </div>

  <div class="payment">
    <p><span>Payment Method:</span><span>${formatPaymentMethod(order.paymentMethod)}</span></p>
    ${amountTendered !== null ? `
      <p><span>Amount Tendered:</span><span>$${amountTendered.toFixed(2)}</span></p>
      <p class="change"><span>Change:</span><span>$${(changeGiven || 0).toFixed(2)}</span></p>
    ` : ''}
  </div>

  <div class="footer">
    <p><strong>Thank you for your purchase!</strong></p>
    <p>Please keep this receipt for your records</p>
    ${order.guestEmail ? `<p>Receipt sent to: ${order.guestEmail}</p>` : ''}
    <p style="margin-top: 10px;">Returns accepted within 30 days with receipt</p>
    <p>For inquiries: support@subercraftex.com</p>
  </div>
</body>
</html>
`
}

function formatPaymentMethod(method: string): string {
  switch (method) {
    case 'cash':
      return 'Cash'
    case 'card':
      return 'Card'
    case 'mobile_payment':
      return 'Mobile Payment'
    default:
      return method
  }
}
