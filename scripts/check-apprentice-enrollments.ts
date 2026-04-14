import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const apprenticeNumber = "APP-2026-003";

  console.log(`\n🔍 Checking enrollments for ${apprenticeNumber}...\n`);

  const apprentice = await db.apprentice.findFirst({
    where: { apprenticeNumber },
    include: {
      enrollments: {
        select: {
          id: true,
          serviceTrack: true,
          status: true,
          startDate: true,
          completionDate: true,
          totalAssignments: true,
        },
        orderBy: { startDate: "desc" },
      },
    },
  });

  if (!apprentice) {
    console.log("❌ Apprentice not found!");
    return;
  }

  console.log("✅ Apprentice found:");
  console.log(`  Name: ${apprentice.fullName}`);
  console.log(`  Primary Service Track: ${apprentice.serviceTrack}`);
  console.log(`  Status: ${apprentice.status}`);
  console.log(`\n📚 Enrollments (${apprentice.enrollments.length}):\n`);

  if (apprentice.enrollments.length === 0) {
    console.log("  ⚠️  No enrollments found!");
  } else {
    apprentice.enrollments.forEach((enrollment, idx) => {
      console.log(`  ${idx + 1}. ${enrollment.serviceTrack}`);
      console.log(`     Status: ${enrollment.status}`);
      console.log(`     Start: ${enrollment.startDate.toLocaleDateString()}`);
      console.log(`     Completion: ${enrollment.completionDate?.toLocaleDateString() || "Not completed"}`);
      console.log(`     Total Assignments: ${enrollment.totalAssignments}`);
      console.log("");
    });
  }

  // Check what would be passed to the page
  const enrolledTracks = apprentice.enrollments
    .filter(e => ["active", "paused"].includes(e.status))
    .map(e => e.serviceTrack);

  console.log("📋 Tracks that would be passed to CurriculumBrowser:");
  console.log(`  enrolledTracks: [${enrolledTracks.join(", ")}]`);
  console.log(`  Length: ${enrolledTracks.length}`);
  console.log(`  Should show dropdown: ${enrolledTracks.length > 1 ? "YES" : "NO"}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => {
    db.$disconnect();
  });
