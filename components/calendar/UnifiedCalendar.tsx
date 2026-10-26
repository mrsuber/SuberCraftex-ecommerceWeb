"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Link2 } from "lucide-react";

interface Item {
  id: string;
  source: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  location?: string | null;
  detail?: string | null;
  href?: string | null;
  kind?: string;
  response?: string | null;
  editable?: boolean;
}

const COLORS: Record<string, string> = {
  event: "bg-blue-100 text-blue-900 border-blue-300",
  timetable: "bg-violet-100 text-violet-900 border-violet-300",
  apprentice: "bg-violet-50 text-violet-800 border-violet-200",
  booking: "bg-emerald-100 text-emerald-900 border-emerald-300",
  fitting: "bg-teal-100 text-teal-900 border-teal-300",
  repair: "bg-orange-100 text-orange-900 border-orange-300",
  delivery: "bg-sky-100 text-sky-900 border-sky-300",
  payday: "bg-green-200 text-green-900 border-green-400",
  fee: "bg-amber-100 text-amber-900 border-amber-300",
  exit: "bg-rose-100 text-rose-900 border-rose-300",
};
const LABELS: Record<string, string> = {
  event: "Staff events",
  timetable: "Classes",
  apprentice: "Apprentice tasks",
  booking: "Bookings",
  fitting: "Fittings",
  repair: "Repairs",
  delivery: "Deliveries",
  payday: "Pay day",
  fee: "Fees due",
  exit: "Investor exits",
};
const KINDS = ["shift", "meeting", "training", "maintenance", "leave", "delivery_run", "other"];
const ROLES = ["driver", "cashier", "tailor", "technician", "apprentice", "admin"];

const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const time = (s: string) => new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/** Which local days an item covers (all-day items are stored as UTC dates) */
function daysOf(i: Item) {
  const out: string[] = [];
  const start = i.allDay ? new Date(i.start.slice(0, 10) + "T00:00:00") : new Date(i.start);
  // All-day items end at the start of the day after (exclusive); timed items on their last instant
  const end = i.allDay ? new Date(new Date(i.end.slice(0, 10) + "T00:00:00").getTime() - 1) : new Date(new Date(i.end).getTime() - 1);
  for (let d = new Date(start.getFullYear(), start.getMonth(), start.getDate()); d <= end && out.length < 93; d.setDate(d.getDate() + 1)) out.push(dayKey(d));
  if (out.length === 0) out.push(dayKey(start));
  return out;
}

