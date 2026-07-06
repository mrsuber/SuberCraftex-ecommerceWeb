import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function populateCompleteTimetable() {
  try {
    // Find the apprentice
    const apprentice = await prisma.apprentice.findFirst({
      where: {
        email: 'mohamad.siysinyuy@subercraftex.com'
      },
      include: {
        enrollments: true,
        user: true
      }
    });

    if (!apprentice) {
      console.error('Apprentice not found!');
      return;
    }

    // Find an admin user to assign curriculum
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (!adminUser) {
      console.error('No admin user found!');
      return;
    }

    console.log(`\n📋 Creating complete timetable for: ${apprentice.fullName}`);
    console.log(`📧 Apprentice Email: ${apprentice.email}`);
    console.log(`👤 Apprentice User ID: ${apprentice.userId}`);
    console.log(`👨‍💼 Admin User ID: ${adminUser.id}`);

    // STEP 1: Clear existing calendar events and assignments
    console.log(`\n🗑️  Clearing existing calendar data...`);

    const deletedAssignments = await prisma.apprenticeAssignment.deleteMany({
      where: { apprenticeId: apprentice.id }
    });

    const deletedEvents = await prisma.calendarEvent.deleteMany({
      where: { apprenticeId: apprentice.id }
    });

    console.log(`   Deleted ${deletedAssignments.count} assignments`);
    console.log(`   Deleted ${deletedEvents.count} calendar events`);

    // Start date: next Monday
    const startDate = new Date();
    const dayOfWeek = startDate.getDay();
    const daysUntilMonday = (8 - dayOfWeek) % 7;
    startDate.setDate(startDate.getDate() + daysUntilMonday);
    startDate.setHours(0, 0, 0, 0);

    console.log(`\n📅 Timetable Start Date: ${startDate.toLocaleDateString()}`);

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 12); // 12 months of events

    // STEP 2: Create Personal Schedule (Created by Apprentice)
    console.log(`\n👤 Creating Personal Schedule Events (by Apprentice)...`);

    const personalSchedule = [
      { title: 'Morning Prayer', startTime: '04:00', endTime: '05:00', type: 'personal_event' },
      { title: 'Break', startTime: '05:00', endTime: '06:00', type: 'break' },
      { title: 'Sport & Exercise', startTime: '06:00', endTime: '07:00', type: 'personal_event' },
      { title: 'Preparation (Bath, Breakfast)', startTime: '07:00', endTime: '08:00', type: 'break' },
      { title: 'Lunch Break', startTime: '12:00', endTime: '13:30', type: 'break' },
      { title: 'Midday Prayer', startTime: '13:30', endTime: '14:00', type: 'personal_event' },
      { title: 'Dinner Break', startTime: '18:00', endTime: '18:30', type: 'break' },
      { title: 'Evening Prayer', startTime: '18:30', endTime: '19:00', type: 'personal_event' },
      { title: 'Break', startTime: '19:00', endTime: '19:30', type: 'break' },
      { title: 'Night Prayer', startTime: '19:30', endTime: '21:30', type: 'personal_event' },
      { title: 'Sleep', startTime: '22:30', endTime: '04:00', type: 'personal_event', isAllDay: false }
    ];

    let personalEventsCount = 0;
    const currentDate = new Date(startDate);

    while (currentDate < endDate) {
      // Create personal events every day (including Sunday)
      for (const schedule of personalSchedule) {
        const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
        const [endHour, endMinute] = schedule.endTime.split(':').map(Number);

        const eventStart = new Date(currentDate);
        eventStart.setHours(startHour, startMinute, 0, 0);

        const eventEnd = new Date(currentDate);
        // Handle sleep crossing midnight
        if (endHour < startHour) {
          eventEnd.setDate(eventEnd.getDate() + 1);
        }
        eventEnd.setHours(endHour, endMinute, 0, 0);

        await prisma.calendarEvent.create({
          data: {
            apprenticeId: apprentice.id,
            createdBy: apprentice.userId, // Created by apprentice
            createdByRole: 'apprentice',
            title: schedule.title,
            description: `Personal schedule: ${schedule.title}`,
            startTime: eventStart,
            endTime: eventEnd,
            eventType: schedule.type as any,
            status: 'scheduled',
            isRecurring: true,
            recurrencePattern: 'daily'
          }
        });

        personalEventsCount++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`   ✅ Created ${personalEventsCount} personal schedule events`);

    // STEP 3: Create Curriculum Study Sessions (Created by Admin)
    console.log(`\n👨‍💼 Creating Curriculum Study Sessions (by Admin)...`);

    const curriculumSchedule = [
      {
        track: 'computing',
        hours: 2,
        startTime: '08:00',
        endTime: '10:00',
        title: 'Computing Study Session',
        color: '#3B82F6' // Blue
      },
      {
        track: 'filmmaking',
        hours: 2,
        startTime: '10:00',
        endTime: '12:00',
        title: 'Filmmaking & Video Production Study Session',
        color: '#EF4444' // Red
      },
      {
        track: 'drawing_sketching',
        hours: 2,
        startTime: '14:00',
        endTime: '16:00',
        title: 'Drawing & Sketching Study Session',
        color: '#8B5CF6' // Purple
      },
      {
        track: 'tailoring',
        hours: 2,
        startTime: '16:00',
        endTime: '18:00',
        title: 'Tailoring Study Session',
        color: '#10B981' // Green
      },
      {
        track: 'woodworking_aerospace',
        hours: 1,
        startTime: '21:30',
        endTime: '22:30',
        title: 'Woodworking → Aerospace Study Session',
        color: '#F59E0B' // Amber
      }
    ];

    let totalCurriculumEvents = 0;
    let totalAssignments = 0;

    for (const schedule of curriculumSchedule) {
      const enrollment = apprentice.enrollments.find(e => e.serviceTrack === schedule.track);

      if (!enrollment) {
        console.log(`\n❌ No enrollment found for ${schedule.track}`);
        continue;
      }

      console.log(`\n📚 ${schedule.track.toUpperCase()}`);

      // Create study session events (Mon-Sat only)
      let eventCount = 0;
      const currentDate = new Date(startDate);

      while (currentDate < endDate) {
        // Skip Sundays (day 0)
        if (currentDate.getDay() !== 0) {
          const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
          const [endHour, endMinute] = schedule.endTime.split(':').map(Number);

          const eventStart = new Date(currentDate);
          eventStart.setHours(startHour, startMinute, 0, 0);

          const eventEnd = new Date(currentDate);
          eventEnd.setHours(endHour, endMinute, 0, 0);

          await prisma.calendarEvent.create({
            data: {
              apprenticeId: apprentice.id,
              createdBy: adminUser.id, // Created by admin
              createdByRole: 'admin',
              title: schedule.title,
              description: `${schedule.hours}-hour study session for ${schedule.track} curriculum`,
              startTime: eventStart,
              endTime: eventEnd,
              eventType: 'recurring_class',
              status: 'scheduled',
              isRecurring: true,
              recurrencePattern: 'daily',
              color: schedule.color
            }
          });

          eventCount++;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      totalCurriculumEvents += eventCount;
      console.log(`   Created ${eventCount} study session events`);

      // Get assignment templates
      const assignmentTemplates = await prisma.assignmentTemplate.findMany({
        where: { serviceTrack: schedule.track as any },
        orderBy: [
          { level: 'asc' },
          { orderIndex: 'asc' },
          { assignmentNumber: 'asc' }
        ]
      });

      console.log(`   Total Assignments to Create: ${assignmentTemplates.length}`);

      // Create assignments with deadlines
      const daysPerAssignment = schedule.hours === 2 ? 3 : 6;
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
          if (dueDate.getDay() !== 0) {
            daysAdded++;
          }
        }

        // Set due time to end of study session
        const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
        dueDate.setHours(endHour, endMinute, 0, 0);

        // Create assignment (assigned by admin)
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
            assignedBy: adminUser.id, // Assigned by admin
            isCustom: false
          }
        });

        // Move to next assignment start date
        assignmentDate = new Date(dueDate);
        assignmentDate.setDate(assignmentDate.getDate() + 1);

        // Skip Sundays
        while (assignmentDate.getDay() === 0) {
          assignmentDate.setDate(assignmentDate.getDate() + 1);
        }

        createdCount++;

        if (createdCount % 20 === 0) {
          console.log(`   Progress: ${createdCount}/${assignmentTemplates.length} assignments`);
        }
      }

      totalAssignments += createdCount;
      const lastDate = new Date(assignmentDate);
      console.log(`   ✅ ${createdCount} assignments created`);
      console.log(`   📅 Curriculum complete by: ${lastDate.toLocaleDateString()}`);
    }

    console.log(`\n✅ Complete Timetable Created Successfully!`);
    console.log(`\n📊 Summary:`);
    console.log(`   Personal Events (by Apprentice): ${personalEventsCount}`);
    console.log(`   Curriculum Sessions (by Admin): ${totalCurriculumEvents}`);
    console.log(`   Total Calendar Events: ${personalEventsCount + totalCurriculumEvents}`);
    console.log(`   Total Assignments (by Admin): ${totalAssignments}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateCompleteTimetable();
