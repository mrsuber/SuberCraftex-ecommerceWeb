import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting orders seed...');

  // Get a test user (you'll need to be logged in as this user)
  const user = await prisma.user.findFirst({
    where: { email: 'admin@subercraftex.com' },
  });

  if (!user) {
    console.error('❌ User not found. Please run the main seed first: npm run db:seed');
    return;
  }

  // Get some products
  const products = await prisma.product.findMany({
    take: 4,
  });

  if (products.length === 0) {
    console.error('❌ No products found. Please run the main seed first: npm run db:seed');
    return;
  }

  // Create sample orders
  const sampleOrders = [
    {
      orderNumber: `ORD-${Date.now()}-001`,
      userId: user.id,
      orderStatus: 'delivered' as const,
      paymentStatus: 'paid' as const,
      paymentMethod: 'card' as const,
      shippingMethod: 'express' as const,
      subtotal: 449.98,
      shippingCost: 15.00,
      taxAmount: 41.85,
      totalAmount: 506.83,
      shippingAddress: {
        fullName: user.fullName || 'John Doe',
        phone: '+1 (555) 123-4567',
        addressLine1: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
      },
      billingAddress: {
        fullName: user.fullName || 'John Doe',
        phone: '+1 (555) 123-4567',
        addressLine1: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
      },
      trackingNumber: 'TRACK123456',
      carrier: 'FedEx',
      paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      shippedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      deliveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      orderItems: [
        {
          productId: products[0].id,
          productName: products[0].name,
          productSku: products[0].sku,
          productImage: products[0].featuredImage,
          quantity: 1,
          price: parseFloat(products[0].price.toString()),
          total: parseFloat(products[0].price.toString()),
        },
        {
          productId: products[1].id,
          productName: products[1].name,
          productSku: products[1].sku,
          productImage: products[1].featuredImage,
          quantity: 1,
          price: parseFloat(products[1].price.toString()),
          total: parseFloat(products[1].price.toString()),
        },
      ],
    },
    {
      orderNumber: `ORD-${Date.now()}-002`,
      userId: user.id,
      orderStatus: 'shipped' as const,
      paymentStatus: 'paid' as const,
      paymentMethod: 'card' as const,
      shippingMethod: 'standard' as const,
      subtotal: 199.99,
      shippingCost: 10.00,
      taxAmount: 18.90,
      totalAmount: 228.89,
      shippingAddress: {
        fullName: user.fullName || 'John Doe',
        phone: '+1 (555) 123-4567',
        addressLine1: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
      },
      billingAddress: {
        fullName: user.fullName || 'John Doe',
        phone: '+1 (555) 123-4567',
        addressLine1: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
      },
      trackingNumber: 'TRACK789012',
      carrier: 'UPS',
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      shippedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      orderItems: [
        {
          productId: products[2].id,
          productName: products[2].name,
          productSku: products[2].sku,
          productImage: products[2].featuredImage,
          quantity: 1,
          price: parseFloat(products[2].price.toString()),
          total: parseFloat(products[2].price.toString()),
        },
      ],
    },
    {
      orderNumber: `ORD-${Date.now()}-003`,
      userId: user.id,
      orderStatus: 'processing' as const,
      paymentStatus: 'paid' as const,
      paymentMethod: 'card' as const,
      shippingMethod: 'standard' as const,
      subtotal: 89.99,
      shippingCost: 10.00,
      taxAmount: 9.00,
      totalAmount: 108.99,
      shippingAddress: {
        fullName: user.fullName || 'John Doe',
        phone: '+1 (555) 123-4567',
        addressLine1: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
      },
      billingAddress: {
        fullName: user.fullName || 'John Doe',
        phone: '+1 (555) 123-4567',
        addressLine1: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
      },
      paidAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      orderItems: [
        {
          productId: products[3].id,
          productName: products[3].name,
          productSku: products[3].sku,
          productImage: products[3].featuredImage,
          quantity: 1,
          price: parseFloat(products[3].price.toString()),
          total: parseFloat(products[3].price.toString()),
        },
      ],
    },
  ];

  for (const orderData of sampleOrders) {
    const { orderItems, ...orderInfo } = orderData;

    const order = await prisma.order.create({
      data: {
        ...orderInfo,
        orderItems: {
          create: orderItems,
        },
      },
    });

    console.log(`✅ Created order: ${order.orderNumber}`);
  }

  console.log('\n✅ Sample orders created successfully!');
  console.log(`📦 Created ${sampleOrders.length} orders for user: ${user.email}`);
  console.log('\n🎉 You can now view orders at http://localhost:3000/account');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding orders:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
