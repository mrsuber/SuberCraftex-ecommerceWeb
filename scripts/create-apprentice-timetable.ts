import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createApprenticeTimetable() {
  try {
    // Find the apprentice
    const apprentice = await prisma.apprentice.findFirst({
      where: {
        email: 'mohamad.siysinyuy@subercraftex.com'
      },
      include: {
        enrollments: {
          include: {
            assignments: true
          }
        }
      }
    });

    if (!apprentice) {
      console.error('Apprentice not found!');
      return;
    }

    console.log(`\n📋 Apprentice: ${apprentice.fullName}`);
    console.log(`📧 Email: ${apprentice.email}`);
    console.log(`\n📚 Curriculum Enrollments:`);

    for (const enrollment of apprentice.enrollments) {
      const totalAssignments = await prisma.assignmentTemplate.count({
        where: { serviceTrack: enrollment.serviceTrack }
      });

      console.log(`  - ${enrollment.serviceTrack}: ${enrollment.completedAssignments}/${totalAssignments} completed`);
    }

    // Daily Schedule Structure
    const schedule = {
      '4:00 AM - 5:00 AM': 'Morning Prayer',
      '5:00 AM - 6:00 AM': 'Break',
      '6:00 AM - 7:00 AM': 'Sport/Exercise',
      '7:00 AM - 8:00 AM': 'Preparation (Bath, Breakfast)',
      '8:00 AM - 10:00 AM': 'Computing (2 hours)',
      '10:00 AM - 12:00 PM': 'Filmmaking & Video Production (2 hours)',
      '12:00 PM - 1:30 PM': 'Lunch Break',
      '1:30 PM - 2:00 PM': 'Prayer',
      '2:00 PM - 4:00 PM': 'Drawing & Sketching (2 hours)',
      '3:30 PM - 3:45 PM': 'Prayer (Brief)',
      '4:00 PM - 6:00 PM': 'Tailoring (2 hours)',
      '6:00 PM - 6:30 PM': 'Dinner Break',
      '6:30 PM - 7:00 PM': 'Prayer',
      '7:00 PM - 7:30 PM': 'Break',
      '7:30 PM - 9:30 PM': 'Evening Prayer',
      '9:30 PM - 10:30 PM': 'Woodworking → Aerospace (1 hour)',
      '10:30 PM': 'Sleep'
    };

    console.log(`\n📅 Daily Timetable:`);
    for (const [time, activity] of Object.entries(schedule)) {
      console.log(`  ${time}: ${activity}`);
    }

    // Get assignment counts for each curriculum
    const curriculumData = [
      { track: 'computing', hours: 2, startTime: '08:00', endTime: '10:00' },
      { track: 'filmmaking', hours: 2, startTime: '10:00', endTime: '12:00' },
      { track: 'drawing_sketching', hours: 2, startTime: '14:00', endTime: '16:00' },
      { track: 'tailoring', hours: 2, startTime: '16:00', endTime: '18:00' },
      { track: 'woodworking_aerospace', hours: 1, startTime: '21:30', endTime: '22:30' }
    ];

    console.log(`\n📊 Assignment Timeline Calculations:`);

    for (const curriculum of curriculumData) {
      const totalAssignments = await prisma.assignmentTemplate.count({
        where: { serviceTrack: curriculum.track as any }
      });

      // Assuming each assignment takes approximately 2-3 days to complete
      // With 2 hours per day, that's 4-6 hours per assignment
      const daysPerAssignment = 3;
      const totalDays = totalAssignments * daysPerAssignment;
      const totalWeeks = Math.ceil(totalDays / 7);
      const totalMonths = Math.ceil(totalWeeks / 4);

      console.log(`\n  ${curriculum.track.toUpperCase()}:`);
      console.log(`    - Total Assignments: ${totalAssignments}`);
      console.log(`    - Daily Study Time: ${curriculum.hours} hours`);
      console.log(`    - Estimated Days per Assignment: ${daysPerAssignment}`);
      console.log(`    - Total Duration: ${totalDays} days (~${totalWeeks} weeks, ~${totalMonths} months)`);
    }

    console.log(`\n✅ Timetable analysis complete!`);
    console.log(`\nNext step: Create calendar events for this schedule?`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createApprenticeTimetable();
