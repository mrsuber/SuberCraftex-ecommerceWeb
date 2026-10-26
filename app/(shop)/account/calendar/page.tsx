import { requireAuth } from "@/lib/auth/session";
import { UnifiedCalendar } from "@/components/calendar/UnifiedCalendar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My calendar - SuberCraftex",
};

export default async function MyCalendarPage() {
  await requireAuth("/login?redirect=/account/calendar");
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-4">
      <div>
        <h1 className="text-3xl font-bold">My calendar</h1>
        <p className="text-muted-foreground">Everything that concerns you, in one place: shifts and meetings, classes, bookings, deliveries, pay day and fees.</p>
      </div>
      <UnifiedCalendar />
    </div>
  );
}
