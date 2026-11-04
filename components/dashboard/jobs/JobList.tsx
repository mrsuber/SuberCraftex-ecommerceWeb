import Link from "next/link";
import { Clock, MapPin, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/services/booking-workflow";
import type { JobJson } from "@/lib/services/job-lists";

const dateLabel = (ymd: string) =>
  new Date(`${ymd}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

/** A compact list of jobs, each opening the job page */
export function JobList({ jobs, empty, showDate = true, showWho = false }: { jobs: JobJson[]; empty: string; showDate?: boolean; showWho?: boolean }) {
  if (jobs.length === 0) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="divide-y rounded-lg border">
      {jobs.map((j) => (
        <li key={j.id}>
          <Link href={`/dashboard/bookings/${j.id}`} className="flex flex-col gap-1 px-3 py-2 text-sm hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between">
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{j.service}</span>
                <span className="text-muted-foreground">· {j.customer}</span>
                <Badge variant="outline" className="font-normal">
                  {STATUS_LABELS[j.status as keyof typeof STATUS_LABELS] ?? j.status}
                </Badge>
              </span>
              <span className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                {j.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {j.address}
                  </span>
                )}
                {j.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {j.phone}
                  </span>
                )}
                {showWho && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {j.assignedTo ?? "Not assigned"}
                  </span>
                )}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground sm:text-sm">
              <Clock className="h-3.5 w-3.5" />
              {showDate && j.date ? `${dateLabel(j.date)} ` : ""}
              {j.time ? `${j.time}${j.endTime ? `–${j.endTime}` : ""}` : j.date ? "" : "No date"}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
