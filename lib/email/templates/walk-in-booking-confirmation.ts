type WalkInBookingData = {
  bookingNumber: string
  customerName: string
  customerEmail: string
  serviceName: string
  serviceCategory?: string
  serviceType: string
  desiredOutcome?: string
  customerNotes?: string
}

export const getWalkInBookingConfirmationTemplate = (data: WalkInBookingData) => {
  const serviceTypeLabel = data.serviceType === 'custom_production'
    ? 'Custom Production'
    : 'Collect & Repair'

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
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
      background: linear-gradient(135deg, #D4AF76 0%, #A67C52 100%);
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
    .booking-number {
      font-size: 20px;
      color: #D4AF76;
      font-weight: bold;
      margin: 16px 0;
    }
    .info-card {
      background: linear-gradient(135deg, #FFF9F0 0%, #FFF5E6 100%);
      border-left: 4px solid #D4AF76;
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 12px 0;
      border-bottom: 1px solid rgba(212, 175, 118, 0.2);
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #6b7280;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .info-value {
      color: #111827;
      font-size: 16px;
      font-weight: 500;
      text-align: right;
      max-width: 60%;
    }
    .icon {
      font-size: 18px;
    }
    .notes-section {
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
      text-align: center;
    }
    .alert {
      background-color: #FEF3C7;
      border-left: 4px solid #F59E0B;
      padding: 16px;
      border-radius: 6px;
      margin: 24px 0;
    }
    .success-box {
      background-color: #ECFDF5;
      border-left: 4px solid #10B981;
      padding: 16px;
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
      <p style="color: #6b7280; margin: 0;">Professional Tailoring & Craftsmanship</p>
      <div class="badge">✓ BOOKING RECEIVED</div>
    </div>

    <h1>Your booking is being processed!</h1>
    <p>Hi ${data.customerName},</p>
    <p>Thank you for visiting SuberCraftex! We've received your ${serviceTypeLabel.toLowerCase()} booking and our team is now reviewing your requirements.</p>

    <div class="booking-number">Booking #${data.bookingNumber}</div>

    <div class="info-card">
      <div class="info-row">
        <div class="info-label">
          <span class="icon">🔧</span>
          Service
        </div>
        <div class="info-value">${data.serviceName}</div>
      </div>
      ${data.serviceCategory ? `
        <div class="info-row">
          <div class="info-label">
            <span class="icon">📁</span>
            Category
          </div>
          <div class="info-value">${data.serviceCategory}</div>
        </div>
      ` : ''}
      <div class="info-row">
        <div class="info-label">
          <span class="icon">✨</span>
          Service Type
        </div>
        <div class="info-value">${serviceTypeLabel}</div>
      </div>
      ${data.desiredOutcome ? `
        <div class="info-row">
          <div class="info-label">
            <span class="icon">🎯</span>
            Desired Outcome
          </div>
          <div class="info-value">${data.desiredOutcome}</div>
        </div>
      ` : ''}
    </div>

    ${data.customerNotes ? `
      <div class="notes-section">
        <h3 style="margin-top: 0; font-size: 16px; color: #6b7280;">Your Notes</h3>
        <p style="margin: 0; color: #111827;">${data.customerNotes}</p>
      </div>
    ` : ''}

    <div class="success-box">
      <p style="margin: 0; font-size: 14px; color: #047857;">
        <strong>✅ What happens next:</strong>
      </p>
      <ol style="margin: 8px 0 0 0; padding-left: 20px; color: #047857;">
        <li>Our team will review your requirements and prepare a detailed quote</li>
        <li>You'll receive a quote via email with pricing and estimated completion time</li>
        <li>Once you approve the quote, we'll begin working on your order</li>
        <li>We'll keep you updated on the progress throughout</li>
      </ol>
    </div>

    <div class="alert">
      <p style="margin: 0; font-size: 14px; color: #92400E;">
        <strong>⏰ Quote Timeline:</strong> You should receive your detailed quote within 24-48 hours. If you have any questions in the meantime, feel free to contact us!
      </p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/bookings/${data.bookingNumber}" class="button">View Booking Details</a>
    </div>

    <div class="footer">
      <p><strong>Questions or need to make changes?</strong></p>
      <p>Contact us at ${process.env.SMTP_FROM_EMAIL || 'info@subercraftex.com'} or visit us in-store</p>
      <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">
        This is a confirmation that we received your booking. A detailed quote will be sent separately.
      </p>
      <p style="margin-top: 16px;">&copy; ${new Date().getFullYear()} SuberCraftex. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `

  const text = `
Booking Confirmation - SuberCraftex

Your booking is being processed!

Hi ${data.customerName},

Thank you for visiting SuberCraftex! We've received your ${serviceTypeLabel.toLowerCase()} booking and our team is now reviewing your requirements.

Booking Number: ${data.bookingNumber}

Service Details:
- Service: ${data.serviceName}
${data.serviceCategory ? `- Category: ${data.serviceCategory}` : ''}
- Service Type: ${serviceTypeLabel}
${data.desiredOutcome ? `- Desired Outcome: ${data.desiredOutcome}` : ''}

${data.customerNotes ? `
Your Notes:
${data.customerNotes}
` : ''}

What happens next:
1. Our team will review your requirements and prepare a detailed quote
2. You'll receive a quote via email with pricing and estimated completion time
3. Once you approve the quote, we'll begin working on your order
4. We'll keep you updated on the progress throughout

Quote Timeline: You should receive your detailed quote within 24-48 hours.

View your booking: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/bookings/${data.bookingNumber}

Questions or need to make changes?
Contact us at ${process.env.SMTP_FROM_EMAIL || 'info@subercraftex.com'} or visit us in-store

---
This is a confirmation that we received your booking. A detailed quote will be sent separately.

© ${new Date().getFullYear()} SuberCraftex. All rights reserved.
  `

  return { html, text }
}
