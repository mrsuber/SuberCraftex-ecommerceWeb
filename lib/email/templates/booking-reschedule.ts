type BookingRescheduleData = {
  bookingNumber: string
  customerName: string
  serviceName: string
  oldDate: string
  oldTime: string
  newDate: string
  newTime: string
  endTime: string
  duration: number
  price: number
  calendarInvite?: string
}

export const getBookingRescheduleTemplate = (data: BookingRescheduleData) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Rescheduled</title>
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
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
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
    .comparison {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 16px;
      margin: 32px 0;
      align-items: center;
    }
    .time-card {
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .old-time {
      background-color: #FEE2E2;
      border: 2px solid #EF4444;
      opacity: 0.7;
    }
    .new-time {
      background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
      border: 2px solid #10B981;
    }
    .arrow {
      font-size: 32px;
      color: #D4AF76;
    }
    .time-label {
      font-size: 12px;
      color: #6b7280;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .time-value {
      font-size: 18px;
      font-weight: bold;
      color: #111827;
      margin: 4px 0;
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
      padding: 8px 0;
    }
    .info-label {
      color: #6b7280;
      font-size: 14px;
    }
    .info-value {
      color: #111827;
      font-weight: 500;
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
      <div class="badge">📅 RESCHEDULED</div>
    </div>

    <h1>Booking Updated</h1>
    <p>Hi ${data.customerName},</p>
    <p>Your service booking has been successfully rescheduled. Here are your new appointment details:</p>

    <div class="comparison">
      <div class="time-card old-time">
        <div class="time-label">Previous Time</div>
        <div class="time-value">${data.oldDate}</div>
        <div class="time-value">${data.oldTime}</div>
      </div>

      <div class="arrow">→</div>

      <div class="time-card new-time">
        <div class="time-label">New Time</div>
        <div class="time-value">${data.newDate}</div>
        <div class="time-value">${data.newTime}</div>
      </div>
    </div>

    <div class="info-card">
      <h3 style="margin-top: 0; font-size: 18px; color: #111827;">Updated Booking Details</h3>
      <div class="info-row">
        <span class="info-label">Booking Number</span>
        <span class="info-value">${data.bookingNumber}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Service</span>
        <span class="info-value">${data.serviceName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Duration</span>
        <span class="info-value">${data.duration} minutes</span>
      </div>
      <div class="info-row">
        <span class="info-label">Time Slot</span>
        <span class="info-value">${data.newTime} - ${data.endTime}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Price</span>
        <span class="info-value">$${data.price.toFixed(2)}</span>
      </div>
    </div>

    ${data.calendarInvite ? `
      <div style="text-align: center; margin: 24px 0;">
        <p style="color: #6b7280; margin-bottom: 12px;">Update your calendar</p>
        <a href="data:text/calendar;base64,${data.calendarInvite}" download="booking-${data.bookingNumber}.ics" class="button">
          📆 Update Calendar
        </a>
      </div>
    ` : ''}

    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/bookings" class="button">View My Bookings</a>
    </div>

    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 16px; border-radius: 6px; margin: 24px 0;">
      <p style="margin: 0; font-size: 14px; color: #1e40af;">
        <strong>📌 Note:</strong> Please arrive 5-10 minutes early for your rescheduled appointment. If you need to make any further changes, contact us at least 24 hours in advance.
      </p>
    </div>

    <div class="footer">
      <p>Need help? Contact us at ${process.env.SMTP_FROM_EMAIL}</p>
      <p style="margin-top: 16px;">&copy; ${new Date().getFullYear()} SuberCraftex. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `

  const text = `
Booking Rescheduled - SuberCraftex

Booking Updated

Hi ${data.customerName},

Your service booking has been successfully rescheduled.

Booking #${data.bookingNumber}

PREVIOUS TIME:
${data.oldDate} at ${data.oldTime}

NEW TIME:
${data.newDate} at ${data.newTime}

UPDATED BOOKING DETAILS:
Service: ${data.serviceName}
Duration: ${data.duration} minutes
Time Slot: ${data.newTime} - ${data.endTime}
Price: $${data.price.toFixed(2)}

Please arrive 5-10 minutes early for your rescheduled appointment.

View your bookings: ${process.env.NEXT_PUBLIC_APP_URL}/account/bookings

Need help? Contact us at ${process.env.SMTP_FROM_EMAIL}

© ${new Date().getFullYear()} SuberCraftex. All rights reserved.
  `

  return { html, text }
}
