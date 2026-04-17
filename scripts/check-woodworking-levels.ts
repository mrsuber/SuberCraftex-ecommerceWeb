import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const assignments = await db.assignmentTemplate.findMany({
    where: {
      serviceTrack: "woodworking_aerospace",
      isActive: true,
    },
    select: {
      level: true,
      assignmentNumber: true,
      title: true,
    },
    orderBy: [{ level: "asc" }, { assignmentNumber: "asc" }],
  });

  console.log("\n📊 Woodworking-Aerospace Curriculum Assignment Distribution:\n");

  const byLevel: Record<number, typeof assignments> = {};
  assignments.forEach((a) => {
    if (!byLevel[a.level]) byLevel[a.level] = [];
    byLevel[a.level].push(a);
  });

  for (let i = 1; i <= 12; i++) {
    const levelAssignments = byLevel[i] || [];
    console.log(`Level ${i}: ${levelAssignments.length} assignments`);
    if (levelAssignments.length > 0) {
      levelAssignments.forEach((a) => {
        console.log(`  - ${a.assignmentNumber}: ${a.title}`);
      });
    } else {
      console.log(`  ⚠️  No assignments yet - needs to be expanded`);
    }
    console.log("");
  }

  console.log(`Total: ${assignments.length} assignments`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => {
    db.$disconnect();
  });
