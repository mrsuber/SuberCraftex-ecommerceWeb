import { requireAdmin } from "@/lib/auth/session";
import { UnifiedCalendar } from "@/components/calendar/UnifiedCalendar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Schedule - Admin Dashboard",
};

export default async function SchedulePage() {
  await requireAdmin();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Schedule</h1>
        <p className="text-muted-foreground">The whole shop on one calendar: staff shifts and meetings, apprentice classes, bookings, fittings, repairs, deliveries, pay day, fees due and investor exits.</p>
      </div>
      <UnifiedCalendar canCreate />
    </div>
  );
}
