"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarOff, Flag, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Closure {
  id: string;
  from: string;
  to: string;
  reason: string | null;
  yearly: boolean;
}

const fmt = (ymd: string, yearly: boolean) =>
  new Date(`${ymd}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", ...(yearly ? {} : { year: "numeric" }), timeZone: "UTC" });

interface Props {
  /** null = closures for the whole shop */
  serviceId: string | null;
  closures: Closure[];
  onChanged: () => void;
}

/** Days nobody can book: holidays, a technician away, stock-taking. */
export function ClosuresEditor({ serviceId, closures, onChanged }: Props) {
  const [form, setForm] = useState({ from: "", to: "", reason: "", yearly: false });
  const [busy, setBusy] = useState(false);

  const call = async (url: string, init: RequestInit, done: string) => {
    setBusy(true);
    try {
      const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      toast.success(typeof done === "string" ? done : "Saved");
      onChanged();
      return data;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const add = async () => {
    if (!form.from) return toast.error("Choose the first day of the closure");
    const ok = await call(
      "/api/admin/service-closures",
      { method: "POST", body: JSON.stringify({ serviceId, from: form.from, to: form.to || form.from, reason: form.reason, yearly: form.yearly }) },
      "Closure added",
    );
    if (ok) setForm({ from: "", to: "", reason: "", yearly: false });
  };

  return (
    <div className="space-y-4">
      {closures.length === 0 ? (
        <p className="text-sm text-muted-foreground">No closures planned.</p>
      ) : (
        <ul className="divide-y rounded-lg border text-sm">
          {closures.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
              <span className="flex items-center gap-2">
                <CalendarOff className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {fmt(c.from, c.yearly)}
                  {c.to !== c.from && ` – ${fmt(c.to, c.yearly)}`}
                </span>
                {c.reason && <span className="text-muted-foreground">{c.reason}</span>}
                {c.yearly && <Badge variant="outline">Every year</Badge>}
              </span>
              <Button
                size="sm"
                variant="ghost"
                disabled={busy}
                aria-label="Remove closure"
                onClick={() => call(`/api/admin/service-closures/${c.id}`, { method: "DELETE" }, "Closure removed")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-3 rounded-lg border border-dashed p-3 sm:grid-cols-[1fr_1fr_2fr_auto] sm:items-end">
        <div className="space-y-1">
          <Label htmlFor={`cl-from-${serviceId ?? "shop"}`} className="text-xs">From</Label>
          <Input id={`cl-from-${serviceId ?? "shop"}`} type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`cl-to-${serviceId ?? "shop"}`} className="text-xs">To (optional)</Label>
          <Input id={`cl-to-${serviceId ?? "shop"}`} type="date" value={form.to} min={form.from} onChange={(e) => setForm({ ...form, to: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`cl-reason-${serviceId ?? "shop"}`} className="text-xs">Reason</Label>
          <Input
            id={`cl-reason-${serviceId ?? "shop"}`}
            placeholder={serviceId ? "e.g. Technician on leave" : "e.g. Stock-taking"}
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
        </div>
        <Button disabled={busy} onClick={add}>
          Add closure
        </Button>
        <label className="flex items-center gap-2 text-sm sm:col-span-4">
          <input type="checkbox" checked={form.yearly} onChange={(e) => setForm({ ...form, yearly: e.target.checked })} />
          Every year on these dates (a public holiday)
        </label>
      </div>

      {serviceId === null && (
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={async () => {
            const data = await call("/api/admin/service-closures/holidays", { method: "POST" }, "Public holidays checked");
            if (data && data.added === 0) toast.info("The fixed public holidays were already there");
          }}
        >
          <Flag className="mr-2 h-4 w-4" /> Add Cameroon&apos;s fixed public holidays
        </Button>
      )}
    </div>
  );
}
