import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email/mailer";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

// POST /api/timetable/reminders/send - Send email reminders for upcoming events
export async function POST(request: NextRequest) {
  try {
    // Get the time window for reminders (default: next 24 hours)
    const { searchParams } = new URL(request.url);
    const hoursAhead = parseInt(searchParams.get("hoursAhead") || "24");
    const reminderType = searchParams.get("reminderType") || "one_day_before";

    const now = new Date();
    const futureDate = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

    // Find events that are starting within the time window
    const upcomingEvents = await db.timetableEvent.findMany({
      where: {
        startTime: {
          gte: now,
          lte: futureDate,
        },
        status: "scheduled",
      },
      include: {
        attendees: {
          where: {
            status: {
              in: ["invited", "confirmed"],
            },
            reminderSent: false,
          },
          include: {
            apprentice: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (upcomingEvents.length === 0) {
      return NextResponse.json({
        message: "No upcoming events found requiring reminders",
        remindersSent: 0,
      });
    }

    let remindersSent = 0;
    const errors: string[] = [];

    // Send reminders for each event
    for (const event of upcomingEvents) {
      for (const attendee of event.attendees) {
        try {
          // Create email content
          const emailSubject = `Reminder: ${event.title}`;
          const emailHtml = `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                  .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
                  .event-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                  .detail-row { margin: 10px 0; }
                  .label { font-weight: bold; color: #6b7280; }
                  .value { color: #111827; }
                  .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
                  .button { background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Event Reminder</h1>
                  </div>
                  <div class="content">
                    <p>Hi ${attendee.apprentice.fullName},</p>
                    <p>This is a reminder about your upcoming event:</p>

                    <div class="event-details">
                      <h2 style="margin-top: 0; color: #4F46E5;">${event.title}</h2>

                      ${event.description ? `<p>${event.description}</p>` : ""}

                      <div class="detail-row">
                        <span class="label">📅 Date & Time:</span>
                        <span class="value">${format(new Date(event.startTime), "MMMM d, yyyy 'at' h:mm a")}</span>
                      </div>

                      <div class="detail-row">
                        <span class="label">⏱️ Duration:</span>
                        <span class="value">${format(new Date(event.startTime), "h:mm a")} - ${format(new Date(event.endTime), "h:mm a")}</span>
                      </div>

                      ${
                        event.location
                          ? `
                        <div class="detail-row">
                          <span class="label">📍 Location:</span>
                          <span class="value">${event.location}</span>
                        </div>
                      `
                          : ""
                      }

                      ${
                        event.notes
                          ? `
                        <div class="detail-row">
                          <span class="label">📝 Notes:</span>
                          <span class="value">${event.notes}</span>
                        </div>
                      `
                          : ""
                      }
                    </div>

                    <p>Please make sure to attend this event. If you have any questions or need to reschedule, please contact your mentor or administrator.</p>

                    <p>See you there!</p>
                  </div>
                  <div class="footer">
                    <p>SuberCraftex Apprenticeship Program</p>
                    <p>This is an automated reminder. Please do not reply to this email.</p>
                  </div>
                </div>
              </body>
            </html>
          `;

          const emailText = `
Hi ${attendee.apprentice.fullName},

This is a reminder about your upcoming event:

${event.title}
${event.description || ""}

Date & Time: ${format(new Date(event.startTime), "MMMM d, yyyy 'at' h:mm a")}
Duration: ${format(new Date(event.startTime), "h:mm a")} - ${format(new Date(event.endTime), "h:mm a")}
${event.location ? `Location: ${event.location}` : ""}
${event.notes ? `Notes: ${event.notes}` : ""}

Please make sure to attend this event.

SuberCraftex Apprenticeship Program
          `;

          // Send email
          await sendEmail({
            to: attendee.apprentice.email,
            subject: emailSubject,
            html: emailHtml,
            text: emailText,
          });

          // Log the reminder
          await db.reminderLog.create({
            data: {
              eventId: event.id,
              apprenticeId: attendee.apprenticeId,
              reminderType: reminderType as any,
              emailTo: attendee.apprentice.email,
              emailSubject,
              emailBody: emailText,
              emailStatus: "sent",
            },
          });

          // Mark reminder as sent
          await db.timetableEventAttendee.update({
            where: { id: attendee.id },
            data: { reminderSent: true },
          });

          remindersSent++;
          console.log(
            `✅ Sent reminder to ${attendee.apprentice.fullName} (${attendee.apprentice.email}) for event: ${event.title}`
          );
        } catch (error: any) {
          console.error(
            `❌ Failed to send reminder to ${attendee.apprentice.email}:`,
            error
          );

          // Log the failed reminder
          await db.reminderLog.create({
            data: {
              eventId: event.id,
              apprenticeId: attendee.apprenticeId,
              reminderType: reminderType as any,
              emailTo: attendee.apprentice.email,
              emailSubject: `Reminder: ${event.title}`,
              emailBody: "",
              emailStatus: "failed",
              errorMessage: error.message || "Unknown error",
            },
          });

          errors.push(
            `Failed to send to ${attendee.apprentice.email}: ${error.message}`
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${remindersSent} reminder(s) for ${upcomingEvents.length} event(s)`,
      remindersSent,
      eventsProcessed: upcomingEvents.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error sending reminders:", error);
    return NextResponse.json(
      { error: "Failed to send reminders" },
      { status: 500 }
    );
  }
}
