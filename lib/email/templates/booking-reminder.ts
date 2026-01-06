type BookingReminderData = {
  bookingNumber: string
  customerName: string
  serviceName: string
  scheduledDate: string
  scheduledTime: string
  endTime: string
  duration: number
  address?: string
}

export const getBookingReminderTemplate = (data: BookingReminderData) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Reminder</title>
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
    .reminder-badge {
      display: inline-block;
      padding: 8px 20px;
      background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
      color: white;
      border-radius: 20px;
      font-size: 14px;
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
    .countdown {
      background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin: 24px 0;
    }
    .countdown-number {
      font-size: 48px;
      font-weight: bold;
      color: #92400E;
      margin: 0;
    }
    .countdown-label {
      font-size: 18px;
      color: #78350F;
      margin: 8px 0 0;
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
    .checklist {
      background-color: #F0FDF4;
      border-left: 4px solid #10B981;
      padding: 20px;
      border-radius: 6px;
      margin: 24px 0;
    }
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 12px 0;
    }
    .checkbox {
      font-size: 20px;
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
      <div class="reminder-badge">⏰ REMINDER</div>
    </div>

    <h1>Your service is tomorrow!</h1>
    <p>Hi ${data.customerName},</p>
    <p>This is a friendly reminder about your upcoming service appointment.</p>

    <div class="countdown">
      <div class="countdown-number">24</div>
      <div class="countdown-label">Hours Until Your Appointment</div>
    </div>

    <div class="info-card">
      <div class="info-row">
        <div class="info-label">
          <span class="icon">🔧</span>
          Service
        </div>
        <div class="info-value">${data.serviceName}</div>
      </div>
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
      ${data.address ? `
        <div class="info-row">
          <div class="info-label">
            <span class="icon">📍</span>
            Location
          </div>
          <div class="info-value">${data.address}</div>
        </div>
      ` : ''}
    </div>

    <div class="checklist">
      <h3 style="margin-top: 0; font-size: 18px; color: #065F46;">Pre-Appointment Checklist</h3>
      <div class="checklist-item">
        <span class="checkbox">✅</span>
        <span>Confirm you have all necessary materials or items for the service</span>
      </div>
      <div class="checklist-item">
        <span class="checkbox">✅</span>
        <span>Plan to arrive 5-10 minutes early</span>
      </div>
      <div class="checklist-item">
        <span class="checkbox">✅</span>
        <span>Save our contact number in case you need to reach us</span>
      </div>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/bookings" class="button">View Booking Details</a>
    </div>

    <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 16px; border-radius: 6px; margin: 24px 0;">
      <p style="margin: 0; font-size: 14px; color: #991B1B;">
        <strong>Need to Reschedule or Cancel?</strong><br>
        Please contact us as soon as possible at ${process.env.SMTP_FROM_EMAIL} or call (XXX) XXX-XXXX
      </p>
    </div>

    <div class="footer">
      <p>Booking #${data.bookingNumber}</p>
      <p style="margin-top: 16px;">&copy; ${new Date().getFullYear()} SuberCraftex. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `

  const text = `
Booking Reminder - SuberCraftex

Your service is tomorrow!

Hi ${data.customerName},

This is a friendly reminder about your upcoming service appointment in 24 hours.

Booking #${data.bookingNumber}

SERVICE DETAILS:
Service: ${data.serviceName}
Date: ${data.scheduledDate}
Time: ${data.scheduledTime} - ${data.endTime}
Duration: ${data.duration} minutes
${data.address ? `Location: ${data.address}` : ''}

PRE-APPOINTMENT CHECKLIST:
✓ Confirm you have all necessary materials or items
✓ Plan to arrive 5-10 minutes early
✓ Save our contact number: (XXX) XXX-XXXX

View booking details: ${process.env.NEXT_PUBLIC_APP_URL}/account/bookings

Need to Reschedule or Cancel?
Contact us at ${process.env.SMTP_FROM_EMAIL}

© ${new Date().getFullYear()} SuberCraftex. All rights reserved.
  `

  return { html, text }
}