export function UnifiedCalendar({ canCreate = false }: { canCreate?: boolean }) {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState(dayKey(new Date()));
  const [hidden, setHidden] = useState<string[]>([]);
  const [link, setLink] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);

  const gridStart = useMemo(() => {
    const d = new Date(month);
    d.setDate(1 - ((d.getDay() + 6) % 7)); // weeks start on Monday
    return d;
  }, [month]);
  const days = useMemo(() => Array.from({ length: 42 }, (_, i) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)), [gridStart]);

  const load = useCallback(() => {
    const from = days[0];
    const to = new Date(days[41].getFullYear(), days[41].getMonth(), days[41].getDate() + 1);
    fetch(`/api/calendar/feed?from=${from.toISOString()}&to=${to.toISOString()}`)
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []));
  }, [days]);
  useEffect(() => {
    load();
  }, [load]);

  const byDay = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const i of items) {
      if (hidden.includes(i.source)) continue;
      for (const k of daysOf(i)) map.set(k, [...(map.get(k) ?? []), i]);
    }
    return map;
  }, [items, hidden]);
  const sources = [...new Set(items.map((i) => i.source))];
  const today = dayKey(new Date());

  const respond = async (i: Item, response: "accepted" | "declined") => {
    const res = await fetch(`/api/schedule/events/${i.id.replace("event:", "")}/respond`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ response }) });
    if (res.ok) {
      toast.success(response === "accepted" ? "Accepted" : "Declined");
      load();
    } else toast.error((await res.json()).error ?? "Failed");
  };

  const openEditor = async (i?: Item) => {
    if (!i) {
      const start = `${selected}T08:00`;
      setEditing({ title: "", kind: "shift", start, end: `${selected}T16:00`, isAllDay: false, location: "", description: "", roles: [], attendeeIds: [] });
      return;
    }
    const e = await fetch(`/api/schedule/events/${i.id.replace("event:", "")}`).then((r) => r.json());
    const local = (s: string) => {
      const d = new Date(s);
      return `${dayKey(d)}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    };
    setEditing({ id: e.id, title: e.title, kind: e.kind, start: local(e.startTime), end: local(e.endTime), isAllDay: e.isAllDay, location: e.location ?? "", description: e.description ?? "", roles: e.roles, attendeeIds: e.attendees.map((a: any) => a.userId) });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft className="h-4 w-4" /></Button>
          <h2 className="min-w-44 text-center text-xl font-semibold">{month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</h2>
          <Button variant="outline" size="icon" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => { const d = new Date(); setMonth(new Date(d.getFullYear(), d.getMonth(), 1)); setSelected(dayKey(d)); }}>Today</Button>
        </div>
        <div className="flex gap-2">
          {canCreate && <Button onClick={() => openEditor()}>New event</Button>}
          <Button variant="outline" onClick={async () => setLink((await fetch("/api/calendar/link").then((r) => r.json())).url)}><Link2 className="mr-2 h-4 w-4" />Add to my phone</Button>
        </div>
      </div>

      {link && (
        <Card>
          <CardContent className="space-y-2 pt-6 text-sm">
            <p>Add this private link to Google Calendar (Other calendars → From URL), Apple Calendar (New subscription) or Outlook (Subscribe from web). Do not share it: anyone with it can read your calendar.</p>
            <div className="flex gap-2"><Input readOnly value={link} onFocus={(e) => e.target.select()} /><Button variant="outline" onClick={() => { navigator.clipboard?.writeText(link); toast.success("Copied"); }}>Copy</Button></div>
          </CardContent>
        </Card>
      )}

      {editing && <EventEditor value={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}

      {sources.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {sources.map((s) => (
            <button key={s} className={`rounded-full border px-3 py-1 text-xs ${hidden.includes(s) ? "opacity-40" : COLORS[s]}`} onClick={() => setHidden((h) => (h.includes(s) ? h.filter((x) => x !== s) : [...h, s]))}>
              {LABELS[s] ?? s}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border bg-border text-xs">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} className="bg-muted p-2 text-center font-medium">{d}</div>)}
        {days.map((d) => {
          const k = dayKey(d);
          const list = byDay.get(k) ?? [];
          return (
            <button key={k} onClick={() => setSelected(k)} className={`min-h-16 bg-background p-1 text-left align-top sm:min-h-24 ${d.getMonth() !== month.getMonth() ? "text-muted-foreground" : ""} ${selected === k ? "ring-2 ring-primary ring-inset" : ""}`}>
              <div className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full ${k === today ? "bg-primary text-primary-foreground" : ""}`}>{d.getDate()}</div>
              <div className="hidden space-y-0.5 sm:block">
                {list.slice(0, 3).map((i) => <div key={i.id} className={`truncate rounded border px-1 ${COLORS[i.source]}`}>{!i.allDay && `${time(i.start)} `}{i.title}</div>)}
                {list.length > 3 && <div className="text-muted-foreground">+{list.length - 3} more</div>}
              </div>
              {list.length > 0 && <div className="sm:hidden"><span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" /> {list.length}</div>}
            </button>
          );
        })}
      </div>

      <Card>
        <CardHeader><CardTitle>{new Date(selected + "T12:00:00").toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {(byDay.get(selected) ?? []).length === 0 && <p className="text-sm text-muted-foreground">Nothing on this day.</p>}
          {(byDay.get(selected) ?? []).map((i) => (
            <div key={i.id} className={`rounded-lg border p-3 ${COLORS[i.source]}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="font-medium">{i.title}</div>
                  <div className="text-xs">{i.allDay ? "All day" : `${time(i.start)} – ${time(i.end)}`}{i.location && ` · ${i.location}`} · {LABELS[i.source]}{i.kind && i.source === "event" && ` · ${i.kind.replace(/_/g, " ")}`}</div>
                  {i.detail && <div className="mt-1 whitespace-pre-line text-xs opacity-80">{i.detail}</div>}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {i.response && <Badge variant="outline">{i.response}</Badge>}
                  {i.response && i.response !== "accepted" && <Button size="sm" onClick={() => respond(i, "accepted")}>Accept</Button>}
                  {i.response && i.response !== "declined" && <Button size="sm" variant="outline" onClick={() => respond(i, "declined")}>Decline</Button>}
                  {i.editable && canCreate && <Button size="sm" variant="outline" onClick={() => openEditor(i)}>Edit</Button>}
                  {i.href && <Link className="text-xs underline" href={i.href}>Open</Link>}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function EventEditor({ value, onClose, onSaved }: { value: any; onClose: () => void; onSaved: () => void }) {
  const [v, setV] = useState(value);
  const [people, setPeople] = useState<any[]>([]);
  const [warnings, setWarnings] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/schedule/events").then((r) => r.json()).then((d) => setPeople(Array.isArray(d) ? d : []));
  }, []);
  const set = (k: string, x: unknown) => setV((p: any) => ({ ...p, [k]: x }));
  const toggle = (k: "roles" | "attendeeIds", x: string) => set(k, v[k].includes(x) ? v[k].filter((y: string) => y !== x) : [...v[k], x]);

  const save = async () => {
    const startTime = v.isAllDay ? new Date(v.start.slice(0, 10) + "T00:00:00Z") : new Date(v.start);
    const endTime = v.isAllDay ? new Date(new Date(v.end.slice(0, 10) + "T00:00:00Z").getTime() + 86_400_000) : new Date(v.end);
    const body = { title: v.title, kind: v.kind, startTime, endTime, isAllDay: v.isAllDay, location: v.location, description: v.description, roles: v.roles, attendeeIds: v.attendeeIds };
    const res = await fetch(v.id ? `/api/schedule/events/${v.id}` : "/api/schedule/events", { method: v.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error ?? "Failed");
    if (data.warnings?.length) {
      setWarnings(data.warnings);
      toast.warning("Saved, but some people are already busy then");
      return;
    }
    toast.success("Saved");
    onSaved();
  };
  const cancel = async () => {
    if (!confirm("Cancel this event for everyone?")) return;
    await fetch(`/api/schedule/events/${v.id}`, { method: "DELETE" });
    toast.success("Cancelled");
    onSaved();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{v.id ? "Change event" : "New event"}</CardTitle>
        <CardDescription>Shifts, meetings, training, leave or a machine out of use. Invite people, or show it to everyone with a role.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1"><Label>Title</Label><Input value={v.title} onChange={(e) => set("title", e.target.value)} /></div>
          <div className="space-y-1">
            <Label>Kind</Label>
            <select className="w-full rounded-md border px-3 py-2 text-sm" value={v.kind} onChange={(e) => set("kind", e.target.value)}>
              {KINDS.map((k) => <option key={k} value={k}>{k.replace(/_/g, " ")}</option>)}
            </select>
          </div>
          <div className="space-y-1"><Label>Starts</Label><Input type={v.isAllDay ? "date" : "datetime-local"} value={v.isAllDay ? v.start.slice(0, 10) : v.start} onChange={(e) => set("start", v.isAllDay ? `${e.target.value}T00:00` : e.target.value)} /></div>
          <div className="space-y-1"><Label>Ends</Label><Input type={v.isAllDay ? "date" : "datetime-local"} value={v.isAllDay ? v.end.slice(0, 10) : v.end} onChange={(e) => set("end", v.isAllDay ? `${e.target.value}T00:00` : e.target.value)} /></div>
          <div className="space-y-1"><Label>Where</Label><Input value={v.location} onChange={(e) => set("location", e.target.value)} /></div>
          <label className="flex items-center gap-2 pt-6 text-sm"><Switch checked={v.isAllDay} onCheckedChange={(x) => set("isAllDay", x)} /> All day</label>
        </div>
        <div className="space-y-1"><Label>Details</Label><Input value={v.description} onChange={(e) => set("description", e.target.value)} /></div>
        <div className="space-y-1">
          <Label>Everyone with the role</Label>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => <button key={r} type="button" onClick={() => toggle("roles", r)} className={`rounded-full border px-3 py-1 text-xs capitalize ${v.roles.includes(r) ? "bg-primary text-primary-foreground" : ""}`}>{r}</button>)}
          </div>
        </div>
        <div className="space-y-1">
          <Label>People invited ({v.attendeeIds.length})</Label>
          <div className="max-h-40 overflow-y-auto rounded-md border p-2 text-sm">
            {people.map((p) => (
              <label key={p.id} className="flex items-center gap-2 py-0.5">
                <input type="checkbox" checked={v.attendeeIds.includes(p.id)} onChange={() => toggle("attendeeIds", p.id)} />
                {p.fullName ?? p.email} <span className="text-xs text-muted-foreground">{p.role}</span>
              </label>
            ))}
          </div>
        </div>
        {warnings.length > 0 && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm">
            {warnings.map((w, i) => <div key={i}>{w.name} already has “{w.event}” ({w.kind}) {time(w.start)}–{time(w.end)}</div>)}
            <Button size="sm" className="mt-2" onClick={onSaved}>Keep it anyway</Button>
          </div>
        )}
        <div className="flex gap-2">
          <Button disabled={!v.title} onClick={save}>Save</Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
          {v.id && <Button variant="destructive" onClick={cancel}>Cancel event</Button>}
        </div>
      </CardContent>
    </Card>
  );
}
