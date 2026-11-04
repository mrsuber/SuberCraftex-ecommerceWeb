import nodemailer from 'nodemailer';

// Create reusable transporter using existing SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  /** Customers recorded by staff may have no email: then nothing is sent */
  to: string | null | undefined;
  subject: string;
  html: string;
  text?: string;
}) => {
  if (!to) {
    return { success: false, messageId: 'no-recipient' };
  }
  // Tests and local setups without SMTP set EMAIL_DISABLED=1: nothing is sent
  if (process.env.EMAIL_DISABLED === '1') {
    return { success: true, messageId: 'disabled' };
  }
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'SuberCraftex'}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      text: text || '',
      html,
    });

    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};
