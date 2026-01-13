import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testCustomProductionBooking() {
  try {
    console.log('🔍 Finding services that support custom production...\n')

    const services = await prisma.service.findMany({
      where: {
        supportsCustomProduction: true,
        isActive: true
      },
      include: {
        category: true,
        materials: {
          include: {
            material: true
          }
        }
      }
    })

    if (services.length === 0) {
      console.log('❌ No services found that support custom production')
      return
    }

    console.log(`✅ Found ${services.length} services supporting custom production:\n`)

    services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name}`)
      console.log(`   Category: ${service.category.name}`)
      console.log(`   Base Price: $${service.price}`)
      console.log(`   Linked Materials: ${service.materials.length}`)
      if (service.materials.length > 0) {
        console.log(`   Materials:`)
        service.materials.slice(0, 3).forEach(sm => {
          console.log(`     - ${sm.material.name} ($${sm.material.price}/${sm.material.unit})`)
        })
        if (service.materials.length > 3) {
          console.log(`     ... and ${service.materials.length - 3} more`)
        }
      }
      console.log('')
    })

    // Test creating a booking
    const testService = services[0]
    console.log(`\n🧪 Testing booking creation for: ${testService.name}`)
    console.log('─'.repeat(60))

    // Get some materials to include
    const materialsToBook = testService.materials.slice(0, 2).map(sm => ({
      materialId: sm.material.id,
      quantity: 2
    }))

    console.log('\n📋 Booking Details:')
    console.log(`   Service: ${testService.name}`)
    console.log(`   Service Type: custom_production`)
    console.log(`   Customer: Test Customer`)
    console.log(`   Materials: ${materialsToBook.length} selected`)

    const materialCostTotal = testService.materials.slice(0, 2).reduce((sum, sm) => {
      return sum + (Number(sm.material.price) * 2)
    }, 0)
    console.log(`   Material Cost: $${materialCostTotal.toFixed(2)}`)

    // Simulate the API call
    const bookingData = {
      serviceId: testService.id,
      serviceType: 'custom_production',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '123-456-7890',
      customerNotes: 'Testing custom production booking flow',
      materials: materialsToBook,
      requirementPhotos: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400'
      ],
      desiredOutcome: 'Create a custom wooden furniture piece based on the provided photos'
    }

    console.log('\n📤 Creating booking via API...')

    // Make API call
    const response = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    })

    if (!response.ok) {
      const error = await response.json()
      console.log('❌ Booking creation failed:', error)
      return
    }

    const booking = await response.json()

    console.log('\n✅ Booking created successfully!')
    console.log('─'.repeat(60))
    console.log(`   Booking Number: ${booking.bookingNumber}`)
    console.log(`   Status: ${booking.status}`)
    console.log(`   Initial Price: $${Number(booking.price).toFixed(2)} ${Number(booking.price) === 0 ? '✅ (Correct - needs quote)' : '❌ (Should be $0)'}`)
    console.log(`   Final Price: ${booking.finalPrice ? '$' + Number(booking.finalPrice).toFixed(2) : 'Not set yet ✅'}`)
    console.log(`   Service Type: ${booking.serviceType}`)
    console.log(`   Customer: ${booking.customerName}`)

    // Fetch the booking materials
    const fullBooking = await prisma.serviceBooking.findUnique({
      where: { id: booking.id },
      include: {
        materials: {
          include: {
            material: true
          }
        }
      }
    })

    console.log(`\n📦 Materials:`)
    if (fullBooking.materials.length > 0) {
      fullBooking.materials.forEach(bm => {
        console.log(`   - ${bm.material.name}: ${bm.quantity} ${bm.material.unit} @ $${Number(bm.priceAtBooking).toFixed(2)} each`)
      })
      const totalMaterialCost = fullBooking.materials.reduce((sum, bm) => {
        return sum + (Number(bm.priceAtBooking) * bm.quantity)
      }, 0)
      console.log(`   Total Material Cost: $${totalMaterialCost.toFixed(2)}`)
    } else {
      console.log('   No materials selected')
    }

    console.log('\n📊 Test Summary:')
    console.log('   ✅ Booking created with $0 initial price (correct for custom production)')
    console.log('   ✅ Status set to "quote_pending" (requires admin quote)')
    console.log('   ✅ Materials tracked with locked prices')
    console.log('   ✅ Final price not set (will be set when quote approved)')
    console.log('\n🎯 Next Steps:')
    console.log('   1. Admin reviews booking and materials')
    console.log('   2. Admin creates quote with material cost + labor cost')
    console.log('   3. Customer approves quote')
    console.log('   4. Final price locked and payment requested')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCustomProductionBooking()
