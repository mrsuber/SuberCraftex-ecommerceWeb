"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Store, Clock3, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WeekHoursEditor } from "./WeekHoursEditor";
import { Closure, ClosuresEditor } from "./ClosuresEditor";
import { describeWeek, WeekHours } from "@/lib/services/week-hours";

interface Data {
  service: { id: string; name: string; category: string | null; isActive: boolean };
  mode: "shop" | "custom";
  week: WeekHours;
  shopWeek: WeekHours;
  rules: { bufferTime: number; maxBookingsPerDay: number | null; minNoticeMinutes: number; maxAdvanceDays: number };
  closures: Closure[];
}

const NOTICE_CHOICES = [
  { value: 0, label: "Any time" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2 hours" },
  { value: 240, label: "4 hours" },
  { value: 1440, label: "1 day" },
  { value: 2880, label: "2 days" },
];

/** Shop day as YYYY-MM-DD, `plus` days from today */
function shopDay(plus = 0) {
  return new Date(Date.now() + 3_600_000 + plus * 86_400_000).toISOString().slice(0, 10);
}

export function ServiceHoursClient({ serviceId }: { serviceId: string }) {
  const [data, setData] = useState<Data | null>(null);
  const [mode, setMode] = useState<"shop" | "custom">("shop");
  const [week, setWeek] = useState<WeekHours>([]);
  const [rules, setRules] = useState({ bufferTime: "0", maxBookingsPerDay: "", minNoticeMinutes: "30", maxAdvanceDays: "60" });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<Record<string, string[]> | null>(null);

  const loadPreview = useCallback(async () => {
    setPreview(null);
    const res = await fetch(`/api/services/${serviceId}/availability?startDate=${shopDay()}&endDate=${shopDay(13)}`);
    const body = await res.json().catch(() => ({}));
    setPreview(res.ok ? body.availability ?? {} : {});
  }, [serviceId]);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/services/${serviceId}/hours`);
    const body = await res.json();
    if (!res.ok) return toast.error(body.error || "Could not load the hours");
    setData(body);
    setMode(body.mode);
    setWeek(body.mode === "custom" ? body.week : body.shopWeek.map((d: WeekHours[number]) => d.map((w) => ({ ...w }))));
    setRules({
      bufferTime: String(body.rules.bufferTime),
      maxBookingsPerDay: body.rules.maxBookingsPerDay ? String(body.rules.maxBookingsPerDay) : "",
      minNoticeMinutes: String(body.rules.minNoticeMinutes),
      maxAdvanceDays: String(body.rules.maxAdvanceDays),
    });
    loadPreview();
  }, [serviceId, loadPreview]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/services/${serviceId}/hours`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, week: mode === "custom" ? week : undefined, rules }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to save");
      toast.success("Hours saved — customers see the new times now");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <p className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </p>
    );
  }

  const days = Array.from({ length: 14 }, (_, i) => shopDay(i));

  return (
    <div className="space-y-6">
      {!data.service.isActive && (
        <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
          This service is inactive, so customers cannot book it whatever its hours. Turn it on from its Edit page.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Opening hours</CardTitle>
          <CardDescription>When customers can book this service. Staff can still record a job at any time.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { value: "shop" as const, icon: Store, title: "Use the shop's hours", hint: describeWeek(data.shopWeek) },
              { value: "custom" as const, icon: Clock3, title: "Hours of its own", hint: "e.g. on-site visits only in the morning" },
            ].map((o) => (
              <button
                key={o.value}
                type="button"
                aria-pressed={mode === o.value}
                onClick={() => setMode(o.value)}
                className={`flex gap-3 rounded-lg border p-3 text-left text-sm transition ${mode === o.value ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "hover:bg-muted"}`}
              >
                <o.icon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <span className="block font-medium">{o.title}</span>
                  <span className="block text-xs text-muted-foreground">{o.hint}</span>
                </span>
              </button>
            ))}
          </div>
          {mode === "shop" ? (
            <p className="text-sm text-muted-foreground">
              Follows the shop&apos;s hours, including later changes.{" "}
              <Link href="/dashboard/services/hours" className="text-blue-600 hover:underline">
                Change the shop&apos;s hours
              </Link>
            </p>
          ) : (
            <WeekHoursEditor value={week} onChange={setWeek} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking rules</CardTitle>
          <CardDescription>How close together, how soon and how far ahead customers can book.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <Label htmlFor="r-buffer">Time between jobs (minutes)</Label>
            <Input id="r-buffer" inputMode="numeric" value={rules.bufferTime} onChange={(e) => setRules({ ...rules, bufferTime: e.target.value.replace(/\D/g, "") })} />
            <p className="text-xs text-muted-foreground">Travel or clean-up between two visits.</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="r-max">Most bookings a day</Label>
            <Input
              id="r-max"
              inputMode="numeric"
              placeholder="No limit"
              value={rules.maxBookingsPerDay}
              onChange={(e) => setRules({ ...rules, maxBookingsPerDay: e.target.value.replace(/\D/g, "") })}
            />
            <p className="text-xs text-muted-foreground">e.g. the number of visits one technician can do.</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="r-notice">Book at least</Label>
            <select
              id="r-notice"
              className="h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-neutral-900"
              value={rules.minNoticeMinutes}
              onChange={(e) => setRules({ ...rules, minNoticeMinutes: e.target.value })}
            >
              {NOTICE_CHOICES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label} ahead
                </option>
              ))}
              {!NOTICE_CHOICES.some((c) => String(c.value) === rules.minNoticeMinutes) && (
                <option value={rules.minNoticeMinutes}>{rules.minNoticeMinutes} minutes ahead</option>
              )}
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="r-ahead">Book up to (days ahead)</Label>
            <Input id="r-ahead" inputMode="numeric" value={rules.maxAdvanceDays} onChange={(e) => setRules({ ...rules, maxAdvanceDays: e.target.value.replace(/\D/g, "") })} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save hours and rules
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Closures for this service</CardTitle>
          <CardDescription>Days this service cannot be booked. Shop-wide closures (holidays) also apply.</CardDescription>
        </CardHeader>
        <CardContent>
          <ClosuresEditor serviceId={serviceId} closures={data.closures} onChanged={load} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" /> What customers see — next 14 days
          </CardTitle>
          <CardDescription>Free start times after hours, closures, rules and bookings already taken. Saved settings only.</CardDescription>
        </CardHeader>
        <CardContent>
          {preview === null ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Checking…
            </p>
          ) : (
            <ul className="grid gap-1 text-sm sm:grid-cols-2">
              {days.map((d) => {
                const slots = preview[d] ?? [];
                return (
                  <li key={d} className="flex items-center justify-between gap-2 rounded px-2 py-1 odd:bg-muted/40">
                    <span>{new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })}</span>
                    {slots.length ? (
                      <span className="text-right text-muted-foreground">
                        {slots.length} slot{slots.length > 1 ? "s" : ""} · {slots[0]}–{slots[slots.length - 1]}
                      </span>
                    ) : (
                      <Badge variant="outline">Closed / full</Badge>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
