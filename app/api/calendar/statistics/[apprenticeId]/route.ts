import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/api-auth";

export const dynamic = "force-dynamic";

// GET /api/calendar/statistics/[apprenticeId] - Get self-discipline statistics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ apprenticeId: string }> }
) {
  try {
    const user = await requireApiAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { apprenticeId } = await params;

    // Permission check
    if (user.role === "apprentice") {
      const apprentice = await db.apprentice.findUnique({
        where: { userId: user.id },
      });
      if (!apprentice || apprentice.id !== apprenticeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    // Get all completion logs for apprentice
    const completionLogs = await db.eventCompletionLog.findMany({
      where: { apprenticeId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            eventType: true,
            startTime: true,
            endTime: true,
          },
        },
      },
      orderBy: { loggedAt: "desc" },
    });

    // Calculate statistics
    const totalEvents = completionLogs.length;
    const completedEvents = completionLogs.filter((log) => log.wasCompleted).length;
    const incompleteEvents = totalEvents - completedEvents;
    const onTimeEvents = completionLogs.filter((log) => log.completedOnTime).length;
    const lateEvents = completedEvents - onTimeEvents;

    const completionRate = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;
    const onTimeRate = completedEvents > 0 ? (onTimeEvents / completedEvents) * 100 : 0;

    // Calculate total discipline score
    const totalDisciplinePoints = completionLogs.reduce(
      (sum, log) => sum + log.disciplinePoints,
      0
    );

    // Average discipline points per event
    const averageDisciplinePoints =
      totalEvents > 0 ? totalDisciplinePoints / totalEvents : 0;

    // Get statistics by event type
    const statsByType: Record<string, any> = {};
    completionLogs.forEach((log) => {
      const type = log.event.eventType;
      if (!statsByType[type]) {
        statsByType[type] = {
          total: 0,
          completed: 0,
          onTime: 0,
          disciplinePoints: 0,
        };
      }
      statsByType[type].total++;
      if (log.wasCompleted) {
        statsByType[type].completed++;
        if (log.completedOnTime) {
          statsByType[type].onTime++;
        }
      }
      statsByType[type].disciplinePoints += log.disciplinePoints;
    });

    // Recent performance (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentLogs = completionLogs.filter(
      (log) => new Date(log.loggedAt) >= thirtyDaysAgo
    );

    const recentCompletionRate =
      recentLogs.length > 0
        ? (recentLogs.filter((log) => log.wasCompleted).length / recentLogs.length) * 100
        : 0;

    // Performance trend (last 7 days grouped)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyLogs = completionLogs.filter(
      (log) => new Date(log.loggedAt) >= sevenDaysAgo
    );

    // Group by day
    const dailyStats: Record<string, { completed: number; total: number; points: number }> = {};
    weeklyLogs.forEach((log) => {
      const day = new Date(log.loggedAt).toISOString().split("T")[0];
      if (!dailyStats[day]) {
        dailyStats[day] = { completed: 0, total: 0, points: 0 };
      }
      dailyStats[day].total++;
      if (log.wasCompleted) {
        dailyStats[day].completed++;
      }
      dailyStats[day].points += log.disciplinePoints;
    });

    // Get self-discipline grade
    let disciplineGrade = "F";
    if (averageDisciplinePoints >= 8) disciplineGrade = "A+";
    else if (averageDisciplinePoints >= 6) disciplineGrade = "A";
    else if (averageDisciplinePoints >= 4) disciplineGrade = "B";
    else if (averageDisciplinePoints >= 2) disciplineGrade = "C";
    else if (averageDisciplinePoints >= 0) disciplineGrade = "D";

    return NextResponse.json({
      summary: {
        totalEvents,
        completedEvents,
        incompleteEvents,
        onTimeEvents,
        lateEvents,
        completionRate: Math.round(completionRate * 10) / 10,
        onTimeRate: Math.round(onTimeRate * 10) / 10,
        totalDisciplinePoints,
        averageDisciplinePoints: Math.round(averageDisciplinePoints * 10) / 10,
        disciplineGrade,
      },
      recentPerformance: {
        last30Days: {
          totalEvents: recentLogs.length,
          completionRate: Math.round(recentCompletionRate * 10) / 10,
        },
        last7Days: dailyStats,
      },
      byEventType: statsByType,
      recentEvents: completionLogs.slice(0, 10), // Last 10 events
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
