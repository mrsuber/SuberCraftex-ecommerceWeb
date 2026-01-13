import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function testCustomProduction() {
  try {
    console.log('🧪 Testing Custom Production Booking Flow...\n');

    // 1. Find or create test customer
    console.log('1️⃣ Finding/creating test customer...');
    let customer = await db.user.findFirst({
      where: { role: 'customer' }
    });

    if (!customer) {
      // Use admin for testing if no customer exists
      customer = await db.user.findFirst({
        where: { role: 'admin' }
      });

      if (!customer) {
        // Last resort: create test customer
        customer = await db.user.create({
          data: {
            email: 'test.customer@subercraftex.com',
            fullName: 'Test Customer',
            role: 'customer',
            emailVerified: true,
            passwordHash: '$2a$10$test.hash.not.used.for.testing.purposes.only',
          }
        });
        console.log(`   ✅ Created test customer: ${customer.email}`);
      } else {
        console.log(`   ✅ Using admin as test customer: ${customer.email}`);
      }
    } else {
      console.log(`   ✅ Using existing customer: ${customer.email}`);
    }

    // 2. Find Custom Wedding Dress service
    console.log('\n2️⃣ Finding Custom Wedding Dress service...');
    const service = await db.service.findFirst({
      where: {
        OR: [
          { name: { contains: 'Wedding' } },
          { name: { contains: 'Dress' } },
          { slug: 'custom-wedding-dress' }
        ]
      },
      include: {
        category: true,
        materials: {
          include: {
            material: true
          }
        }
      }
    });

    if (!service) {
      throw new Error('Custom Wedding Dress service not found!');
    }
    console.log(`   ✅ Found service: ${service.name} (${service.id})`);
    console.log(`   📦 Available materials: ${service.materials.length}`);

    // 3. Display available materials
    console.log('\n3️⃣ Available materials for this service:');
    service.materials.forEach((sm) => {
      const required = sm.isRequired ? '🔴 REQUIRED' : '🟢 OPTIONAL';
      console.log(`   ${required} ${sm.material.name}`);
      console.log(`      Price: $${sm.material.price} | Stock: ${sm.material.stockQuantity} ${sm.material.unit}`);
      console.log(`      Default qty: ${sm.defaultQuantity} ${sm.material.unit}`);
    });

    // 4. Select materials for booking
    console.log('\n4️⃣ Selecting materials for custom production...');
    const selectedMaterials = [
      {
        material: service.materials.find(sm => sm.material.name.includes('Silk')),
        quantity: 5 // 5 yards
      },
      {
        material: service.materials.find(sm => sm.material.name.includes('Lace')),
        quantity: 3 // 3 yards
      },
      {
        material: service.materials.find(sm => sm.material.name.includes('Thread')),
        quantity: 5 // 5 spools
      }
    ].filter(m => m.material); // Filter out any not found

    console.log(`   ✅ Selected ${selectedMaterials.length} materials:`);
    selectedMaterials.forEach(({ material, quantity }) => {
      if (material) {
        const subtotal = parseFloat(material.material.price.toString()) * quantity;
        console.log(`      • ${material.material.name}: ${quantity} ${material.material.unit} @ $${material.material.price} = $${subtotal}`);
      }
    });

    // 5. Create custom production booking
    console.log('\n5️⃣ Creating custom production booking...');
    const bookingNumber = `BK-CP-TEST-${Date.now()}`;

    const booking = await db.serviceBooking.create({
      data: {
        bookingNumber,
        userId: customer.id,
        serviceId: service.id,
        duration: 120, // 120 minutes (2 hours) for custom production consultation
        status: 'quote_pending',
        serviceType: 'custom_production',
        customerName: customer.fullName || 'Test Customer',
        customerEmail: customer.email,
        customerPhone: '+1234567890',
        price: parseFloat(service.price.toString()),
        customerNotes: 'I would like a custom wedding dress with intricate lace details on the bodice and flowing silk skirt. Vintage-inspired design.',
        desiredOutcome: 'Elegant vintage-style wedding dress with lace bodice and silk skirt, size 8, cream/ivory color',
        requirementPhotos: [
          '/uploads/test/wedding-dress-inspiration-1.jpg',
          '/uploads/test/wedding-dress-inspiration-2.jpg'
        ],
        materials: {
          create: selectedMaterials.map(({ material, quantity }) => ({
            materialId: material!.material.id,
            quantity,
            priceAtBooking: material!.material.price,
            isAcquired: false
          }))
        }
      },
      include: {
        service: true,
        user: true,
        materials: {
          include: {
            material: true
          }
        }
      }
    });

    console.log(`   ✅ Created booking: ${booking.bookingNumber}`);
    console.log(`   📅 Status: ${booking.status}`);
    console.log(`   🎨 Service Type: ${booking.serviceType}`);

    // 6. Calculate material costs for quote
    console.log('\n6️⃣ Calculating material costs...');
    let totalMaterialCost = 0;
    booking.materials.forEach((bm) => {
      const cost = parseFloat(bm.priceAtBooking.toString()) * bm.quantity;
      totalMaterialCost += cost;
      console.log(`   • ${bm.material.name}: $${bm.priceAtBooking} × ${bm.quantity} = $${cost.toFixed(2)}`);
    });
    console.log(`   💰 Total Material Cost: $${totalMaterialCost.toFixed(2)}`);

    // 7. Create quote
    console.log('\n7️⃣ Creating quote...');
    const laborHours = 20; // 20 hours for custom wedding dress
    const laborRate = 50; // $50/hour
    const laborCost = laborHours * laborRate;
    const totalCost = totalMaterialCost + laborCost;
    const downPayment = totalCost * 0.5; // 50% down payment

    const quote = await db.quote.create({
      data: {
        bookingId: booking.id,
        materialCost: totalMaterialCost,
        laborCost: laborCost,
        laborHours: laborHours,
        totalCost: totalCost,
        downPaymentAmount: downPayment,
        status: 'draft',
        notes: 'Custom wedding dress with premium materials. Estimated 20 hours of work including design consultation, pattern creation, fittings, and final adjustments.',
      }
    });

    console.log(`   ✅ Created quote: ${quote.id}`);
    console.log(`   📊 Breakdown:`);
    console.log(`      Materials: $${quote.materialCost}`);
    console.log(`      Labor: $${quote.laborCost} (${quote.laborHours} hours @ $${laborRate}/hr)`);
    console.log(`      Total: $${quote.totalCost}`);
    console.log(`      Down Payment Required: $${quote.downPaymentAmount}`);

    // 8. Verify booking and materials
    console.log('\n8️⃣ Verifying booking data...');
    const verifiedBooking = await db.serviceBooking.findUnique({
      where: { id: booking.id },
      include: {
        service: true,
        user: true,
        quote: true,
        materials: {
          include: {
            material: true
          }
        }
      }
    });

    console.log(`   ✅ Booking verified: ${verifiedBooking?.bookingNumber}`);
    console.log(`   📦 Materials attached: ${verifiedBooking?.materials.length}`);
    console.log(`   💵 Quote attached: ${verifiedBooking?.quote ? 'Yes' : 'No'}`);
    console.log(`   📝 Customer notes: ${verifiedBooking?.customerNotes?.substring(0, 50)}...`);
    console.log(`   🎯 Desired outcome: ${verifiedBooking?.desiredOutcome?.substring(0, 50)}...`);

    // 9. Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ CUSTOM PRODUCTION BOOKING TEST COMPLETE!');
    console.log('='.repeat(60));
    console.log(`📋 Booking Number: ${booking.bookingNumber}`);
    console.log(`👤 Customer: ${customer.email}`);
    console.log(`🎨 Service: ${service.name}`);
    console.log(`📦 Materials Selected: ${booking.materials.length}`);
    console.log(`💰 Quote Total: $${quote.totalCost}`);
    console.log(`💵 Down Payment: $${quote.downPaymentAmount}`);
    console.log(`🔄 Status: ${booking.status} → Quote created`);
    console.log('='.repeat(60));

    console.log('\n🔗 Next steps to test:');
    console.log('   1. Admin views booking in dashboard');
    console.log('   2. Admin sends quote to customer');
    console.log('   3. Customer approves quote');
    console.log('   4. Materials are reserved (inventory decremented)');
    console.log('   5. Customer pays down payment');
    console.log('   6. Admin tracks progress with updates');

  } catch (error) {
    console.error('❌ Error during test:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

testCustomProduction()
  .then(() => {
    console.log('\n✅ Test script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test script failed:', error);
    process.exit(1);
  });
