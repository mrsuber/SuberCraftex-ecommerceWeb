interface PaymentConfirmationEmailData {
  poNumber: string;
  supplierName: string;
  totalAmount: number;
  confirmationUrl: string;
  companyName: string;
  companyEmail: string;
  expiresInDays: number;
}

export function getPaymentConfirmationTemplate(data: PaymentConfirmationEmailData) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmation Request - ${data.poNumber}</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f4f4;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Payment Confirmation Request</h1>
        <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Purchase Order ${data.poNumber}</p>
      </div>

      <div style="background: #ffffff; padding: 40px 30px; border-radius: 0;">
        <p style="font-size: 16px; margin-bottom: 20px;">Dear ${data.supplierName},</p>

        <p style="font-size: 16px; margin-bottom: 20px;">
          We have issued payment for Purchase Order <strong>${data.poNumber}</strong> in the amount of
          <strong style="color: #667eea;">$${data.totalAmount.toFixed(2)}</strong>.
        </p>

        <p style="font-size: 16px; margin-bottom: 30px;">
          To help us maintain accurate records and complete the payment reconciliation process,
          please confirm receipt of this payment by clicking the button below:
        </p>

        <div style="text-align: center; margin: 40px 0;">
          <a href="${data.confirmationUrl}"
             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #ffffff; padding: 16px 48px; text-decoration: none; border-radius: 8px;
                    font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
            Confirm Payment Received
          </a>
        </div>

        <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong style="color: #333;">Note:</strong> This confirmation link will expire in ${data.expiresInDays} days.
            After confirmation, our payment status will be automatically updated.
          </p>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          If you're unable to click the button above, copy and paste this link into your browser:
        </p>
        <p style="background: #f8f9fa; padding: 12px; border-radius: 4px; word-break: break-all;
                  font-size: 13px; color: #667eea; border: 1px solid #e9ecef;">
          ${data.confirmationUrl}
        </p>

        <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #f0f0f0;">
          <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
            If you did not receive this payment or have any questions, please contact us at:
          </p>
          <p style="font-size: 14px; color: #667eea; margin: 5px 0;">
            <strong>${data.companyEmail}</strong>
          </p>
        </div>

        <p style="margin-top: 30px; font-size: 16px; color: #333;">
          Thank you for your partnership!
        </p>
        <p style="font-size: 16px; color: #666;">
          Best regards,<br>
          <strong style="color: #333;">${data.companyName} Team</strong>
        </p>
      </div>

      <div style="background: #2d3748; color: #a0aec0; padding: 30px 20px; text-align: center; font-size: 13px;">
        <p style="margin: 0 0 10px 0;">
          &copy; ${new Date().getFullYear()} ${data.companyName}. All rights reserved.
        </p>
        <p style="margin: 0; opacity: 0.8;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
Payment Confirmation Request
Purchase Order: ${data.poNumber}

Dear ${data.supplierName},

We have issued payment for Purchase Order ${data.poNumber} in the amount of $${data.totalAmount.toFixed(2)}.

To help us maintain accurate records and complete the payment reconciliation process, please confirm receipt of this payment by visiting the following link:

${data.confirmationUrl}

Note: This confirmation link will expire in ${data.expiresInDays} days. After confirmation, our payment status will be automatically updated.

If you did not receive this payment or have any questions, please contact us at ${data.companyEmail}.

Thank you for your partnership!

Best regards,
${data.companyName} Team

---
© ${new Date().getFullYear()} ${data.companyName}. All rights reserved.
This is an automated message. Please do not reply to this email.
  `;

  return { html, text };
}
