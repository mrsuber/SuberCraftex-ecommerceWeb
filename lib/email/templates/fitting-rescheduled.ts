type FittingRescheduledData = {
  bookingNumber: string
  customerName: string
  customerEmail: string
  serviceName: string
  fittingNumber: number
  oldScheduledDate?: string
  oldScheduledTime?: string
  newScheduledDate: string
  newScheduledTime: string
  durationMinutes: number
  tailorName: string
  notes?: string
}

export const getFittingRescheduledTemplate = (data: FittingRescheduledData) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fitting Appointment Rescheduled</title>
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
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
    .change-notice {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-left: 4px solid #f59e0b;
      padding: 20px;
      border-radius: 8px;
      margin: 24px 0;
    }
    .change-notice h2 {
      color: #92400e;
      margin: 0 0 16px 0;
      font-size: 18px;
    }
    .old-time {
      text-decoration: line-through;
      opacity: 0.6;
      color: #78350f;
      margin-bottom: 8px;
    }
    .new-time {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin-top: 16px;
    }
    .new-time h3 {
      margin: 0 0 12px 0;
      font-size: 16px;
      color: white;
      opacity: 0.9;
    }
    .new-time .big-text {
      font-size: 28px;
      font-weight: bold;
      margin: 8px 0;
    }
    .info-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
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
    .important-notice {
      background-color: #dbeafe;
      border-left: 4px solid #3b82f6;
      padding: 16px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .important-notice p {
      margin: 0;
      color: #1e3a8a;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">SuberCraftex</div>
      <div class="badge">Appointment Rescheduled</div>
    </div>

    <h1>Hello ${data.customerName}!</h1>

    <p>Your fitting appointment has been rescheduled to a new date and time.</p>

    <div class="booking-number">Booking: ${data.bookingNumber}</div>

    ${
      data.oldScheduledDate && data.oldScheduledTime
        ? `
    <div class="change-notice">
      <h2>⏰ Schedule Change</h2>
      <div class="old-time">
        <strong>Previous:</strong> ${data.oldScheduledDate} at ${data.oldScheduledTime}
      </div>
    </div>
    `
        : ''
    }

    <div class="new-time">
      <h3>✅ NEW APPOINTMENT TIME</h3>
      <div class="big-text">${data.newScheduledDate}</div>
      <div style="font-size: 20px; margin-top: 8px;">${data.newScheduledTime}</div>
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
    </div>

    ${
      data.notes
        ? `
    <div class="notes-box">
      <div class="notes-label">📝 Notes</div>
      <div class="notes-text">${data.notes}</div>
    </div>
    `
        : ''
    }

    <div class="important-notice">
      <p><strong>📅 Mark Your Calendar:</strong> Please update your calendar with this new appointment time. We look forward to seeing you!</p>
    </div>

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
SuberCraftex - Fitting Appointment Rescheduled

Hello ${data.customerName}!

Your fitting appointment has been rescheduled.

Booking Number: ${data.bookingNumber}

${
  data.oldScheduledDate && data.oldScheduledTime
    ? `Previous: ${data.oldScheduledDate} at ${data.oldScheduledTime}\n\n`
    : ''
}
NEW APPOINTMENT:
Date: ${data.newScheduledDate}
Time: ${data.newScheduledTime}
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

${data.notes ? `Notes:\n${data.notes}\n\n` : ''}
Please update your calendar with this new appointment time. We look forward to seeing you!

Questions? Contact us at support@subercraftex.com

---
SuberCraftex - Master Tailoring & Craftsmanship
`

  return { html, text }
}
