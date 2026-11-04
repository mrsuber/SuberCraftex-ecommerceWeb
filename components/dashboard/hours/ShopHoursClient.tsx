"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WeekHoursEditor } from "./WeekHoursEditor";
import { Closure, ClosuresEditor } from "./ClosuresEditor";
import { describeWeek, WeekHours } from "@/lib/services/week-hours";

export interface ServiceHoursRow {
  id: string;
  name: string;
  isActive: boolean;
  summary: string | null; // null = follows the shop
}

export function ShopHoursClient({ services }: { services: ServiceHoursRow[] }) {
  const [week, setWeek] = useState<WeekHours | null>(null);
  const [saved, setSaved] = useState<WeekHours | null>(null);
  const [closures, setClosures] = useState<Closure[]>([]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/service-hours");
    const body = await res.json();
    if (!res.ok) return toast.error(body.error || "Could not load the hours");
    setWeek(body.week);
    setSaved(body.week);
    setClosures(body.closures);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/service-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to save");
      toast.success("Shop hours saved");
      setSaved(body.week);
      setWeek(body.week);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (!week || !saved) {
    return (
      <p className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </p>
    );
  }
  const changed = JSON.stringify(week) !== JSON.stringify(saved);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shop hours</CardTitle>
          <CardDescription>Every service without hours of its own can be booked during these times. Now: {describeWeek(saved)}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <WeekHoursEditor value={week} onChange={setWeek} />
          <div className="flex items-center justify-end gap-3">
            {changed && <span className="text-sm text-amber-700">Unsaved changes</span>}
            <Button onClick={save} disabled={saving || !changed}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save shop hours
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shop closures and public holidays</CardTitle>
          <CardDescription>No service can be booked on these days.</CardDescription>
        </CardHeader>
        <CardContent>
          <ClosuresEditor serviceId={null} closures={closures} onChanged={load} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Each service</CardTitle>
          <CardDescription>Give a service its own hours, rules or closures.</CardDescription>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p className="text-sm text-muted-foreground">No services yet.</p>
          ) : (
            <ul className="divide-y rounded-lg border text-sm">
              {services.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{s.name}</span>
                    {!s.isActive && <Badge variant="outline">Inactive</Badge>}
                    <span className="text-muted-foreground">{s.summary ?? "Shop hours"}</span>
                  </span>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/services/${s.id}/hours`}>Set hours</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
