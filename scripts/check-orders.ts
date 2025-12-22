import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking all orders in database...\n');

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  console.log(`Total orders found: ${orders.length}\n`);

  if (orders.length === 0) {
    console.log('❌ No orders found in database!');
    console.log('\nPossible reasons:');
    console.log('1. Order was not successfully created');
    console.log('2. Database connection issue');
    console.log('3. Order creation failed during checkout');
    return;
  }

  console.log('Orders:\n');
  orders.forEach((order, index) => {
    console.log(`${index + 1}. Order #${order.orderNumber}`);
    console.log(`   User ID: ${order.userId || 'N/A'}`);
    console.log(`   Guest Email: ${order.guestEmail || 'N/A'}`);
    console.log(`   Status: ${order.orderStatus}`);
    console.log(`   Total: $${order.totalAmount}`);
    console.log(`   Created: ${order.createdAt}`);
    console.log('');
  });

  // Also check all users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
    },
  });

  console.log(`\nTotal users found: ${users.length}\n`);
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.fullName || 'No name'} (${user.email})`);
    console.log(`   ID: ${user.id}`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
