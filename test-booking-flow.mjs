import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function testBookingFlow() {
  console.log('\n🧪 Testing Booking Creation Flow')
  console.log('=================================\n')
  
  try {
    // Get a service to book
    const service = await prisma.service.findFirst({
      where: { isActive: true },
      include: { category: true }
    })
    
    if (!service) {
      console.log('❌ No active services found')
      return
    }
    
    console.log(`1️⃣  Selected service: ${service.name}`)
    console.log(`   Category: ${service.category?.name}`)
    console.log(`   Price: $${service.price}`)
    console.log(`   Duration: ${service.duration}\n`)
    
    // Test creating a booking (we'll use API for this)
    const bookingData = {
      serviceId: service.id,
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      scheduledTime: '10:00',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '+1234567890',
      customerNotes: 'Test booking for services system'
    }
    
    console.log('2️⃣  Creating test booking...')
    console.log(`   Date: ${new Date(bookingData.scheduledDate).toLocaleDateString()}`)
    console.log(`   Time: ${bookingData.scheduledTime}`)
    
    const response = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    })
    
    if (response.ok) {
      const booking = await response.json()
      console.log(`   ✅ Booking created successfully!`)
      console.log(`   Booking #: ${booking.bookingNumber}`)
      console.log(`   Status: ${booking.status}\n`)
      
      // Verify booking was saved
      const savedBooking = await prisma.serviceBooking.findUnique({
        where: { id: booking.id },
        include: { service: true }
      })
      
      if (savedBooking) {
        console.log('3️⃣  ✅ Booking verified in database')
        console.log(`   Service: ${savedBooking.service.name}`)
        console.log(`   Customer: ${savedBooking.customerName}`)
        console.log(`   Email: ${savedBooking.customerEmail}\n`)
        
        // Clean up test booking
        await prisma.serviceBooking.delete({ where: { id: booking.id } })
        console.log('4️⃣  ✅ Test booking cleaned up\n')
      }
    } else {
      const error = await response.json()
      console.log(`   ❌ Booking creation failed: ${error.error}\n`)
    }
    
    console.log('✅ Booking flow test completed!\n')
    
  } catch (error) {
    console.error('❌ Error during booking flow test:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testBookingFlow()
