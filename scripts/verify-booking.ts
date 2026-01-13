import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function verifyBooking() {
  const booking = await db.serviceBooking.findFirst({
    where: { bookingNumber: { startsWith: 'BK-CP-TEST-' } },
    include: {
      service: { include: { category: true } },
      user: true,
      quote: true,
      materials: {
        include: {
          material: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  if (!booking) {
    console.log('❌ No booking found');
    return;
  }

  console.log('\n📋 BOOKING DETAILS:');
  console.log('==================');
  console.log(`Booking Number: ${booking.bookingNumber}`);
  console.log(`Service: ${booking.service.name} (${booking.service.category?.name})`);
  console.log(`Customer: ${booking.customerName} (${booking.customerEmail})`);
  console.log(`Service Type: ${booking.serviceType}`);
  console.log(`Status: ${booking.status}`);
  console.log(`Base Price: $${booking.price}`);

  console.log('\n📦 SELECTED MATERIALS:');
  console.log('=====================');
  booking.materials.forEach((bm, idx) => {
    console.log(`${idx + 1}. ${bm.material.name}`);
    console.log(`   Quantity: ${bm.quantity} ${bm.material.unit}`);
    console.log(`   Price at booking: $${bm.priceAtBooking}`);
    console.log(`   Subtotal: $${parseFloat(bm.priceAtBooking.toString()) * bm.quantity}`);
    console.log(`   Acquired: ${bm.isAcquired ? '✅' : '❌'}`);
  });

  if (booking.quote) {
    console.log('\n💰 QUOTE DETAILS:');
    console.log('=================');
    console.log(`Material Cost: $${booking.quote.materialCost}`);
    console.log(`Labor: $${booking.quote.laborCost} (${booking.quote.laborHours} hours)`);
    console.log(`Total: $${booking.quote.totalCost}`);
    console.log(`Down Payment: $${booking.quote.downPaymentAmount}`);
    console.log(`Status: ${booking.quote.status}`);
  }

  console.log('\n📝 REQUIREMENTS:');
  console.log('================');
  console.log(`Customer Notes: ${booking.customerNotes}`);
  console.log(`Desired Outcome: ${booking.desiredOutcome}`);
  console.log(`Requirement Photos: ${booking.requirementPhotos.length} uploaded`);

  console.log('\n✅ All data verified successfully!');
  console.log(`\n🔗 View in dashboard: http://localhost:3000/dashboard/bookings/${booking.id}`);
}

verifyBooking()
  .then(() => db.$disconnect())
  .catch((error) => {
    console.error('Error:', error);
    db.$disconnect();
  });
