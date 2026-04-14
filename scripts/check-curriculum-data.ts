import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("\n📊 Checking curriculum data integrity...\n");

  // Get counts by service track
  const templates = await db.assignmentTemplate.findMany({
    select: {
      id: true,
      assignmentNumber: true,
      title: true,
      serviceTrack: true,
      level: true,
      isActive: true,
    },
    orderBy: [{ serviceTrack: "asc" }, { level: "asc" }, { assignmentNumber: "asc" }],
  });

  // Group by service track
  const byTrack: Record<string, any[]> = {};
  templates.forEach((t) => {
    if (!byTrack[t.serviceTrack]) {
      byTrack[t.serviceTrack] = [];
    }
    byTrack[t.serviceTrack].push(t);
  });

  console.log("📋 Assignment Templates by Service Track:\n");
  Object.entries(byTrack).forEach(([track, assignments]) => {
    console.log(`  ${track}: ${assignments.length} assignments`);
    console.log(`    Levels: ${Math.min(...assignments.map(a => a.level))} - ${Math.max(...assignments.map(a => a.level))}`);
    console.log(`    Active: ${assignments.filter(a => a.isActive).length}`);

    // Show first 3 assignments for verification
    console.log(`    Sample assignments:`);
    assignments.slice(0, 3).forEach((a) => {
      console.log(`      - ${a.assignmentNumber}: ${a.title}`);
    });
    console.log("");
  });

  console.log("\n✅ Total assignments:", templates.length);

  // Check for any mismatches (e.g., tailoring assignments in wrong track)
  console.log("\n🔍 Checking for potential mismatches...\n");

  const possibleMismatches = templates.filter((t) => {
    const titleLower = t.title.toLowerCase();
    const trackLower = t.serviceTrack.toLowerCase();

    // Check if woodworking assignments are in wrong track
    if (titleLower.includes("woodwork") || titleLower.includes("aerospace") ||
        titleLower.includes("machining") || titleLower.includes("welding") ||
        titleLower.includes("foundry") || titleLower.includes("fusion 360")) {
      return !trackLower.includes("wood");
    }

    // Check if tailoring assignments are in wrong track
    if (titleLower.includes("tailor") || titleLower.includes("sewing") ||
        titleLower.includes("pattern") || titleLower.includes("garment")) {
      return trackLower !== "tailoring";
    }

    return false;
  });

  if (possibleMismatches.length > 0) {
    console.log(`❌ Found ${possibleMismatches.length} potential mismatches:`);
    possibleMismatches.forEach((t) => {
      console.log(`  - [${t.serviceTrack}] ${t.assignmentNumber}: ${t.title}`);
    });
  } else {
    console.log("✅ No obvious mismatches found!");
  }
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => {
    db.$disconnect();
  });
