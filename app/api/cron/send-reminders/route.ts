import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email/mailer";
import { format } from "date-fns";
import { isCronRequest } from "@/lib/cron-auth";

export const dynamic = "force-dynamic";

// POST /api/cron/send-reminders - Send pending calendar reminders (Called by cron job)
export async function POST(request: NextRequest) {
  try {
    // Security check - verify cron secret
    if (!isCronRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Find all pending reminders that should be sent now
    const pendingReminders = await db.calendarReminder.findMany({
      where: {
        emailStatus: "pending",
        scheduledFor: {
          lte: now,
        },
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            startTime: true,
            endTime: true,
            location: true,
            notes: true,
            eventType: true,
          },
        },
        apprentice: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      take: 100, // Process in batches of 100
    });

    if (pendingReminders.length === 0) {
      return NextResponse.json({
        message: "No pending reminders to send",
        remindersSent: 0,
      });
    }

    let successCount = 0;
    let failureCount = 0;

    // Send each reminder
    for (const reminder of pendingReminders) {
      try {
        // Build email content
        const timeUntilEvent = reminder.event.startTime.getTime() - now.getTime();
        const hoursUntil = Math.round(timeUntilEvent / (1000 * 60 * 60));

        let timeMessage = "";
        if (hoursUntil <= 1) {
          timeMessage = "in less than 1 hour";
        } else if (hoursUntil <= 24) {
          timeMessage = `in ${hoursUntil} hours`;
        } else {
          const daysUntil = Math.round(hoursUntil / 24);
          timeMessage = `in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}`;
        }

        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9fafb; padding: 30px 20px; border: 1px solid #e5e7eb; }
                .event-card { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .detail-row { margin: 12px 0; display: flex; align-items: start; }
                .icon { margin-right: 12px; color: #6366f1; }
                .label { font-weight: 600; color: #4b5563; min-width: 80px; }
                .value { color: #111827; }
                .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; background-color: #f3f4f6; border-radius: 0 0 8px 8px; }
                .cta-button { display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
                .time-highlight { background-color: #fef3c7; padding: 8px 16px; border-radius: 6px; text-align: center; font-weight: 600; color: #92400e; margin: 15px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0; font-size: 28px;">🔔 Event Reminder</h1>
                </div>
                <div class="content">
                  <p style="font-size: 16px; margin-bottom: 10px;">Hi ${reminder.apprentice.fullName},</p>

                  <div class="time-highlight">
                    Your event starts ${timeMessage}!
                  </div>

                  <div class="event-card">
                    <h2 style="margin: 0 0 15px 0; color: #6366f1; font-size: 22px;">${reminder.event.title}</h2>

                    ${reminder.event.description ? `
                      <p style="color: #6b7280; margin: 0 0 20px 0;">${reminder.event.description}</p>
                    ` : ""}

                    <div class="detail-row">
                      <span class="icon">📅</span>
                      <div>
                        <div class="label">Date & Time</div>
                        <div class="value">${format(reminder.event.startTime, "EEEE, MMMM d, yyyy 'at' h:mm a")}</div>
                      </div>
                    </div>

                    <div class="detail-row">
                      <span class="icon">⏱️</span>
                      <div>
                        <div class="label">Duration</div>
                        <div class="value">${format(reminder.event.startTime, "h:mm a")} - ${format(reminder.event.endTime, "h:mm a")}</div>
                      </div>
                    </div>

                    ${reminder.event.location ? `
                      <div class="detail-row">
                        <span class="icon">📍</span>
                        <div>
                          <div class="label">Location</div>
                          <div class="value">${reminder.event.location}</div>
                        </div>
                      </div>
                    ` : ""}

                    ${reminder.event.notes ? `
                      <div class="detail-row">
                        <span class="icon">📝</span>
                        <div>
                          <div class="label">Notes</div>
                          <div class="value">${reminder.event.notes}</div>
                        </div>
                      </div>
                    ` : ""}
                  </div>

                  <p style="margin-top: 20px;">Please make sure you're prepared and on time. If you have any questions or need to reschedule, please contact your mentor or administrator as soon as possible.</p>

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://subercraftex.com"}/apprentice/dashboard/calendar" class="cta-button">
                      View My Calendar
                    </a>
                  </div>
                </div>
                <div class="footer">
                  <p style="margin: 5px 0;"><strong>SuberCraftex Apprenticeship Program</strong></p>
                  <p style="margin: 5px 0;">This is an automated reminder. You cannot opt out of event reminders.</p>
                  <p style="margin: 5px 0; color: #9ca3af;">Sent at ${format(now, "PPP p")}</p>
                </div>
              </div>
            </body>
          </html>
        `;

        // Send email
        await sendEmail({
          to: reminder.apprentice.email,
          subject: `Reminder: ${reminder.event.title} ${timeMessage}`,
          html: emailHtml,
        });

        // Update reminder status
        await db.calendarReminder.update({
          where: { id: reminder.id },
          data: {
            emailStatus: "sent",
            sentAt: now,
          },
        });

        successCount++;
        console.log(
          `✅ Sent reminder to ${reminder.apprentice.fullName} for event: ${reminder.event.title}`
        );
      } catch (error: any) {
        console.error(
          `❌ Failed to send reminder to ${reminder.apprentice.email}:`,
          error
        );

        // Update reminder with error
        await db.calendarReminder.update({
          where: { id: reminder.id },
          data: {
            emailStatus: "failed",
            errorMessage: error.message || "Unknown error",
          },
        });

        failureCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${pendingReminders.length} reminders`,
      remindersSent: successCount,
      failures: failureCount,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Error in reminder cron job:", error);
    return NextResponse.json(
      { error: "Failed to process reminders" },
      { status: 500 }
    );
  }
}

// GET endpoint for manual testing
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Reminder cron endpoint is active. Use POST with authorization header to trigger.",
    time: new Date().toISOString(),
  });
}
