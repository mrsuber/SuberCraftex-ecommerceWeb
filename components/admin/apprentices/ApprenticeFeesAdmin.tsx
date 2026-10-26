"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/currency";

async function send(url: string, method: string, body?: unknown) {
  const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed");
  return data;
}
const attempt = async (fn: () => Promise<unknown>, ok: string, after?: () => void) => {
  try {
    await fn();
    toast.success(ok);
    after?.();
  } catch (e) {
    toast.error((e as Error).message);
  }
};

const TRACKS = ["", "tailoring", "device_repair", "sales", "delivery", "operations", "beadwork", "henna", "printing_press", "embroidery", "electronics", "computing", "woodworking_aerospace", "leather_working", "drawing_sketching", "beauty_grooming", "filmmaking"];
const emptyPlan = { name: "", serviceTrack: "", registrationFee: "", tuition: "", instalments: "1", intervalMonths: "1", description: "" };

export function ApprenticeFeesAdmin({ apprentices, superAdmin }: { apprentices: { id: string; fullName: string; apprenticeNumber: string }[]; superAdmin: boolean }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [plan, setPlan] = useState<any>(emptyPlan);
  const [selected, setSelected] = useState("");
  const loadPlans = useCallback(() => fetch("/api/admin/apprentice-fees/plans").then((r) => r.json()).then((d) => setPlans(Array.isArray(d) ? d : [])), []);
  const loadRows = useCallback(() => fetch("/api/admin/apprentice-fees").then((r) => r.json()).then((d) => setRows(Array.isArray(d) ? d : [])), []);
  useEffect(() => {
    loadPlans();
    loadRows();
  }, [loadPlans, loadRows]);

  const savePlan = () =>
    attempt(
      () => send(plan.id ? `/api/admin/apprentice-fees/plans/${plan.id}` : "/api/admin/apprentice-fees/plans", plan.id ? "PUT" : "POST", { ...plan, serviceTrack: plan.serviceTrack || null }),
      "Plan saved",
      () => { setPlan(emptyPlan); loadPlans(); }
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Apprentice fees</h1>
        <p className="text-muted-foreground">Fee plans, what each apprentice owes, cash received and refunds. Reminders and pauses follow Settings → Apprentice fees.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Apprentices with fees</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Apprentice</TableHead><TableHead className="text-right">Left to pay</TableHead><TableHead className="text-right">Late</TableHead><TableHead className="text-right">Refundable</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.fullName}<div className="text-xs text-muted-foreground">{r.apprenticeNumber} · {r.serviceTrack}</div></TableCell>
                  <TableCell className="text-right">{formatCurrency(r.standing.outstanding)}</TableCell>
                  <TableCell className="text-right">{r.standing.overdue > 0 ? <span className="text-destructive">{formatCurrency(r.standing.overdue)} · {r.standing.daysOverdue} d{r.standing.paused && " · paused"}</span> : "—"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(r.refundable)}</TableCell>
                  <TableCell><Button size="sm" variant="outline" onClick={() => setSelected(r.id)}>Open</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex items-center gap-2">
            <select className="rounded-md border px-3 py-2 text-sm" value="" onChange={(e) => e.target.value && setSelected(e.target.value)}>
              <option value="">Open another apprentice…</option>
              {apprentices.map((a) => <option key={a.id} value={a.id}>{a.fullName} ({a.apprenticeNumber})</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {selected && <ApprenticePanel key={selected} apprenticeId={selected} name={apprentices.find((a) => a.id === selected)?.fullName ?? ""} plans={plans.filter((p) => p.isActive)} superAdmin={superAdmin} onChange={loadRows} />}

      <Card>
        <CardHeader><CardTitle>Fee plans</CardTitle><CardDescription>Changing a plan does not change what apprentices already on it owe.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="space-y-1 sm:col-span-2"><Label>Name</Label><Input value={plan.name} onChange={(e) => setPlan((p: any) => ({ ...p, name: e.target.value }))} /></div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Track</Label>
              <select className="w-full rounded-md border px-3 py-2 text-sm" value={plan.serviceTrack ?? ""} onChange={(e) => setPlan((p: any) => ({ ...p, serviceTrack: e.target.value }))}>
                {TRACKS.map((t) => <option key={t} value={t}>{t ? t.replace(/_/g, " ") : "Any track"}</option>)}
              </select>
            </div>
            <div className="space-y-1"><Label>Registration (FCFA)</Label><Input type="number" value={plan.registrationFee} onChange={(e) => setPlan((p: any) => ({ ...p, registrationFee: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Tuition total (FCFA)</Label><Input type="number" value={plan.tuition} onChange={(e) => setPlan((p: any) => ({ ...p, tuition: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Instalments</Label><Input type="number" min={1} value={plan.instalments} onChange={(e) => setPlan((p: any) => ({ ...p, instalments: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Months between</Label><Input type="number" min={1} value={plan.intervalMonths} onChange={(e) => setPlan((p: any) => ({ ...p, intervalMonths: e.target.value }))} /></div>
          </div>
          <div className="flex gap-2">
            <Button disabled={!plan.name || !plan.tuition} onClick={savePlan}>{plan.id ? "Save plan" : "Add plan"}</Button>
            {plan.id && <Button variant="outline" onClick={() => setPlan(emptyPlan)}>New plan</Button>}
          </div>
          <Table>
            <TableHeader><TableRow><TableHead>Plan</TableHead><TableHead>Track</TableHead><TableHead className="text-right">Registration</TableHead><TableHead className="text-right">Tuition</TableHead><TableHead>Instalments</TableHead><TableHead className="text-right">In use</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {plans.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name} {!p.isActive && <Badge variant="secondary">off</Badge>}</TableCell>
                  <TableCell>{p.serviceTrack?.replace(/_/g, " ") ?? "any"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.registrationFee)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.tuition)}</TableCell>
                  <TableCell>{p.instalments} × every {p.intervalMonths} month(s)</TableCell>
                  <TableCell className="text-right">{p._count?.schedules ?? 0}</TableCell>
                  <TableCell className="space-x-2 whitespace-nowrap">
                    <Button size="sm" variant="outline" onClick={() => setPlan({ ...p, serviceTrack: p.serviceTrack ?? "", registrationFee: String(p.registrationFee), tuition: String(p.tuition), instalments: String(p.instalments), intervalMonths: String(p.intervalMonths) })}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => attempt(() => send(`/api/admin/apprentice-fees/plans/${p.id}`, "PUT", { ...p, isActive: !p.isActive }), p.isActive ? "Turned off" : "Turned on", loadPlans)}>{p.isActive ? "Turn off" : "Turn on"}</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ApprenticePanel({ apprenticeId, name, plans, superAdmin, onChange }: { apprenticeId: string; name: string; plans: any[]; superAdmin: boolean; onChange: () => void }) {
  const [data, setData] = useState<any>(null);
  const [give, setGive] = useState({ planId: "", startDate: new Date().toISOString().slice(0, 10), discount: "", discountReason: "" });
  const [cash, setCash] = useState({ amount: "", into: "safe", note: "" });
  const load = useCallback(() => fetch(`/api/admin/apprentices/${apprenticeId}/fees`).then((r) => r.json()).then(setData), [apprenticeId]);
  useEffect(() => {
    load();
  }, [load]);
  if (!data) return null;
  const refresh = () => { load(); onChange(); };
  const s = data.standing;

  const refund = () => {
    const how = prompt(`Refund ${data.refundable} FCFA paid ahead. Type mobile_money, cash, or keep (with a reason).`, "mobile_money");
    if (!how) return;
    const reason = how === "keep" ? prompt("Why is it kept?") : null;
    attempt(() => send(`/api/admin/apprentices/${apprenticeId}/fees/refund`, "POST", { how, reason }), how === "mobile_money" ? "Refund waiting in Finance" : "Recorded", refresh);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          Left to pay {formatCurrency(s.outstanding)} · owed now {formatCurrency(s.owedNow)}
          {s.overdue > 0 && ` · ${formatCurrency(s.overdue)} late by ${s.daysOverdue} days`}
          {s.paused && " · new work paused"} · certificate {s.certificateAllowed ? "allowed" : "not yet"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-lg border p-3">
            <div className="font-medium">Give a fee plan</div>
            <select className="w-full rounded-md border px-3 py-2 text-sm" value={give.planId} onChange={(e) => setGive((g) => ({ ...g, planId: e.target.value }))}>
              <option value="">Plan…</option>
              {plans.map((p) => <option key={p.id} value={p.id}>{p.name} · {formatCurrency(p.registrationFee + p.tuition)}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs">Starts</Label><Input type="date" value={give.startDate} onChange={(e) => setGive((g) => ({ ...g, startDate: e.target.value }))} /></div>
              <div className="space-y-1"><Label className="text-xs">Discount (FCFA)</Label><Input type="number" value={give.discount} onChange={(e) => setGive((g) => ({ ...g, discount: e.target.value }))} /></div>
            </div>
            {Number(give.discount) > 0 && <Input placeholder="Reason for the discount" value={give.discountReason} onChange={(e) => setGive((g) => ({ ...g, discountReason: e.target.value }))} />}
            <Button size="sm" disabled={!give.planId} onClick={() => attempt(() => send(`/api/admin/apprentices/${apprenticeId}/fees`, "POST", { ...give, discount: Number(give.discount) || 0 }), "Plan given", refresh)}>Give plan</Button>
          </div>
          <div className="space-y-2 rounded-lg border p-3">
            <div className="font-medium">Money received at the shop</div>
            <Input type="number" placeholder="Amount (FCFA)" value={cash.amount} onChange={(e) => setCash((c) => ({ ...c, amount: e.target.value }))} />
            <select className="w-full rounded-md border px-3 py-2 text-sm" value={cash.into} onChange={(e) => setCash((c) => ({ ...c, into: e.target.value }))}>
              <option value="safe">Cash, into the safe</option>
              <option value="bank">Paid into the bank</option>
              <option value="shop_momo">Sent to the shop&apos;s own Mobile Money number</option>
            </select>
            <Input placeholder="Note (optional)" value={cash.note} onChange={(e) => setCash((c) => ({ ...c, note: e.target.value }))} />
            <Button size="sm" disabled={!cash.amount} onClick={() => attempt(() => send(`/api/admin/apprentices/${apprenticeId}/fees/cash`, "POST", { ...cash, amount: Number(cash.amount) }), "Receipt made", () => { setCash({ amount: "", into: "safe", note: "" }); refresh(); })}>Record and give receipt</Button>
            {data.refundable > 0 && <Button size="sm" variant="outline" onClick={refund}>Refund {formatCurrency(data.refundable)} paid ahead</Button>}
          </div>
        </div>

        {data.schedules.map((sch: any) => (
          <div key={sch.id} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium">{sch.planName} · {formatCurrency(sch.total)}{sch.discount > 0 && ` (discount ${formatCurrency(sch.discount)}: ${sch.discountReason})`} <Badge variant="secondary">{sch.status}</Badge></div>
              {sch.status === "active" && (
                <Button size="sm" variant="outline" onClick={() => confirm("The apprentice is leaving: drop the instalments not yet due? Fees already due stay owed.") && attempt(() => send(`/api/admin/apprentice-fees/schedules/${sch.id}/cancel`, "POST"), "Cancelled", refresh)}>
                  Apprentice left
                </Button>
              )}
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Due</TableHead><TableHead>For</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Paid</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody>
                {sch.instalments.map((i: any) => (
                  <TableRow key={i.id}>
                    <TableCell>{String(i.dueDate).slice(0, 10)}</TableCell>
                    <TableCell>{i.label}{i.waivedReason && <div className="text-xs text-muted-foreground">waived: {i.waivedReason}</div>}</TableCell>
                    <TableCell className="text-right">{formatCurrency(i.amount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(i.paid)}</TableCell>
                    <TableCell><Badge variant="outline">{i.status}</Badge></TableCell>
                    <TableCell>
                      {superAdmin && ["scheduled", "invoiced"].includes(i.status) && i.paid < i.amount && (
                        <Button size="sm" variant="ghost" onClick={() => { const reason = prompt("Why is this fee waived?"); if (reason) attempt(() => send(`/api/admin/apprentice-fees/instalments/${i.id}/waive`, "POST", { reason }), "Waived", refresh); }}>Waive</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}

        {data.payments.length > 0 && (
          <div className="space-y-1 text-sm">
            <div className="font-medium">Receipts</div>
            {data.payments.map((p: any) => (
              <div key={p.id} className="flex justify-between border-b py-1">
                <span>{new Date(p.createdAt).toLocaleDateString()} · {p.receiptNumber} · {p.method.replace(/_/g, " ")}{p.note && ` · ${p.note}`}</span>
                <span>{formatCurrency(p.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
