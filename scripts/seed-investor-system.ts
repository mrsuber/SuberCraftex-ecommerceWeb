import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Seeding investor system...')

  // Clean up existing test data
  console.log('🧹 Cleaning up existing test data...')

  // Delete in correct order to respect foreign key constraints
  await db.profitDistribution.deleteMany({
    where: {
      investor: {
        email: {
          in: ['investor1@test.com', 'investor2@test.com', 'investor3@test.com', 'investor4@test.com', 'investor5@test.com'],
        },
      },
    },
  })

  await db.equipmentJobUsage.deleteMany({
    where: {
      equipment: {
        equipmentNumber: {
          in: ['EQP-2024-0001', 'EQP-2024-0002'],
        },
      },
    },
  })

  await db.withdrawalRequest.deleteMany({
    where: {
      investor: {
        email: {
          in: ['investor1@test.com', 'investor2@test.com', 'investor3@test.com', 'investor4@test.com', 'investor5@test.com'],
        },
      },
    },
  })

  await db.investorTransaction.deleteMany({
    where: {
      investor: {
        email: {
          in: ['investor1@test.com', 'investor2@test.com', 'investor3@test.com', 'investor4@test.com', 'investor5@test.com'],
        },
      },
    },
  })

  await db.investorEquipmentAllocation.deleteMany({
    where: {
      investor: {
        email: {
          in: ['investor1@test.com', 'investor2@test.com', 'investor3@test.com', 'investor4@test.com', 'investor5@test.com'],
        },
      },
    },
  })

  await db.investorProductAllocation.deleteMany({
    where: {
      investor: {
        email: {
          in: ['investor1@test.com', 'investor2@test.com', 'investor3@test.com', 'investor4@test.com', 'investor5@test.com'],
        },
      },
    },
  })

  await db.investorDeposit.deleteMany({
    where: {
      investor: {
        email: {
          in: ['investor1@test.com', 'investor2@test.com', 'investor3@test.com', 'investor4@test.com', 'investor5@test.com'],
        },
      },
    },
  })

  await db.equipment.deleteMany({
    where: {
      equipmentNumber: {
        in: ['EQP-2024-0001', 'EQP-2024-0002'],
      },
    },
  })

  await db.investor.deleteMany({
    where: {
      email: {
        in: ['investor1@test.com', 'investor2@test.com', 'investor3@test.com', 'investor4@test.com', 'investor5@test.com'],
      },
    },
  })

  await db.user.deleteMany({
    where: {
      email: {
        in: ['investor1@test.com', 'investor2@test.com', 'investor3@test.com', 'investor4@test.com', 'investor5@test.com'],
      },
    },
  })

  console.log('✓ Cleanup complete\n')

  // Create investor users
  const password = await bcrypt.hash('password123', 10)

  // Investor 1 - Active and verified
  const investor1User = await db.user.upsert({
    where: { email: 'investor1@test.com' },
    update: {},
    create: {
      email: 'investor1@test.com',
      passwordHash: password,
      role: 'investor',
      fullName: 'John Kamara',
      phone: '+237670123456',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  })

  const investor1 = await db.investor.upsert({
    where: { userId: investor1User.id },
    update: {},
    create: {
      userId: investor1User.id,
      investorNumber: 'INV-2024-0001',
      fullName: 'John Kamara',
      email: 'investor1@test.com',
      phone: '+237670123456',
      idType: 'national_id',
      idNumber: 'CM-NID-123456789',
      idDocumentUrl: 'https://placehold.co/600x400/png?text=ID+Front',
      idDocumentBackUrl: 'https://placehold.co/600x400/png?text=ID+Back',
      selfieUrl: 'https://placehold.co/400x400/png?text=Selfie',
      kycStatus: 'approved',
      kycSubmittedAt: new Date('2024-01-10'),
      isVerified: true,
      verifiedAt: new Date('2024-01-11'),
      status: 'active',
      agreementAccepted: true,
      agreementAcceptedAt: new Date(),
      cashBalance: 0,
      profitBalance: 0,
      totalInvested: 500000, // 500,000 FCFA
      totalProfit: 0,
      totalWithdrawn: 0,
    },
  })

  console.log('✓ Created Investor 1: John Kamara (Active)')

  // Investor 2 - Active and verified
  const investor2User = await db.user.upsert({
    where: { email: 'investor2@test.com' },
    update: {},
    create: {
      email: 'investor2@test.com',
      passwordHash: password,
      role: 'investor',
      fullName: 'Marie Ngono',
      phone: '+237675234567',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  })

  const investor2 = await db.investor.upsert({
    where: { userId: investor2User.id },
    update: {},
    create: {
      userId: investor2User.id,
      investorNumber: 'INV-2024-0002',
      fullName: 'Marie Ngono',
      email: 'investor2@test.com',
      phone: '+237675234567',
      idType: 'passport',
      idNumber: 'CM-PASS-987654321',
      idDocumentUrl: 'https://placehold.co/600x400/png?text=Passport+Front',
      selfieUrl: 'https://placehold.co/400x400/png?text=Marie+Selfie',
      kycStatus: 'approved',
      kycSubmittedAt: new Date('2024-01-18'),
      isVerified: true,
      verifiedAt: new Date('2024-01-19'),
      status: 'active',
      agreementAccepted: true,
      agreementAcceptedAt: new Date(),
      cashBalance: 0,
      profitBalance: 0,
      totalInvested: 300000, // 300,000 FCFA
      totalProfit: 0,
      totalWithdrawn: 0,
    },
  })

  console.log('✓ Created Investor 2: Marie Ngono (Active)')

  // Investor 3 - Pending verification
  const investor3User = await db.user.upsert({
    where: { email: 'investor3@test.com' },
    update: {},
    create: {
      email: 'investor3@test.com',
      passwordHash: password,
      role: 'investor',
      fullName: 'Paul Njoh',
      phone: '+237678345678',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  })

  const investor3 = await db.investor.upsert({
    where: { userId: investor3User.id },
    update: {},
    create: {
      userId: investor3User.id,
      investorNumber: 'INV-2024-0003',
      fullName: 'Paul Njoh',
      email: 'investor3@test.com',
      phone: '+237678345678',
      idType: 'driver_license',
      idNumber: 'CM-DL-456789123',
      idDocumentUrl: 'https://placehold.co/600x400/png?text=Drivers+License+Front',
      idDocumentBackUrl: 'https://placehold.co/600x400/png?text=Drivers+License+Back',
      selfieUrl: 'https://placehold.co/400x400/png?text=Paul+Selfie',
      kycStatus: 'pending',
      kycSubmittedAt: new Date(),
      isVerified: false,
      status: 'pending_verification',
      agreementAccepted: true,
      agreementAcceptedAt: new Date(),
      cashBalance: 0,
      profitBalance: 0,
      totalInvested: 0,
      totalProfit: 0,
      totalWithdrawn: 0,
    },
  })

  console.log('✓ Created Investor 3: Paul Njoh (KYC Pending Review)')

  // Investor 4 - KYC Not Started (just registered, needs to submit documents)
  const investor4User = await db.user.upsert({
    where: { email: 'investor4@test.com' },
    update: {},
    create: {
      email: 'investor4@test.com',
      passwordHash: password,
      role: 'investor',
      fullName: 'Grace Mbeki',
      phone: '+237679456789',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  })

  const investor4 = await db.investor.upsert({
    where: { userId: investor4User.id },
    update: {},
    create: {
      userId: investor4User.id,
      investorNumber: 'INV-2024-0004',
      fullName: 'Grace Mbeki',
      email: 'investor4@test.com',
      phone: '+237679456789',
      kycStatus: 'not_started',
      isVerified: false,
      status: 'pending_verification',
      agreementAccepted: true,
      agreementAcceptedAt: new Date(),
      cashBalance: 0,
      profitBalance: 0,
      totalInvested: 0,
      totalProfit: 0,
      totalWithdrawn: 0,
    },
  })

  console.log('✓ Created Investor 4: Grace Mbeki (KYC Not Started)')

  // Investor 5 - KYC Rejected (needs to resubmit)
  const investor5User = await db.user.upsert({
    where: { email: 'investor5@test.com' },
    update: {},
    create: {
      email: 'investor5@test.com',
      passwordHash: password,
      role: 'investor',
      fullName: 'Emmanuel Fon',
      phone: '+237680567890',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  })

  const investor5 = await db.investor.upsert({
    where: { userId: investor5User.id },
    update: {},
    create: {
      userId: investor5User.id,
      investorNumber: 'INV-2024-0005',
      fullName: 'Emmanuel Fon',
      email: 'investor5@test.com',
      phone: '+237680567890',
      idType: 'national_id',
      idNumber: 'CM-NID-BLURRY123',
      idDocumentUrl: 'https://placehold.co/600x400/png?text=Blurry+ID',
      selfieUrl: 'https://placehold.co/400x400/png?text=Emmanuel+Selfie',
      kycStatus: 'rejected',
      kycSubmittedAt: new Date('2024-03-01'),
      kycRejectionReason: 'ID document is too blurry and text is not readable. Please upload a clearer photo of your ID card.',
      isVerified: false,
      status: 'pending_verification',
      agreementAccepted: true,
      agreementAcceptedAt: new Date(),
      cashBalance: 0,
      profitBalance: 0,
      totalInvested: 0,
      totalProfit: 0,
      totalWithdrawn: 0,
    },
  })

  console.log('✓ Created Investor 5: Emmanuel Fon (KYC Rejected - Needs Resubmission)')

  // Get admin user for transaction tracking
  const admin = await db.user.findFirst({
    where: { role: 'admin' },
  })

  if (!admin) {
    console.error('❌ No admin user found. Please run main seed first.')
    return
  }

  // Create deposits for investor 1
  console.log('\n💰 Creating deposits...')

  const deposit1 = await db.investorDeposit.create({
    data: {
      investorId: investor1.id,
      grossAmount: 300000,
      amount: 300000,
      paymentMethod: 'bank_transfer',
      referenceNumber: 'BT-2024-001',
      notes: 'Initial investment',
      confirmationStatus: 'confirmed',
      depositedAt: new Date('2024-01-15'),
    },
  })

  await db.investorTransaction.create({
    data: {
      investorId: investor1.id,
      type: 'deposit',
      amount: 300000,
      balanceAfter: 300000,
      profitAfter: 0,
      description: 'Deposit via bank_transfer (Ref: BT-2024-001)',
      notes: 'Initial investment',
      createdBy: admin.id,
    },
  })

  const deposit2 = await db.investorDeposit.create({
    data: {
      investorId: investor1.id,
      grossAmount: 200000,
      amount: 200000,
      paymentMethod: 'cash',
      notes: 'Second deposit',
      confirmationStatus: 'confirmed',
      depositedAt: new Date('2024-02-01'),
    },
  })

  await db.investorTransaction.create({
    data: {
      investorId: investor1.id,
      type: 'deposit',
      amount: 200000,
      balanceAfter: 500000,
      profitAfter: 0,
      description: 'Deposit via cash',
      notes: 'Second deposit',
      createdBy: admin.id,
    },
  })

  console.log('✓ Created 2 deposits for Investor 1 (500,000 FCFA total)')

  // Create deposits for investor 2
  const deposit3 = await db.investorDeposit.create({
    data: {
      investorId: investor2.id,
      grossAmount: 300000,
      amount: 300000,
      paymentMethod: 'mobile_payment',
      referenceNumber: 'MP-2024-001',
      notes: 'Mobile money transfer',
      confirmationStatus: 'confirmed',
      depositedAt: new Date('2024-01-20'),
    },
  })

  await db.investorTransaction.create({
    data: {
      investorId: investor2.id,
      type: 'deposit',
      amount: 300000,
      balanceAfter: 300000,
      profitAfter: 0,
      description: 'Deposit via mobile_payment (Ref: MP-2024-001)',
      notes: 'Mobile money transfer',
      createdBy: admin.id,
    },
  })

  console.log('✓ Created 1 deposit for Investor 2 (300,000 FCFA)')

  // Create equipment
  console.log('\n⚙️ Creating equipment...')

  const equipment1 = await db.equipment.create({
    data: {
      name: 'Industrial Sewing Machine',
      description: 'High-speed industrial sewing machine for tailoring',
      equipmentNumber: 'EQP-2024-0001',
      purchasePrice: 200000,
      currentValue: 200000,
      purchaseDate: new Date('2024-01-10'),
      category: 'tailoring_machine',
      location: 'Workshop A',
      specifications: {
        brand: 'Juki',
        model: 'DDL-8700',
        speed: '5500 stitches/min',
      },
      status: 'active',
    },
  })

  console.log('✓ Created Equipment 1: Industrial Sewing Machine (200,000 FCFA)')

  const equipment2 = await db.equipment.create({
    data: {
      name: 'Embroidery Machine',
      description: 'Computer-controlled embroidery machine',
      equipmentNumber: 'EQP-2024-0002',
      purchasePrice: 150000,
      currentValue: 150000,
      purchaseDate: new Date('2024-02-05'),
      category: 'embroidery_machine',
      location: 'Workshop B',
      specifications: {
        brand: 'Brother',
        model: 'PR-1050X',
        needles: '10-needle',
      },
      status: 'active',
    },
  })

  console.log('✓ Created Equipment 2: Embroidery Machine (150,000 FCFA)')

  // Get some products for allocation
  const products = await db.product.findMany({
    where: { isActive: true },
    take: 5,
  })

  if (products.length === 0) {
    console.error('❌ No products found. Please run main seed first.')
    return
  }

  console.log('\n📦 Allocating funds to products...')

  // Allocate investor 1 funds to products
  const product1 = products[0]
  const allocation1 = await db.investorProductAllocation.create({
    data: {
      investorId: investor1.id,
      productId: product1.id,
      amountAllocated: 150000,
      quantity: 15,
      purchasePrice: 10000,
      totalInvestment: 150000,
      quantityRemaining: 15,
      notes: 'First product allocation',
    },
  })

  await db.investorTransaction.create({
    data: {
      investorId: investor1.id,
      type: 'allocation_product',
      amount: 150000,
      balanceAfter: 350000,
      profitAfter: 0,
      productId: product1.id,
      description: `Allocated to ${product1.name} (15 units @ 10000 each)`,
      notes: 'First product allocation',
      createdBy: admin.id,
    },
  })

  console.log(`✓ Allocated 150,000 FCFA to ${product1.name} (15 units) for Investor 1`)

  // Allocate more to investor 1
  if (products.length > 1) {
    const product2 = products[1]
    const allocation2 = await db.investorProductAllocation.create({
      data: {
        investorId: investor1.id,
        productId: product2.id,
        amountAllocated: 100000,
        quantity: 20,
        purchasePrice: 5000,
        totalInvestment: 100000,
        quantityRemaining: 20,
        notes: 'Second product allocation',
      },
    })

    await db.investorTransaction.create({
      data: {
        investorId: investor1.id,
        type: 'allocation_product',
        amount: 100000,
        balanceAfter: 250000,
        profitAfter: 0,
        productId: product2.id,
        description: `Allocated to ${product2.name} (20 units @ 5000 each)`,
        notes: 'Second product allocation',
        createdBy: admin.id,
      },
    })

    console.log(`✓ Allocated 100,000 FCFA to ${product2.name} (20 units) for Investor 1`)
  }

  // Allocate investor 2 funds to products
  if (products.length > 2) {
    const product3 = products[2]
    const allocation3 = await db.investorProductAllocation.create({
      data: {
        investorId: investor2.id,
        productId: product3.id,
        amountAllocated: 120000,
        quantity: 12,
        purchasePrice: 10000,
        totalInvestment: 120000,
        quantityRemaining: 12,
        notes: 'Product allocation for investor 2',
      },
    })

    await db.investorTransaction.create({
      data: {
        investorId: investor2.id,
        type: 'allocation_product',
        amount: 120000,
        balanceAfter: 180000,
        profitAfter: 0,
        productId: product3.id,
        description: `Allocated to ${product3.name} (12 units @ 10000 each)`,
        notes: 'Product allocation for investor 2',
        createdBy: admin.id,
      },
    })

    console.log(`✓ Allocated 120,000 FCFA to ${product3.name} (12 units) for Investor 2`)
  }

  console.log('\n⚙️ Allocating funds to equipment...')

  // Allocate investor 1 to equipment 1 (50% ownership)
  const equipAlloc1 = await db.investorEquipmentAllocation.create({
    data: {
      investorId: investor1.id,
      equipmentId: equipment1.id,
      amountAllocated: 100000,
      investmentPercentage: 50, // 100k / 200k = 50%
      profitShare: 50,
      notes: 'Co-funding sewing machine',
    },
  })

  await db.investorTransaction.create({
    data: {
      investorId: investor1.id,
      type: 'allocation_equipment',
      amount: 100000,
      balanceAfter: 150000,
      profitAfter: 0,
      equipmentId: equipment1.id,
      description: `Allocated to Industrial Sewing Machine (50.00% ownership)`,
      notes: 'Co-funding sewing machine',
      createdBy: admin.id,
    },
  })

  console.log('✓ Allocated 100,000 FCFA to Industrial Sewing Machine (50% ownership) for Investor 1')

  // Allocate investor 2 to equipment 1 (30% ownership)
  const equipAlloc2 = await db.investorEquipmentAllocation.create({
    data: {
      investorId: investor2.id,
      equipmentId: equipment1.id,
      amountAllocated: 60000,
      investmentPercentage: 30, // 60k / 200k = 30%
      profitShare: 30,
      notes: 'Co-funding sewing machine',
    },
  })

  await db.investorTransaction.create({
    data: {
      investorId: investor2.id,
      type: 'allocation_equipment',
      amount: 60000,
      balanceAfter: 120000,
      profitAfter: 0,
      equipmentId: equipment1.id,
      description: `Allocated to Industrial Sewing Machine (30.00% ownership)`,
      notes: 'Co-funding sewing machine',
      createdBy: admin.id,
    },
  })

  console.log('✓ Allocated 60,000 FCFA to Industrial Sewing Machine (30% ownership) for Investor 2')

  // Company owns remaining 20% (40k)

  // Allocate investor 2 to equipment 2 (40% ownership)
  const equipAlloc3 = await db.investorEquipmentAllocation.create({
    data: {
      investorId: investor2.id,
      equipmentId: equipment2.id,
      amountAllocated: 60000,
      investmentPercentage: 40, // 60k / 150k = 40%
      profitShare: 40,
      notes: 'Investment in embroidery machine',
    },
  })

  await db.investorTransaction.create({
    data: {
      investorId: investor2.id,
      type: 'allocation_equipment',
      amount: 60000,
      balanceAfter: 60000,
      profitAfter: 0,
      equipmentId: equipment2.id,
      description: `Allocated to Embroidery Machine (40.00% ownership)`,
      notes: 'Investment in embroidery machine',
      createdBy: admin.id,
    },
  })

  console.log('✓ Allocated 60,000 FCFA to Embroidery Machine (40% ownership) for Investor 2')

  // Update investor balances
  await db.investor.update({
    where: { id: investor1.id },
    data: {
      cashBalance: 150000, // 500k - 150k - 100k - 100k
    },
  })

  await db.investor.update({
    where: { id: investor2.id },
    data: {
      cashBalance: 60000, // 300k - 120k - 60k - 60k
    },
  })

  console.log('\n✓ Updated investor balances')

  // Create some equipment job usages and distribute profits
  console.log('\n💼 Creating equipment job usages...')

  const job1 = await db.equipmentJobUsage.create({
    data: {
      equipmentId: equipment1.id,
      jobDescription: 'Custom suit tailoring for client',
      revenue: 50000,
      materialCost: 20000,
      laborCost: 10000,
      maintenanceCost: 2000,
      taxCost: 1000,
      otherExpenses: 0,
      totalExpenses: 33000,
      netProfit: 17000,
      companyProfit: 8500, // 50%
      investorPoolProfit: 8500, // 50%
      profitDistributed: true,
      jobDate: new Date('2024-03-01'),
    },
  })

  // Distribute profit to investors
  // Investor 1: 50% share → 8500 * 0.5 = 4,250
  // Investor 2: 30% share → 8500 * 0.3 = 2,550
  // Company: 20% share + 8,500 company profit = 10,200

  const profit1 = await db.profitDistribution.create({
    data: {
      investorId: investor1.id,
      equipmentId: equipment1.id,
      saleRevenue: 50000,
      saleCost: 33000,
      grossProfit: 17000,
      companyShare: 8500,
      investorShare: 4250,
      description: 'Equipment job: Custom suit tailoring for client',
      notes: '50.00% share of equipment profit',
    },
  })

  await db.investorTransaction.create({
    data: {
      investorId: investor1.id,
      type: 'profit_credit',
      amount: 4250,
      balanceAfter: 150000,
      profitAfter: 4250,
      equipmentId: equipment1.id,
      description: 'Profit from Industrial Sewing Machine: Custom suit tailoring for client',
      notes: '50.00% of 8500 pool',
      createdBy: admin.id,
    },
  })

  await db.investor.update({
    where: { id: investor1.id },
    data: {
      profitBalance: 4250,
      totalProfit: 4250,
    },
  })

  await db.investorEquipmentAllocation.update({
    where: { id: equipAlloc1.id },
    data: {
      totalProfitReceived: 4250,
    },
  })

  const profit2 = await db.profitDistribution.create({
    data: {
      investorId: investor2.id,
      equipmentId: equipment1.id,
      saleRevenue: 50000,
      saleCost: 33000,
      grossProfit: 17000,
      companyShare: 8500,
      investorShare: 2550,
      description: 'Equipment job: Custom suit tailoring for client',
      notes: '30.00% share of equipment profit',
    },
  })

  await db.investorTransaction.create({
    data: {
      investorId: investor2.id,
      type: 'profit_credit',
      amount: 2550,
      balanceAfter: 60000,
      profitAfter: 2550,
      equipmentId: equipment1.id,
      description: 'Profit from Industrial Sewing Machine: Custom suit tailoring for client',
      notes: '30.00% of 8500 pool',
      createdBy: admin.id,
    },
  })

  await db.investor.update({
    where: { id: investor2.id },
    data: {
      profitBalance: 2550,
      totalProfit: 2550,
    },
  })

  await db.investorEquipmentAllocation.update({
    where: { id: equipAlloc2.id },
    data: {
      totalProfitReceived: 2550,
    },
  })

  await db.equipment.update({
    where: { id: equipment1.id },
    data: {
      totalRevenue: 50000,
      totalProfit: 17000,
      maintenanceCost: 2000,
    },
  })

  console.log('✓ Created job usage and distributed profit:')
  console.log('  - Investor 1 received 4,250 FCFA profit')
  console.log('  - Investor 2 received 2,550 FCFA profit')
  console.log('  - Company received 10,200 FCFA (8,500 + 20% equipment share)')

  // Create second job for equipment 2
  const job2 = await db.equipmentJobUsage.create({
    data: {
      equipmentId: equipment2.id,
      jobDescription: 'Custom embroidery on 10 jackets',
      revenue: 30000,
      materialCost: 8000,
      laborCost: 6000,
      maintenanceCost: 1000,
      taxCost: 500,
      otherExpenses: 500,
      totalExpenses: 16000,
      netProfit: 14000,
      companyProfit: 7000, // 50%
      investorPoolProfit: 7000, // 50%
      profitDistributed: true,
      jobDate: new Date('2024-03-05'),
    },
  })

  // Investor 2: 40% share → 7000 * 0.4 = 2,800
  const profit3 = await db.profitDistribution.create({
    data: {
      investorId: investor2.id,
      equipmentId: equipment2.id,
      saleRevenue: 30000,
      saleCost: 16000,
      grossProfit: 14000,
      companyShare: 7000,
      investorShare: 2800,
      description: 'Equipment job: Custom embroidery on 10 jackets',
      notes: '40.00% share of equipment profit',
    },
  })

  await db.investorTransaction.create({
    data: {
      investorId: investor2.id,
      type: 'profit_credit',
      amount: 2800,
      balanceAfter: 60000,
      profitAfter: 5350, // 2550 + 2800
      equipmentId: equipment2.id,
      description: 'Profit from Embroidery Machine: Custom embroidery on 10 jackets',
      notes: '40.00% of 7000 pool',
      createdBy: admin.id,
    },
  })

  await db.investor.update({
    where: { id: investor2.id },
    data: {
      profitBalance: 5350,
      totalProfit: 5350,
    },
  })

  await db.investorEquipmentAllocation.update({
    where: { id: equipAlloc3.id },
    data: {
      totalProfitReceived: 2800,
    },
  })

  await db.equipment.update({
    where: { id: equipment2.id },
    data: {
      totalRevenue: 30000,
      totalProfit: 14000,
      maintenanceCost: 1000,
    },
  })

  console.log('✓ Created second job usage:')
  console.log('  - Investor 2 received 2,800 FCFA profit from embroidery machine')

  // Create withdrawal requests
  console.log('\n💸 Creating withdrawal requests...')

  const withdrawal1 = await db.withdrawalRequest.create({
    data: {
      investorId: investor1.id,
      requestNumber: 'WDR-2024-0001',
      type: 'profit',
      amount: 2000,
      status: 'pending',
      requestReason: 'Personal expenses',
      investorNotes: 'Need funds for personal use',
      requestedBy: investor1User.id,
    },
  })

  console.log('✓ Created profit withdrawal request for Investor 1 (2,000 FCFA - Pending)')

  const withdrawal2 = await db.withdrawalRequest.create({
    data: {
      investorId: investor2.id,
      requestNumber: 'WDR-2024-0002',
      type: 'cash',
      amount: 50000,
      status: 'approved',
      approvedAmount: 50000,
      requestReason: 'Partial cash withdrawal',
      investorNotes: 'Withdrawing part of available cash',
      requestedBy: investor2User.id,
      reviewedBy: admin.id,
      reviewedAt: new Date(),
      adminNotes: 'Approved for withdrawal',
    },
  })

  console.log('✓ Created cash withdrawal request for Investor 2 (50,000 FCFA - Approved)')

  const withdrawal3 = await db.withdrawalRequest.create({
    data: {
      investorId: investor1.id,
      requestNumber: 'WDR-2024-0003',
      type: 'equipment_share',
      amount: 0,
      equipmentId: equipment1.id,
      status: 'pending',
      requestReason: 'Exit from equipment investment',
      investorNotes: 'Want to exit from sewing machine investment',
      requestedBy: investor1User.id,
    },
  })

  console.log('✓ Created equipment exit request for Investor 1 (Sewing Machine - Pending)')

  console.log('\n✅ Investor system seeding completed!')
  console.log('\n📊 Summary:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Investors Created: 5')
  console.log('  - KYC Approved (Active): 2')
  console.log('  - KYC Pending Review: 1')
  console.log('  - KYC Not Started: 1')
  console.log('  - KYC Rejected: 1')
  console.log('')
  console.log('Equipment Created: 2')
  console.log('  - Industrial Sewing Machine (200k)')
  console.log('  - Embroidery Machine (150k)')
  console.log('')
  console.log('Investor 1 (John Kamara) - KYC APPROVED:')
  console.log('  - Total Invested: 500,000 FCFA')
  console.log('  - Cash Balance: 150,000 FCFA')
  console.log('  - Profit Balance: 4,250 FCFA')
  console.log('  - Product Allocations: 2 (250,000 FCFA)')
  console.log('  - Equipment: 50% of Sewing Machine (100,000 FCFA)')
  console.log('')
  console.log('Investor 2 (Marie Ngono) - KYC APPROVED:')
  console.log('  - Total Invested: 300,000 FCFA')
  console.log('  - Cash Balance: 60,000 FCFA')
  console.log('  - Profit Balance: 5,350 FCFA')
  console.log('  - Product Allocations: 1 (120,000 FCFA)')
  console.log('  - Equipment: 30% of Sewing Machine + 40% of Embroidery (120,000 FCFA)')
  console.log('')
  console.log('Investor 3 (Paul Njoh) - KYC PENDING:')
  console.log('  - Documents submitted, awaiting admin review')
  console.log('  - No investments yet')
  console.log('')
  console.log('Investor 4 (Grace Mbeki) - KYC NOT STARTED:')
  console.log('  - Needs to complete KYC verification')
  console.log('  - Will be redirected to /investor/verify')
  console.log('')
  console.log('Investor 5 (Emmanuel Fon) - KYC REJECTED:')
  console.log('  - Previous submission rejected (blurry ID)')
  console.log('  - Can resubmit documents')
  console.log('')
  console.log('Withdrawal Requests: 3')
  console.log('  - Pending: 2')
  console.log('  - Approved: 1')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n🔐 Test Credentials (all use password: password123):')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('investor1@test.com - KYC Approved, can access dashboard')
  console.log('investor2@test.com - KYC Approved, can access dashboard')
  console.log('investor3@test.com - KYC Pending, limited dashboard access')
  console.log('investor4@test.com - KYC Not Started, redirects to verify page')
  console.log('investor5@test.com - KYC Rejected, redirects to verify page')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding investor system:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
