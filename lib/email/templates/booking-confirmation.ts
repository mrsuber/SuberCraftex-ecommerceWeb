type BookingConfirmationData = {
  bookingNumber: string
  customerName: string
  customerEmail: string
  serviceName: string
  serviceCategory?: string
  scheduledDate: string
  scheduledTime: string
  endTime: string
  duration: number
  price: number
  customerNotes?: string
  calendarInvite?: string // Base64 encoded .ics file
}

export const getBookingConfirmationTemplate = (data: BookingConfirmationData) => {
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
      align-items: center;
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
    }
    .icon {
      font-size: 18px;
    }
    .price {
      font-size: 32px;
      font-weight: bold;
      color: #D4AF76;
      text-align: center;
      margin: 24px 0;
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
      background-color: #EFF6FF;
      border-left: 4px solid #3B82F6;
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
      <p style="color: #6b7280; margin: 0;">Professional Services</p>
      <div class="badge">✓ BOOKING CONFIRMED</div>
    </div>

    <h1>Your service is booked!</h1>
    <p>Hi ${data.customerName},</p>
    <p>We're excited to confirm your service booking. Our expert artisan will be ready to assist you at the scheduled time.</p>

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
          <span class="icon">📅</span>
          Date
        </div>
        <div class="info-value">${data.scheduledDate}</div>
      </div>
      <div class="info-row">
        <div class="info-label">
          <span class="icon">🕐</span>
          Time
        </div>
        <div class="info-value">${data.scheduledTime} - ${data.endTime}</div>
      </div>
      <div class="info-row">
        <div class="info-label">
          <span class="icon">⏱️</span>
          Duration
        </div>
        <div class="info-value">${data.duration} minutes</div>
      </div>
    </div>

    <div class="price">$${data.price.toFixed(2)}</div>

    ${data.customerNotes ? `
      <div class="notes-section">
        <h3 style="margin-top: 0; font-size: 16px; color: #6b7280;">Your Notes</h3>
        <p style="margin: 0; color: #111827;">${data.customerNotes}</p>
      </div>
    ` : ''}

    <div class="alert">
      <p style="margin: 0; font-size: 14px; color: #1e40af;">
        <strong>📌 Important:</strong> Please arrive 5-10 minutes early to ensure we can start on time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.
      </p>
    </div>

    ${data.calendarInvite ? `
      <div style="text-align: center; margin: 24px 0;">
        <p style="color: #6b7280; margin-bottom: 12px;">Add this booking to your calendar</p>
        <a href="data:text/calendar;base64,${data.calendarInvite}" download="booking-${data.bookingNumber}.ics" class="button">
          📆 Add to Calendar
        </a>
      </div>
    ` : ''}

    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/bookings" class="button">View My Bookings</a>
    </div>

    <div class="footer">
      <p><strong>Need to make changes?</strong></p>
      <p>Contact us at ${process.env.SMTP_FROM_EMAIL} or call (XXX) XXX-XXXX</p>
      <p style="margin-top: 16px;">&copy; ${new Date().getFullYear()} SuberCraftex. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `

  const text = `
Booking Confirmation - SuberCraftex

Your service is booked!

Hi ${data.customerName},

We're excited to confirm your service booking.

Booking Number: ${data.bookingNumber}

SERVICE DETAILS:
Service: ${data.serviceName}
${data.serviceCategory ? `Category: ${data.serviceCategory}` : ''}
Date: ${data.scheduledDate}
Time: ${data.scheduledTime} - ${data.endTime}
Duration: ${data.duration} minutes

Price: $${data.price.toFixed(2)}

${data.customerNotes ? `Your Notes: ${data.customerNotes}` : ''}

IMPORTANT: Please arrive 5-10 minutes early. If you need to reschedule or cancel, please contact us at least 24 hours in advance.

View your bookings: ${process.env.NEXT_PUBLIC_APP_URL}/account/bookings

Need to make changes?
Contact us at ${process.env.SMTP_FROM_EMAIL}

© ${new Date().getFullYear()} SuberCraftex. All rights reserved.
  `

  return { html, text }
}
