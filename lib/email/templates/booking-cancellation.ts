type BookingCancellationData = {
  bookingNumber: string
  customerName: string
  serviceName: string
  scheduledDate: string
  scheduledTime: string
  cancellationReason?: string
  refundAmount?: number
  refundProcessingDays?: number
}

export const getBookingCancellationTemplate = (data: BookingCancellationData) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Cancelled</title>
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
    .badge {
      display: inline-block;
      padding: 6px 16px;
      background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
      color: white;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 16px 0;
    }
    h1 {
      color: #111827;
      font-size: 24px;
      margin: 24px 0 16px;
    }
    .info-card {
      background-color: #FEE2E2;
      border-left: 4px solid #EF4444;
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(239, 68, 68, 0.2);
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #991B1B;
      font-size: 14px;
      font-weight: 600;
    }
    .info-value {
      color: #7F1D1D;
      font-weight: 500;
    }
    .refund-card {
      background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
      border-left: 4px solid #10B981;
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0;
      text-align: center;
    }
    .refund-amount {
      font-size: 36px;
      font-weight: bold;
      color: #065F46;
      margin: 12px 0;
    }
    .refund-label {
      font-size: 14px;
      color: #047857;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .reason-box {
      background-color: #f9fafb;
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #D4AF76 0%, #A67C52 100%);
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 16px 0;
    }
    .feedback-section {
      background-color: #FEF3C7;
      border-left: 4px solid #F59E0B;
      padding: 20px;
      border-radius: 6px;
      margin: 24px 0;
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
      <p style="color: #6b7280; margin: 0;">Professional Services</p>
      <div class="badge">✕ CANCELLED</div>
    </div>

    <h1>Booking Cancelled</h1>
    <p>Hi ${data.customerName},</p>
    <p>Your service booking has been cancelled as requested. We're sorry to see you go, but we hope to serve you again in the future.</p>

    <div class="info-card">
      <h3 style="margin-top: 0; font-size: 18px; color: #7F1D1D;">Cancelled Booking Details</h3>
      <div class="info-row">
        <span class="info-label">Booking Number</span>
        <span class="info-value">${data.bookingNumber}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Service</span>
        <span class="info-value">${data.serviceName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Scheduled Date</span>
        <span class="info-value">${data.scheduledDate}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Scheduled Time</span>
        <span class="info-value">${data.scheduledTime}</span>
      </div>
    </div>

    ${data.cancellationReason ? `
      <div class="reason-box">
        <h3 style="margin-top: 0; font-size: 16px; color: #6b7280;">Cancellation Reason</h3>
        <p style="margin: 0; color: #111827;">${data.cancellationReason}</p>
      </div>
    ` : ''}

    ${data.refundAmount && data.refundAmount > 0 ? `
      <div class="refund-card">
        <div class="refund-label">Refund Amount</div>
        <div class="refund-amount">$${data.refundAmount.toFixed(2)}</div>
        <p style="margin: 16px 0 0; font-size: 14px; color: #047857;">
          Your refund will be processed within ${data.refundProcessingDays || 5}-${(data.refundProcessingDays || 5) + 2} business days to your original payment method.
        </p>
      </div>
    ` : ''}

    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/services" class="button">Browse Other Services</a>
    </div>

    <div class="feedback-section">
      <h3 style="margin-top: 0; font-size: 16px; color: #92400E;">We Value Your Feedback</h3>
      <p style="margin: 0; font-size: 14px; color: #78350F;">
        If there's anything we could have done better, please let us know. Your feedback helps us improve our services for everyone.
      </p>
      <div style="margin-top: 16px;">
        <a href="mailto:${process.env.SMTP_FROM_EMAIL}?subject=Feedback on Booking ${data.bookingNumber}" style="color: #D97706; text-decoration: underline; font-weight: 600;">
          Share Your Feedback
        </a>
      </div>
    </div>

    <div class="footer">
      <p><strong>Need to book again?</strong></p>
      <p>We're always here to help. Visit our services page or contact us anytime.</p>
      <p style="margin-top: 8px;">Email: ${process.env.SMTP_FROM_EMAIL} | Phone: (XXX) XXX-XXXX</p>
      <p style="margin-top: 16px;">&copy; ${new Date().getFullYear()} SuberCraftex. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `

  const text = `
Booking Cancelled - SuberCraftex

Hi ${data.customerName},

Your service booking has been cancelled as requested.

CANCELLED BOOKING DETAILS:
Booking Number: ${data.bookingNumber}
Service: ${data.serviceName}
Scheduled Date: ${data.scheduledDate}
Scheduled Time: ${data.scheduledTime}

${data.cancellationReason ? `Cancellation Reason: ${data.cancellationReason}` : ''}

${data.refundAmount && data.refundAmount > 0 ? `
REFUND INFORMATION:
Amount: $${data.refundAmount.toFixed(2)}
Your refund will be processed within ${data.refundProcessingDays || 5}-${(data.refundProcessingDays || 5) + 2} business days to your original payment method.
` : ''}

We're sorry to see you go, but we hope to serve you again in the future.

Browse other services: ${process.env.NEXT_PUBLIC_APP_URL}/services

We Value Your Feedback:
If there's anything we could have done better, please let us know at ${process.env.SMTP_FROM_EMAIL}

Need to book again?
Email: ${process.env.SMTP_FROM_EMAIL}
Phone: (XXX) XXX-XXXX

© ${new Date().getFullYear()} SuberCraftex. All rights reserved.
  `

  return { html, text }
}
