import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixApprenticeSchedule() {
  try {
    // Find the apprentice
    const apprentice = await prisma.apprentice.findFirst({
      where: {
        email: 'mohamad.siysinyuy@subercraftex.com'
      },
      include: {
        user: true
      }
    });

    if (!apprentice) {
      console.error('Apprentice not found!');
      return;
    }

    console.log(`\n📋 Fixing schedule for: ${apprentice.fullName}`);
    console.log(`📧 Email: ${apprentice.email}`);

    // STEP 1: Delete only personal events (created by apprentice)
    console.log(`\n🗑️  Deleting old personal events...`);

    const deletedPersonal = await prisma.calendarEvent.deleteMany({
      where: {
        apprenticeId: apprentice.id,
        createdBy: apprentice.userId, // Only delete events created by apprentice
        createdByRole: 'apprentice'
      }
    });

    console.log(`   Deleted ${deletedPersonal.count} personal events`);

    // Start date: next Monday
    const startDate = new Date();
    const dayOfWeek = startDate.getDay();
    const daysUntilMonday = (8 - dayOfWeek) % 7;
    startDate.setDate(startDate.getDate() + daysUntilMonday);
    startDate.setHours(0, 0, 0, 0);

    console.log(`\n📅 Start Date: ${startDate.toLocaleDateString()}`);

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 12); // 12 months of events

    // STEP 2: Create correct personal schedule
    console.log(`\n👤 Creating Corrected Personal Schedule...`);

    const personalSchedule = [
      // Daily events (every day including Sunday)
      { title: 'Morning Prayer (Fajr)', startTime: '04:00', endTime: '05:00', type: 'personal_event', everyDay: true },
      { title: 'Break', startTime: '05:00', endTime: '06:00', type: 'break', everyDay: true },
      { title: 'Sport & Exercise', startTime: '06:00', endTime: '07:00', type: 'personal_event', everyDay: true },
      { title: 'Preparation (Bath, Breakfast)', startTime: '07:00', endTime: '08:00', type: 'break', everyDay: true },
      { title: 'Lunch Break', startTime: '12:00', endTime: '13:30', type: 'break', everyDay: true },
      { title: 'Dhuhr Prayer', startTime: '13:30', endTime: '14:00', type: 'personal_event', everyDay: true },
      { title: 'Asr Prayer', startTime: '15:30', endTime: '16:00', type: 'personal_event', everyDay: true },
      { title: 'Dinner Break', startTime: '18:00', endTime: '18:30', type: 'break', everyDay: true },
      { title: 'Maghrib Prayer', startTime: '18:30', endTime: '19:00', type: 'personal_event', everyDay: true },
      { title: 'Sleep', startTime: '22:30', endTime: '04:00', type: 'personal_event', everyDay: true }
    ];

    let personalEventsCount = 0;
    const currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 4 = Thursday

      // Create daily events
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
            createdBy: apprentice.userId,
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

      // Add Thursday-specific or other day-specific events
      if (dayOfWeek === 4) {
        // Thursday: Client Presentation (7:00 PM - 10:30 PM)
        const presentationStart = new Date(currentDate);
        presentationStart.setHours(19, 0, 0, 0);

        const presentationEnd = new Date(currentDate);
        presentationEnd.setHours(22, 30, 0, 0);

        await prisma.calendarEvent.create({
          data: {
            apprenticeId: apprentice.id,
            createdBy: apprentice.userId,
            createdByRole: 'apprentice',
            title: 'Client Presentation',
            description: 'Weekly client presentation and progress report',
            startTime: presentationStart,
            endTime: presentationEnd,
            eventType: 'meeting',
            status: 'scheduled',
            isRecurring: true,
            recurrencePattern: 'weekly'
          }
        });

        personalEventsCount++;
      } else if (dayOfWeek !== 0) {
        // Other days (Mon-Wed, Fri-Sat): Nawafil Prayers (7:00 PM - 9:00 PM)
        const nawafilStart = new Date(currentDate);
        nawafilStart.setHours(19, 0, 0, 0);

        const nawafilEnd = new Date(currentDate);
        nawafilEnd.setHours(21, 0, 0, 0);

        await prisma.calendarEvent.create({
          data: {
            apprenticeId: apprentice.id,
            createdBy: apprentice.userId,
            createdByRole: 'apprentice',
            title: 'Nawafil Prayers (Voluntary)',
            description: 'Evening voluntary prayers and spiritual reflection',
            startTime: nawafilStart,
            endTime: nawafilEnd,
            eventType: 'personal_event',
            status: 'scheduled',
            isRecurring: true,
            recurrencePattern: 'daily'
          }
        });

        personalEventsCount++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`   ✅ Created ${personalEventsCount} corrected personal events`);

    console.log(`\n✅ Schedule Fixed Successfully!`);
    console.log(`\n📊 Summary:`);
    console.log(`   Personal Events Created: ${personalEventsCount}`);
    console.log(`\n⏰ Corrected Daily Schedule:`);
    console.log(`   04:00 - 05:00: Morning Prayer (Fajr)`);
    console.log(`   05:00 - 06:00: Break`);
    console.log(`   06:00 - 07:00: Sport & Exercise`);
    console.log(`   07:00 - 08:00: Preparation (Bath, Breakfast)`);
    console.log(`   08:00 - 10:00: Computing Study Session`);
    console.log(`   10:00 - 12:00: Filmmaking Study Session`);
    console.log(`   12:00 - 13:30: Lunch Break`);
    console.log(`   13:30 - 14:00: Dhuhr Prayer`);
    console.log(`   14:00 - 16:00: Drawing & Sketching Study Session`);
    console.log(`   15:30 - 16:00: Asr Prayer`);
    console.log(`   16:00 - 18:00: Tailoring Study Session`);
    console.log(`   18:00 - 18:30: Dinner Break`);
    console.log(`   18:30 - 19:00: Maghrib Prayer`);
    console.log(`   19:00 - 21:00: Nawafil Prayers (Mon-Wed, Fri-Sat)`);
    console.log(`   19:00 - 22:30: Client Presentation (Thursdays)`);
    console.log(`   21:30 - 22:30: Woodworking Study Session`);
    console.log(`   22:30 - 04:00: Sleep`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixApprenticeSchedule();
