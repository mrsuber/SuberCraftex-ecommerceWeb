type OrderItem = {
  productName: string;
  quantity: number;
  price: number;
  total: number;
};

type OrderConfirmationData = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'card' | 'cash';
  paymentStatus: string;
  trackingUrl?: string;
};

export const getOrderConfirmationTemplate = (data: OrderConfirmationData) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9fafb;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 24px;
      border-bottom: 2px solid #D4AF76;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #D4AF76;
      margin-bottom: 8px;
    }
    h1 {
      color: #111827;
      font-size: 24px;
      margin: 24px 0 16px;
    }
    .order-number {
      font-size: 20px;
      color: #D4AF76;
      font-weight: bold;
      margin: 16px 0;
    }
    .info-section {
      margin: 24px 0;
      padding: 16px;
      background-color: #f9fafb;
      border-radius: 6px;
    }
    .info-label {
      font-weight: 600;
      color: #6b7280;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .info-value {
      color: #111827;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
    }
    th {
      background-color: #f9fafb;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #6b7280;
      font-size: 12px;
      text-transform: uppercase;
      border-bottom: 2px solid #e5e7eb;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .text-right {
      text-align: right;
    }
    .totals {
      margin-top: 24px;
      border-top: 2px solid #e5e7eb;
      padding-top: 16px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
    }
    .total-row.grand {
      font-size: 18px;
      font-weight: bold;
      color: #D4AF76;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 2px solid #e5e7eb;
    }
    .button {
      display: inline-block;
      background-color: #D4AF76;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 16px 0;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">SuberCraftex</div>
      <p style="color: #6b7280; margin: 0;">Premium E-Commerce</p>
    </div>

    <h1>Thank you for your order!</h1>
    <p>Hi ${data.customerName},</p>
    <p>We've received your order and will notify you when it ships.</p>

    <div class="order-number">Order #${data.orderNumber}</div>

    <div class="info-section">
      <div class="info-label">Order Date</div>
      <div class="info-value">${data.orderDate}</div>
    </div>

    <h2 style="margin-top: 32px; font-size: 18px;">Order Details</h2>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Price</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map(item => `
          <tr>
            <td>${item.productName}</td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">$${item.price.toFixed(2)}</td>
            <td class="text-right">$${item.total.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row">
        <span>Subtotal</span>
        <span>$${data.subtotal.toFixed(2)}</span>
      </div>
      <div class="total-row">
        <span>Shipping</span>
        <span>$${data.shippingCost.toFixed(2)}</span>
      </div>
      <div class="total-row">
        <span>Tax</span>
        <span>$${data.taxAmount.toFixed(2)}</span>
      </div>
      <div class="total-row grand">
        <span>Total</span>
        <span>$${data.totalAmount.toFixed(2)}</span>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 32px;">
      <div>
        <h2 style="margin-top: 0; font-size: 18px;">Shipping Address</h2>
        <div class="info-section">
          <div>${data.shippingAddress.fullName}</div>
          <div>${data.shippingAddress.addressLine1}</div>
          ${data.shippingAddress.addressLine2 ? `<div>${data.shippingAddress.addressLine2}</div>` : ''}
          <div>${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}</div>
          <div>${data.shippingAddress.country}</div>
        </div>
      </div>

      <div>
        <h2 style="margin-top: 0; font-size: 18px;">Payment Information</h2>
        <div class="info-section">
          <div class="info-label">Payment Method</div>
          <div class="info-value" style="margin-bottom: 12px;">
            ${data.paymentMethod === 'card' ? '💳 Credit/Debit Card' : '💵 Cash on Delivery'}
          </div>
          <div class="info-label">Payment Status</div>
          <div class="info-value">
            <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; ${
              data.paymentStatus === 'paid'
                ? 'background-color: #d1fae5; color: #065f46;'
                : 'background-color: #fef3c7; color: #92400e;'
            }">
              ${data.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Payment on Delivery'}
            </span>
          </div>
          ${data.paymentMethod === 'cash' ? `
            <div style="margin-top: 12px; padding: 12px; background-color: #fffbeb; border-left: 3px solid #f59e0b; border-radius: 4px;">
              <p style="margin: 0; font-size: 13px; color: #92400e;">
                <strong>Note:</strong> Please have the exact amount ready when the order arrives.
              </p>
            </div>
          ` : ''}
        </div>
      </div>
    </div>

    ${data.trackingUrl ? `
      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.trackingUrl}" class="button">Track Your Order</a>
      </div>
    ` : ''}

    <div class="footer">
      <p>Questions about your order? Reply to this email or contact us at support@subercraftex.com</p>
      <p style="margin-top: 16px;">&copy; ${new Date().getFullYear()} SuberCraftex. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Order Confirmation - SuberCraftex

Thank you for your order, ${data.customerName}!

Order Number: ${data.orderNumber}
Order Date: ${data.orderDate}

ORDER DETAILS:
${data.items.map(item => `${item.productName} x${item.quantity} - $${item.total.toFixed(2)}`).join('\n')}

Subtotal: $${data.subtotal.toFixed(2)}
Shipping: $${data.shippingCost.toFixed(2)}
Tax: $${data.taxAmount.toFixed(2)}
Total: $${data.totalAmount.toFixed(2)}

SHIPPING ADDRESS:
${data.shippingAddress.fullName}
${data.shippingAddress.addressLine1}
${data.shippingAddress.addressLine2 || ''}
${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}
${data.shippingAddress.country}

PAYMENT INFORMATION:
Payment Method: ${data.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
Payment Status: ${data.paymentStatus === 'paid' ? 'Paid' : 'Payment on Delivery'}
${data.paymentMethod === 'cash' ? '\nNote: Please have the exact amount ready when the order arrives.' : ''}

${data.trackingUrl ? `Track your order: ${data.trackingUrl}` : ''}

Questions? Contact us at support@subercraftex.com

© ${new Date().getFullYear()} SuberCraftex. All rights reserved.
  `;

  return { html, text };
};
