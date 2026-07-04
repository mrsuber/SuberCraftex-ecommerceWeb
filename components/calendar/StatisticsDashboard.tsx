"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Calendar,
  Award,
  Target,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";

interface StatisticsDashboardProps {
  apprenticeId: string;
  apprenticeName: string;
}

export function StatisticsDashboard({ apprenticeId, apprenticeName }: StatisticsDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStatistics();
  }, [apprenticeId]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/calendar/statistics/${apprenticeId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">No Statistics Available</h1>
          <p className="text-muted-foreground">
            Start completing calendar events to see your self-discipline statistics.
          </p>
        </div>
      </div>
    );
  }

  const { summary, recentPerformance, byEventType, recentEvents } = stats;

  const getDisciplineGradeColor = (grade: string) => {
    if (grade === "A+" || grade === "A") return "bg-green-500";
    if (grade === "B") return "bg-blue-500";
    if (grade === "C") return "bg-yellow-500";
    if (grade === "D") return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Self-Discipline Statistics</h1>
        <p className="text-muted-foreground">
          Track your calendar event completion and self-discipline performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.totalEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.completedEvents} completed, {summary.incompleteEvents} incomplete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.completionRate}%</div>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${summary.completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              On-Time Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.onTimeRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.onTimeEvents} on time, {summary.lateEvents} late
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="h-4 w-4" />
              Discipline Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className={`${getDisciplineGradeColor(summary.disciplineGrade)} text-white text-3xl font-bold rounded-lg px-4 py-2`}>
                {summary.disciplineGrade}
              </div>
              <div className="text-sm">
                <div className="font-semibold">{summary.totalDisciplinePoints} pts</div>
                <div className="text-muted-foreground">
                  {summary.averageDisciplinePoints} avg
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="by-type">By Event Type</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Recent Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Performance
              </CardTitle>
              <CardDescription>Your performance over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Last 30 Days</p>
                    <p className="text-2xl font-bold">{recentPerformance.last30Days.totalEvents} events</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {recentPerformance.last30Days.completionRate}%
                    </p>
                  </div>
                </div>

                {/* Last 7 Days Daily Breakdown */}
                <div>
                  <h4 className="font-semibold mb-3">Last 7 Days Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(recentPerformance.last7Days).length > 0 ? (
                      Object.entries(recentPerformance.last7Days).map(([day, data]: [string, any]) => (
                        <div key={day} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                          <span className="text-sm font-medium">{format(new Date(day), "MMM dd, yyyy")}</span>
                          <div className="flex items-center gap-4 text-sm">
                            <span>{data.completed}/{data.total} completed</span>
                            <Badge variant="outline">+{data.points} pts</Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No activity in the last 7 days
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Events Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                  <div className="text-2xl font-bold">{summary.completedEvents}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">On-Time Completions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-blue-500" />
                  <div className="text-2xl font-bold">{summary.onTimeEvents}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Late Completions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <XCircle className="h-8 w-8 text-orange-500" />
                  <div className="text-2xl font-bold">{summary.lateEvents}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="by-type" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Statistics by Event Type
              </CardTitle>
              <CardDescription>Performance breakdown by different event types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.keys(byEventType).length > 0 ? (
                  Object.entries(byEventType).map(([type, data]: [string, any]) => (
                    <div key={type} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold capitalize">{type.replace(/_/g, " ")}</h4>
                        <Badge>+{data.disciplinePoints} pts</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="text-xl font-bold">{data.total}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Completed</p>
                          <p className="text-xl font-bold text-green-600">{data.completed}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">On Time</p>
                          <p className="text-xl font-bold text-blue-600">{data.onTime}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Completion Rate</span>
                          <span>{data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${data.total > 0 ? (data.completed / data.total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No event type data available yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Event Completions</CardTitle>
              <CardDescription>Your last 10 completed or logged events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEvents && recentEvents.length > 0 ? (
                  recentEvents.map((log: any) => (
                    <div key={log.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{log.event.title}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {log.event.eventType.replace(/_/g, " ")}
                          </p>
                        </div>
                        <Badge variant={log.wasCompleted ? "default" : "destructive"}>
                          {log.wasCompleted ? (log.completedOnTime ? "On Time" : "Late") : "Incomplete"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {format(new Date(log.event.startTime), "MMM dd, yyyy 'at' h:mm a")}
                        </span>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">+{log.disciplinePoints} pts</span>
                        </div>
                      </div>
                      {log.completionNotes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          "{log.completionNotes}"
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No recent activity to display
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
