import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const services = await prisma.service.count()
  const categories = await prisma.serviceCategory.count()
  const bookings = await prisma.serviceBooking.count()
  
  console.log(`\n📊 Database Status:`)
  console.log(`   Services: ${services}`)
  console.log(`   Service Categories: ${categories}`)
  console.log(`   Bookings: ${bookings}\n`)
  
  if (categories === 0 || services === 0) {
    console.log('⚠️  No test data found - creating sample services...\n')
    return false
  }
  return true
}

main()
  .then(hasData => process.exit(hasData ? 0 : 1))
  .catch(console.error)
  .finally(() => prisma.$disconnect())
