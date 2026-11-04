"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/currency";

export interface JobServiceOption {
  id: string;
  name: string;
  category: string | null;
  price: number;
  supportsOnsite: boolean;
  supportsCollectRepair: boolean;
  supportsCustomProduction: boolean;
}

const STAGES = [
  { value: "completed", label: "Already done", hint: "The work is finished — next you'll write the invoice." },
  { value: "in_progress", label: "Being done now", hint: "The technician is on the job." },
  { value: "confirmed", label: "Agreed for later", hint: "A visit or job planned with the customer." },
] as const;

const TYPES = [
  { value: "onsite", label: "At the customer's place", flag: "supportsOnsite" },
  { value: "collect_repair", label: "Item brought to the workshop", flag: "supportsCollectRepair" },
  { value: "custom_production", label: "Made to order", flag: "supportsCustomProduction" },
] as const;

/** Today at the shop (Cameroon), as YYYY-MM-DD */
function shopToday() {
  return new Date(Date.now() + 3_600_000).toISOString().slice(0, 10);
}

export interface JobStaffOption {
  id: string;
  name: string;
  role: string;
}

/** `staff` is given to admins, who choose who does the job; other staff get the job themselves */
export function NewJobForm({ services, staff }: { services: JobServiceOption[]; staff?: JobStaffOption[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    serviceId: "",
    serviceType: "onsite",
    status: "completed",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    serviceAddress: "",
    scheduledDate: shopToday(),
    scheduledTime: "",
    price: "",
    customerNotes: "",
    adminNotes: "",
    assignedToId: "",
  });
  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));
  const service = services.find((s) => s.id === form.serviceId);
  const types = TYPES.filter((t) => !service || service[t.flag]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.serviceId) return toast.error("Choose the service");
    if (!form.customerName.trim()) return toast.error("Enter the customer's name");
    if (!form.customerPhone.trim() && !form.customerEmail.trim()) return toast.error("Enter a phone number or an email");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.price.trim() || undefined,
          scheduledTime: form.scheduledTime || undefined,
          assignedToId: form.assignedToId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to record the job");
      toast.success(`Job ${data.bookingNumber} recorded`);
      router.push(`/dashboard/bookings/${data.id}${form.status === "completed" ? "#billing" : ""}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to record the job");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>The job</CardTitle>
          <CardDescription>What was (or will be) done, and how far it has got.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Service</Label>
              <Select
                value={form.serviceId}
                onValueChange={(v) => {
                  const s = services.find((x) => x.id === v);
                  const firstType = TYPES.find((t) => !s || s[t.flag])?.value ?? "onsite";
                  setForm((f) => ({ ...f, serviceId: v, serviceType: firstType, price: s ? String(s.price) : f.price }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                      {s.category ? ` · ${s.category}` : ""} — {formatCurrency(s.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Where</Label>
              <Select value={form.serviceType} onValueChange={set("serviceType")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {staff && (
            <div className="space-y-1 md:max-w-sm">
              <Label>Who does it</Label>
              <Select value={form.assignedToId || "none"} onValueChange={(v) => set("assignedToId")(v === "none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not assigned yet</SelectItem>
                  {staff.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} · {p.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Stage</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              {STAGES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set("status")(s.value)}
                  className={`rounded-lg border p-3 text-left text-sm transition ${
                    form.status === s.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted"
                  }`}
                  aria-pressed={form.status === s.value}
                >
                  <div className="font-medium">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.hint}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="job-date">Date</Label>
              <Input id="job-date" type="date" value={form.scheduledDate} onChange={(e) => set("scheduledDate")(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="job-time">Time (optional)</Label>
              <Input id="job-time" type="time" step={900} value={form.scheduledTime} onChange={(e) => set("scheduledTime")(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="job-price">Price agreed (FCFA)</Label>
              <Input
                id="job-price"
                inputMode="numeric"
                placeholder={service ? String(service.price) : "e.g. 15000"}
                value={form.price}
                onChange={(e) => set("price")(e.target.value.replace(/[^\d]/g, ""))}
              />
              <p className="text-xs text-muted-foreground">The invoice sets the final amount, with parts and travel.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>The customer</CardTitle>
          <CardDescription>
            A phone number is enough. With an email, the invoice is sent automatically — and if it matches an account,
            the customer sees the job and can pay online.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="job-name">Name</Label>
            <Input id="job-name" value={form.customerName} onChange={(e) => set("customerName")(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="job-phone">Phone</Label>
            <Input id="job-phone" type="tel" placeholder="6XX XXX XXX" value={form.customerPhone} onChange={(e) => set("customerPhone")(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="job-email">Email (optional)</Label>
            <Input id="job-email" type="email" value={form.customerEmail} onChange={(e) => set("customerEmail")(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="job-address">Address / landmark</Label>
            <Input
              id="job-address"
              placeholder="e.g. Akwa, opposite the pharmacy, 2nd floor"
              value={form.serviceAddress}
              onChange={(e) => set("serviceAddress")(e.target.value)}
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="job-notes">What the customer asked for</Label>
            <Textarea
              id="job-notes"
              placeholder="e.g. Wardrobe and two drawers: locks jammed, one key lost"
              value={form.customerNotes}
              onChange={(e) => set("customerNotes")(e.target.value)}
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="job-admin-notes">Internal notes (not shown to the customer)</Label>
            <Textarea id="job-admin-notes" value={form.adminNotes} onChange={(e) => set("adminNotes")(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : form.status === "completed" ? "Record job and write invoice" : "Record job"}
        </Button>
      </div>
    </form>
  );
}
