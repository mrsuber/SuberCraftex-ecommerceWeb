import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Creating admin user...\n');

  const email = 'admin@subercraftex.com';
  const password = 'admin123';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists:');
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${existingAdmin.role}`);
    console.log(`   Password: admin123`);
    console.log(`\n🔐 Login at: ${process.env.NEXT_PUBLIC_APP_URL}/login`);
    console.log(`📊 Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
    return;
  }

  // Create admin user
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: 'admin',
      fullName: 'Admin User',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('✅ Admin user created successfully!\n');
  console.log('📋 Admin Credentials:');
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Role: ${admin.role}`);
  console.log(`\n🔐 Login at: ${process.env.NEXT_PUBLIC_APP_URL}/login`);
  console.log(`📊 Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
