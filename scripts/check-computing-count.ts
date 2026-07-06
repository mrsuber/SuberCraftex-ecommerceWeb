import { PrismaClient } from '@prisma/client';

async function checkComputingCount() {
  const prisma = new PrismaClient();
  try {
    const count = await prisma.assignmentTemplate.count({
      where: { serviceTrack: 'computing' }
    });
    console.log('Computing assignments in database:', count);

    // Get a few samples to verify
    const samples = await prisma.assignmentTemplate.findMany({
      where: { serviceTrack: 'computing' },
      select: { assignmentNumber: true, title: true, level: true },
      orderBy: { assignmentNumber: 'asc' },
      take: 5
    });
    console.log('\nFirst 5 assignments:');
    samples.forEach(a => console.log(`  ${a.assignmentNumber}: ${a.title} (Level ${a.level})`));

    // Check last assignments
    const lastSamples = await prisma.assignmentTemplate.findMany({
      where: { serviceTrack: 'computing' },
      select: { assignmentNumber: true, title: true, level: true },
      orderBy: { assignmentNumber: 'desc' },
      take: 5
    });
    console.log('\nLast 5 assignments:');
    lastSamples.forEach(a => console.log(`  ${a.assignmentNumber}: ${a.title} (Level ${a.level})`));
  } finally {
    await prisma.$disconnect();
  }
}

checkComputingCount();
