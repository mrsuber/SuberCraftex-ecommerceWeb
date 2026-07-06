import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function populateApprenticeCalendar() {
  try {
    // Find the apprentice
    const apprentice = await prisma.apprentice.findFirst({
      where: {
        email: 'mohamad.siysinyuy@subercraftex.com'
      },
      include: {
        enrollments: true
      }
    });

    if (!apprentice) {
      console.error('Apprentice not found!');
      return;
    }

    console.log(`\n📋 Creating timetable for: ${apprentice.fullName}`);
    console.log(`📧 Email: ${apprentice.email}`);

    // Curriculum schedule configuration
    const curriculumSchedule = [
      {
        track: 'computing',
        hours: 2,
        startTime: '08:00',
        endTime: '10:00',
        daysPerWeek: 6, // Mon-Sat
        title: 'Computing Study Session'
      },
      {
        track: 'filmmaking',
        hours: 2,
        startTime: '10:00',
        endTime: '12:00',
        daysPerWeek: 6,
        title: 'Filmmaking & Video Production Study Session'
      },
      {
        track: 'drawing_sketching',
        hours: 2,
        startTime: '14:00',
        endTime: '16:00',
        daysPerWeek: 6,
        title: 'Drawing & Sketching Study Session'
      },
      {
        track: 'tailoring',
        hours: 2,
        startTime: '16:00',
        endTime: '18:00',
        daysPerWeek: 6,
        title: 'Tailoring Study Session'
      },
      {
        track: 'woodworking_aerospace',
        hours: 1,
        startTime: '21:30',
        endTime: '22:30',
        daysPerWeek: 6,
        title: 'Woodworking → Aerospace Study Session'
      }
    ];

    // Start date: next Monday
    const startDate = new Date();
    const dayOfWeek = startDate.getDay();
    const daysUntilMonday = (8 - dayOfWeek) % 7;
    startDate.setDate(startDate.getDate() + daysUntilMonday);
    startDate.setHours(0, 0, 0, 0);

    console.log(`\n📅 Timetable Start Date: ${startDate.toLocaleDateString()}`);

    // Track created events
    let totalEventsCreated = 0;
    let totalAssignmentsCreated = 0;

    for (const schedule of curriculumSchedule) {
      const enrollment = apprentice.enrollments.find(e => e.serviceTrack === schedule.track);

      if (!enrollment) {
        console.log(`\n❌ No enrollment found for ${schedule.track}`);
        continue;
      }

      // Get all assignment templates for this curriculum
      const assignmentTemplates = await prisma.assignmentTemplate.findMany({
        where: { serviceTrack: schedule.track as any },
        orderBy: [
          { level: 'asc' },
          { orderIndex: 'asc' },
          { assignmentNumber: 'asc' }
        ]
      });

      console.log(`\n📚 ${schedule.track.toUpperCase()}`);
      console.log(`   Total Templates: ${assignmentTemplates.length}`);

      // Create recurring study session events for the next 12 months
      const eventsToCreate = [];
      const currentDate = new Date(startDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 12); // 12 months of events

      let eventCount = 0;

      while (currentDate < endDate) {
        // Skip Sundays (day 0)
        if (currentDate.getDay() !== 0) {
          const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
          const [endHour, endMinute] = schedule.endTime.split(':').map(Number);

          const eventStart = new Date(currentDate);
          eventStart.setHours(startHour, startMinute, 0, 0);

          const eventEnd = new Date(currentDate);
          eventEnd.setHours(endHour, endMinute, 0, 0);

          eventsToCreate.push({
            apprenticeId: apprentice.id,
            createdBy: apprentice.mentorId,
            createdByRole: 'system',
            title: schedule.title,
            description: `Daily ${schedule.hours}-hour study session for ${schedule.track}`,
            startTime: eventStart,
            endTime: eventEnd,
            eventType: 'recurring_class',
            status: 'scheduled',
            isRecurring: true,
            recurrencePattern: 'daily'
          });

          eventCount++;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Create events in batches
      console.log(`   Creating ${eventsToCreate.length} calendar events...`);

      for (const eventData of eventsToCreate) {
        await prisma.calendarEvent.create({
          data: eventData
        });
      }

      totalEventsCreated += eventsToCreate.length;

      // Create assignments with deadlines
      // Assuming 3 days per assignment with 2 hours/day = 6 hours total
      // Or 6 days for 1 hour/day curriculum
      const daysPerAssignment = schedule.hours === 2 ? 3 : 6;

      console.log(`   Creating ${assignmentTemplates.length} assignments with deadlines...`);

      let assignmentDate = new Date(startDate);
      let createdCount = 0;

      for (const template of assignmentTemplates) {
        // Calculate due date
        const dueDate = new Date(assignmentDate);
        let daysAdded = 0;
        let targetDays = daysPerAssignment;

        // Add days, skipping Sundays
        while (daysAdded < targetDays) {
          dueDate.setDate(dueDate.getDate() + 1);
          if (dueDate.getDay() !== 0) { // Skip Sundays
            daysAdded++;
          }
        }

        // Set due time to end of study session
        const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
        dueDate.setHours(endHour, endMinute, 0, 0);

        // Create assignment
        await prisma.apprenticeAssignment.create({
          data: {
            apprenticeId: apprentice.id,
            enrollmentId: enrollment.id,
            templateId: template.id,
            title: template.title,
            description: template.description,
            instructions: template.instructions,
            assignedDate: assignmentDate,
            dueDate: dueDate,
            status: 'pending',
            assignedBy: apprentice.mentorId, // Assigned by their mentor
            isCustom: false
          }
        });

        // Move to next assignment start date (day after previous due date)
        assignmentDate = new Date(dueDate);
        assignmentDate.setDate(assignmentDate.getDate() + 1);

        // Skip Sundays
        while (assignmentDate.getDay() === 0) {
          assignmentDate.setDate(assignmentDate.getDate() + 1);
        }

        createdCount++;

        // Log progress every 10 assignments
        if (createdCount % 10 === 0) {
          console.log(`   Progress: ${createdCount}/${assignmentTemplates.length} assignments created`);
        }
      }

      totalAssignmentsCreated += createdCount;

      const lastAssignment = assignmentDate;
      console.log(`   ✅ Curriculum complete by: ${lastAssignment.toLocaleDateString()}`);
    }

    console.log(`\n✅ Timetable Creation Complete!`);
    console.log(`   Total Calendar Events: ${totalEventsCreated}`);
    console.log(`   Total Assignments: ${totalAssignmentsCreated}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateApprenticeCalendar();
