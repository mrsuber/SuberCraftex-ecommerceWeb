import { db } from '../lib/db';
import { sendEmail } from '../lib/email/mailer';

async function testPaymentConfirmation() {
  try {
    console.log('🔍 Testing Payment Confirmation for PO: 2c9af17b-57da-4497-9b0e-8f16f374b34c\n');

    // 1. Check if purchase order exists
    const purchaseOrder = await db.purchaseOrder.findUnique({
      where: { id: '2c9af17b-57da-4497-9b0e-8f16f374b34c' },
      include: {
        supplier: true,
      },
    });

    if (!purchaseOrder) {
      console.error('❌ Purchase order not found!');
      return;
    }

    console.log('✅ Purchase Order Found:');
    console.log(`   PO Number: ${purchaseOrder.poNumber}`);
    console.log(`   Status: ${purchaseOrder.status}`);
    console.log(`   Payment Status: ${purchaseOrder.paymentStatus}`);
    console.log(`   Total Amount: $${purchaseOrder.totalAmount}`);
    console.log();

    console.log('✅ Supplier Information:');
    console.log(`   Name: ${purchaseOrder.supplier.name}`);
    console.log(`   Email: ${purchaseOrder.supplier.email}`);
    console.log(`   Contact: ${purchaseOrder.supplier.contactPerson || 'N/A'}`);
    console.log(`   Phone: ${purchaseOrder.supplier.phone || 'N/A'}`);
    console.log();

    // 2. Test email configuration
    console.log('🔧 Email Configuration:');
    console.log(`   SMTP Host: ${process.env.SMTP_HOST || 'NOT SET'}`);
    console.log(`   SMTP Port: ${process.env.SMTP_PORT || 'NOT SET'}`);
    console.log(`   SMTP Secure: ${process.env.SMTP_SECURE || 'NOT SET'}`);
    console.log(`   SMTP User: ${process.env.SMTP_USER || 'NOT SET'}`);
    console.log(`   SMTP From: ${process.env.SMTP_FROM_EMAIL || 'NOT SET'}`);
    console.log(`   SMTP From Name: ${process.env.SMTP_FROM_NAME || 'NOT SET'}`);
    console.log();

    // 3. Test email sending
    console.log('📧 Testing email send to supplier...');
    try {
      await sendEmail({
        to: purchaseOrder.supplier.email,
        subject: 'Test Email - Payment Confirmation System',
        html: '<h1>Test Email</h1><p>This is a test email to verify the payment confirmation system is working.</p>',
        text: 'Test Email - This is a test email to verify the payment confirmation system is working.',
      });
      console.log('✅ Test email sent successfully!');
    } catch (emailError) {
      console.error('❌ Email sending failed:');
      console.error(emailError);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await db.$disconnect();
  }
}

testPaymentConfirmation();
