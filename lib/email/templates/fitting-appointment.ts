type FittingAppointmentData = {
  bookingNumber: string
  customerName: string
  customerEmail: string
  serviceName: string
  fittingNumber: number
  scheduledDate: string
  scheduledTime: string
  durationMinutes: number
  tailorName: string
  notes?: string
}

export const getFittingAppointmentTemplate = (data: FittingAppointmentData) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fitting Appointment Scheduled</title>
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
      background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
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
      background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
      border-left: 4px solid #9333ea;
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid rgba(147, 51, 234, 0.1);
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #6b7280;
      font-size: 14px;
    }
    .info-value {
      color: #111827;
      font-weight: 500;
      font-size: 14px;
      text-align: right;
    }
    .highlight {
      background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
      color: white;
      padding: 24px;
      border-radius: 8px;
      margin: 24px 0;
      text-align: center;
    }
    .highlight h2 {
      margin: 0 0 12px 0;
      font-size: 18px;
      color: white;
    }
    .highlight .big-text {
      font-size: 32px;
      font-weight: bold;
      margin: 8px 0;
    }
    .notes-box {
      background-color: #fff7ed;
      border-left: 4px solid #f97316;
      padding: 16px;
      border-radius: 4px;
      margin: 16px 0;
    }
    .notes-label {
      font-weight: 600;
      color: #ea580c;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .notes-text {
      color: #9a3412;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      padding: 12px 32px;
      background: linear-gradient(135deg, #D4AF76 0%, #A67C52 100%);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 16px 0;
    }
    .important-notice {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .important-notice p {
      margin: 0;
      color: #78350f;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">SuberCraftex</div>
      <div class="badge">Fitting Appointment</div>
    </div>

    <h1>Hello ${data.customerName}!</h1>

    <p>Great news! Your fitting appointment has been scheduled for your order.</p>

    <div class="booking-number">Booking: ${data.bookingNumber}</div>

    <div class="highlight">
      <h2>📅 Your Fitting Appointment</h2>
      <div class="big-text">${data.scheduledDate}</div>
      <div style="font-size: 20px; margin-top: 8px;">${data.scheduledTime}</div>
      <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">${data.durationMinutes} minutes</div>
    </div>

    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Service</span>
        <span class="info-value">${data.serviceName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Fitting Session</span>
        <span class="info-value">${data.fittingNumber}${
    data.fittingNumber === 1
      ? 'st'
      : data.fittingNumber === 2
      ? 'nd'
      : data.fittingNumber === 3
      ? 'rd'
      : 'th'
  } Fitting</span>
      </div>
      <div class="info-row">
        <span class="info-label">Your Tailor</span>
        <span class="info-value">${data.tailorName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Duration</span>
        <span class="info-value">${data.durationMinutes} minutes</span>
      </div>
    </div>

    ${
      data.notes
        ? `
    <div class="notes-box">
      <div class="notes-label">📝 Special Notes</div>
      <div class="notes-text">${data.notes}</div>
    </div>
    `
        : ''
    }

    <div class="important-notice">
      <p><strong>⏰ Important:</strong> Please arrive 5-10 minutes before your scheduled time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
    </div>

    <h2 style="color: #111827; font-size: 18px; margin-top: 32px;">What to Bring</h2>
    <ul style="color: #4b5563;">
      <li>Any reference materials or inspiration photos you've collected</li>
      <li>Your order/booking confirmation details</li>
      <li>If applicable, any items you need altered or fitted</li>
      <li>An open mind and honest feedback about the fit!</li>
    </ul>

    <div class="footer">
      <p><strong>SuberCraftex</strong></p>
      <p>Master Tailoring & Craftsmanship</p>
      <p style="margin-top: 16px; font-size: 12px;">
        Questions? Contact us at support@subercraftex.com
      </p>
      <p style="margin-top: 8px; font-size: 12px;">
        This is an automated email. Please do not reply directly to this message.
      </p>
    </div>
  </div>
</body>
</html>
`

  const text = `
SuberCraftex - Fitting Appointment Scheduled

Hello ${data.customerName}!

Your fitting appointment has been scheduled:

Booking Number: ${data.bookingNumber}
Date: ${data.scheduledDate}
Time: ${data.scheduledTime}
Duration: ${data.durationMinutes} minutes

Service: ${data.serviceName}
Fitting Session: ${data.fittingNumber}${
    data.fittingNumber === 1
      ? 'st'
      : data.fittingNumber === 2
      ? 'nd'
      : data.fittingNumber === 3
      ? 'rd'
      : 'th'
  }
Your Tailor: ${data.tailorName}

${data.notes ? `Special Notes:\n${data.notes}\n\n` : ''}
IMPORTANT: Please arrive 5-10 minutes before your scheduled time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.

What to Bring:
- Any reference materials or inspiration photos you've collected
- Your order/booking confirmation details
- If applicable, any items you need altered or fitted
- An open mind and honest feedback about the fit!

Questions? Contact us at support@subercraftex.com

---
SuberCraftex - Master Tailoring & Craftsmanship
`

  return { html, text }
}
