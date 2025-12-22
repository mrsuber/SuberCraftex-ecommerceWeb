# Email Setup Guide

Email confirmation is now configured for order creation. Follow these steps to set up email sending.

## Email Features

When a customer places an order, they will receive:
- ✅ Order confirmation with order number
- ✅ Beautiful HTML email template with SuberCraftex branding
- ✅ Complete order details (items, pricing, shipping address)
- ✅ Order tracking link (when available)

## Setup Options

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "SuberCraftex"
   - Copy the 16-character password

3. **Add to .env.local**:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=SuberCraftex
```

### Option 2: Other SMTP Providers

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=your-email@outlook.com
EMAIL_FROM_NAME=SuberCraftex
```

#### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=SuberCraftex
```

#### AWS SES
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-smtp-username
EMAIL_PASSWORD=your-smtp-password
EMAIL_FROM=verified@yourdomain.com
EMAIL_FROM_NAME=SuberCraftex
```

### Option 3: Development Mode (No Configuration)

If you don't configure email settings, the system will:
- ✅ Still create orders successfully
- ⚠️  Log a warning that email wasn't configured
- ℹ️  Show preview URLs in the console (using Ethereal test accounts)

## Testing Email

1. **Place a test order** through the checkout process

2. **Check server logs** for:
   ```
   ✅ Order confirmation email sent
   📧 Preview URL: https://ethereal.email/message/...
   ```

3. **For Gmail/SMTP**, check your email inbox

4. **For Ethereal (dev mode)**, click the preview URL to see the email

## Email Template Customization

The email template is located at:
```
lib/email/templates/order-confirmation.ts
```

You can customize:
- Colors (currently uses champagne gold #D4AF76)
- Logo and branding
- Email content and layout
- Footer information

## Troubleshooting

### Email not sending
- Check your EMAIL_* environment variables
- Verify SMTP credentials are correct
- Check server logs for error messages
- Ensure firewall allows SMTP connections

### Gmail "Less secure app" error
- Use App Passwords instead of your regular password
- Enable 2-Factor Authentication first

### Email goes to spam
- Use a verified domain email address
- Consider using a professional email service (SendGrid, AWS SES)
- Set up SPF, DKIM, and DMARC records for your domain

## Production Recommendations

For production, we recommend using a dedicated email service:

1. **SendGrid** - 100 free emails/day
2. **AWS SES** - Very affordable, reliable
3. **Resend** - Developer-friendly, good free tier
4. **Mailgun** - Robust features, good for high volume

These services provide:
- ✅ Better deliverability
- ✅ Detailed analytics
- ✅ Bounce/complaint handling
- ✅ Templates and personalization
- ✅ High sending limits

## Support

If you encounter issues, check:
1. Environment variables are set correctly
2. Server logs for detailed error messages
3. SMTP credentials are valid
4. Port 587 is not blocked by firewall
