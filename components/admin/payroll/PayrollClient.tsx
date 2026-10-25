"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
/** Salaries are prepared late in the month they pay for; early in a month, it is usually last month's */
const payMonth = () => {
  const d = new Date();
  if (d.getUTCDate() < 15) d.setUTCMonth(d.getUTCMonth() - 1, 1);
  return d.toISOString().slice(0, 7);
};

export function PayrollClient({ superAdmin, accountant }: { superAdmin: boolean; accountant: { name: string; email: string; phone: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payroll</h1>
        <p className="text-muted-foreground">
          Salaries for every employee, paid monthly into their salary wallet. Contribution and tax rates are in Settings → Salaries.
          {accountant.name ? ` Accountant: ${accountant.name}${accountant.phone ? `, ${accountant.phone}` : ""}${accountant.email ? `, ${accountant.email}` : ""}.` : " Add the accountant's contact in Settings so staff know who checks the rates."}
        </p>
      </div>
      <Tabs defaultValue="staff" className="space-y-6">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="staff">Staff and salaries</TabsTrigger>
          <TabsTrigger value="runs">Monthly pay</TabsTrigger>
          <TabsTrigger value="advances">Advances</TabsTrigger>
          <TabsTrigger value="charges">Charges</TabsTrigger>
        </TabsList>
        <TabsContent value="staff"><Staff /></TabsContent>
        <TabsContent value="runs"><Runs /></TabsContent>
        <TabsContent value="advances"><Advances /></TabsContent>
        <TabsContent value="charges"><Charges superAdmin={superAdmin} /></TabsContent>
      </Tabs>
    </div>
  );
}

function Staff() {
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const load = useCallback(() => fetch("/api/admin/payroll/staff").then((r) => r.json()).then((d) => setRows(Array.isArray(d) ? d : [])), []);
  useEffect(() => {
    load();
  }, [load]);

  const edit = (u: any) =>
    setEditing({
      userId: u.id,
      name: u.fullName ?? u.email,
      jobTitle: u.staffPay?.jobTitle ?? u.role,
      monthlySalary: u.staffPay?.monthlySalary ?? "",
      payoutPhone: u.staffPay?.payoutPhone ?? u.phone ?? "",
      incomeTax: u.staffPay?.incomeTax ?? true,
      isActive: u.staffPay?.isActive ?? true,
      startedAt: u.staffPay?.startedAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
      endedAt: u.staffPay?.endedAt?.slice(0, 10) ?? "",
      notes: u.staffPay?.notes ?? "",
    });

  const cash = (u: any) => {
    const amount = prompt(`Pay how much of ${u.fullName}'s salary wallet (${u.wallet} FCFA) by hand?`);
    if (!amount) return;
    const from = prompt("From the safe or the bank?", "safe");
    if (!from) return;
    attempt(() => send(`/api/admin/payroll/wallets/${u.id}/cash`, "POST", { amount: Number(amount), from, note: prompt("Note (optional)") ?? "" }), "Recorded", load);
  };

  return (
    <div className="space-y-4">
      {editing && (
        <Card>
          <CardHeader><CardTitle>Salary for {editing.name}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["jobTitle", "Job title", "text"],
                ["monthlySalary", "Monthly gross salary (FCFA)", "number"],
                ["payoutPhone", "Mobile Money number", "text"],
                ["startedAt", "Started", "date"],
                ["endedAt", "Left (leave empty if still here)", "date"],
                ["notes", "Notes", "text"],
              ].map(([k, label, type]) => (
                <div key={k} className="space-y-1">
                  <Label>{label}</Label>
                  <Input type={type} value={editing[k]} onChange={(e) => setEditing((v: any) => ({ ...v, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm"><Switch checked={editing.isActive} onCheckedChange={(v) => setEditing((x: any) => ({ ...x, isActive: v }))} /> On the payroll</label>
              <label className="flex items-center gap-2 text-sm"><Switch checked={editing.incomeTax} onCheckedChange={(v) => setEditing((x: any) => ({ ...x, incomeTax: v }))} /> Income tax applies</label>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => attempt(() => send("/api/admin/payroll/staff", "PUT", { ...editing, monthlySalary: Number(editing.monthlySalary) }), "Saved", () => { setEditing(null); load(); })}>Save</Button>
              <Button variant="outline" onClick={() => setEditing(null)}>Close</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Person</TableHead><TableHead>Role</TableHead><TableHead>Job</TableHead><TableHead className="text-right">Monthly salary</TableHead><TableHead className="text-right">Wallet</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {rows.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.fullName ?? u.email}<div className="text-xs text-muted-foreground">{u.email}</div></TableCell>
                  <TableCell className="capitalize">{u.role}</TableCell>
                  <TableCell>{u.staffPay ? <>{u.staffPay.jobTitle} {!u.staffPay.isActive && <Badge variant="secondary">left</Badge>}</> : <span className="text-muted-foreground">not set</span>}</TableCell>
                  <TableCell className="text-right">{u.staffPay ? formatCurrency(u.staffPay.monthlySalary) : "—"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(u.wallet)}</TableCell>
                  <TableCell className="space-x-2 whitespace-nowrap">
                    <Button size="sm" variant="outline" onClick={() => edit(u)}>{u.staffPay ? "Edit" : "Set salary"}</Button>
                    {u.wallet > 0 && <Button size="sm" variant="outline" onClick={() => cash(u)}>Paid by hand</Button>}
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

function Runs() {
  const [runs, setRuns] = useState<any[]>([]);
  const [open, setOpen] = useState<any>(null);
  const [month, setMonth] = useState(payMonth());
  const load = useCallback(() => fetch("/api/admin/payroll/runs").then((r) => r.json()).then((d) => setRuns(Array.isArray(d) ? d : [])), []);
  const show = useCallback((id: string) => fetch(`/api/admin/payroll/runs/${id}`).then((r) => r.json()).then(setOpen), []);
  useEffect(() => {
    load();
  }, [load]);

  const prepare = () => attempt(async () => { const run = await send("/api/admin/payroll/runs", "POST", { month }); show(run.id); }, "Draft ready: check it, then approve", load);
  const approve = () => {
    if (!confirm(`Pay ${formatCurrency(open.totalNet)} into ${open.lines.length} salary wallets? This cannot be undone.`)) return;
    attempt(() => send(`/api/admin/payroll/runs/${open.id}/approve`, "POST"), "Salaries paid into wallets", () => { load(); show(open.id); });
  };
  const changeLine = (line: any) => {
    const unpaidDays = prompt("Unpaid days this month", String(line.unpaidDays));
    if (unpaidDays === null) return;
    const bonus = prompt("Bonus (FCFA)", String(line.bonus));
    if (bonus === null) return;
    const bonusNote = Number(bonus) > 0 ? prompt("What is the bonus for? (on the payslip)", line.bonusNote ?? "") : null;
    attempt(() => send(`/api/admin/payroll/lines/${line.id}`, "PATCH", { unpaidDays: Number(unpaidDays), bonus: Number(bonus), bonusNote }), "Updated", () => show(open.id));
  };
  const total = (items: any[]) => (items ?? []).reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Prepare a month</CardTitle>
          <CardDescription>A draft payslip for everyone on the payroll. Advances and accepted charges are taken back, up to the limit in Settings. Approving pays net salaries into wallets once.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-end gap-3">
          <div className="space-y-1"><Label>Month</Label><Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} /></div>
          <Button onClick={prepare}>Prepare</Button>
        </CardContent>
      </Card>

      {open && (
        <Card>
          <CardHeader>
            <CardTitle>{String(open.periodStart).slice(0, 7)} <Badge className="ml-2">{open.status}</Badge></CardTitle>
            <CardDescription>Gross {formatCurrency(open.totalGross)} · Net to wallets {formatCurrency(open.totalNet)} · Employer contributions {formatCurrency(open.totalEmployer)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead className="text-right">Base</TableHead><TableHead className="text-right">Unpaid days</TableHead><TableHead className="text-right">Bonus</TableHead><TableHead className="text-right">Gross</TableHead><TableHead className="text-right">Deductions</TableHead><TableHead className="text-right">Taken back</TableHead><TableHead className="text-right">Net</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody>
                {open.lines.map((l: any) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.fullName}<div className="text-xs text-muted-foreground">{l.jobTitle}</div></TableCell>
                    <TableCell className="text-right">{formatCurrency(l.baseSalary)}</TableCell>
                    <TableCell className="text-right">{l.unpaidDays}</TableCell>
                    <TableCell className="text-right">{formatCurrency(l.bonus)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(l.gross)}</TableCell>
                    <TableCell className="text-right" title={(l.deductions ?? []).map((d: any) => `${d.label}: ${d.amount}`).join("\n")}>{formatCurrency(total(l.deductions))}</TableCell>
                    <TableCell className="text-right">{formatCurrency(l.advanceRecovered + l.chargesRecovered)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(l.net)}</TableCell>
                    <TableCell className="whitespace-nowrap space-x-2">
                      {open.status === "draft" && <Button size="sm" variant="outline" onClick={() => changeLine(l)}>Change</Button>}
                      <a className="text-sm underline" href={`/account/salary/payslip/${l.id}`} target="_blank" rel="noreferrer">Payslip</a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {open.status === "draft" && (
              <div className="flex gap-2">
                <Button onClick={approve}>Approve and pay</Button>
                <Button variant="outline" onClick={() => attempt(() => send(`/api/admin/payroll/runs/${open.id}`, "DELETE"), "Cancelled", () => { setOpen(null); load(); })}>Cancel draft</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Month</TableHead><TableHead>Status</TableHead><TableHead className="text-right">People</TableHead><TableHead className="text-right">Gross</TableHead><TableHead className="text-right">Net</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {runs.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{String(r.periodStart).slice(0, 7)}</TableCell>
                  <TableCell><Badge variant={r.status === "approved" ? "default" : "secondary"}>{r.status}</Badge></TableCell>
                  <TableCell className="text-right">{r._count?.lines}</TableCell>
                  <TableCell className="text-right">{formatCurrency(r.totalGross)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(r.totalNet)}</TableCell>
                  <TableCell><Button size="sm" variant="outline" onClick={() => show(r.id)}>Open</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Advances() {
  const [rows, setRows] = useState<any[]>([]);
  const load = useCallback(() => fetch("/api/admin/payroll/advances").then((r) => r.json()).then((d) => setRows(Array.isArray(d) ? d : [])), []);
  useEffect(() => {
    load();
  }, [load]);
  const decide = (a: any, approve: boolean) => {
    const paidBy = approve ? prompt("Pay by mobile_money (sent after approval in Finance, fee on SuberCraftex) or cash (from the safe)?", "mobile_money") : null;
    if (approve && !paidBy) return;
    const note = prompt(approve ? "Note (optional)" : "Why is it refused?") ?? "";
    attempt(() => send(`/api/admin/payroll/advances/${a.id}`, "POST", { approve, paidBy, note }), approve ? "Approved" : "Refused", load);
  };
  return (
    <Card>
      <CardHeader><CardTitle>Salary advances</CardTitle><CardDescription>Taken back from the following salaries, in the number of months the employee chose.</CardDescription></CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Asked</TableHead><TableHead>Employee</TableHead><TableHead>Reason</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Per month</TableHead><TableHead className="text-right">Repaid</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {rows.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{new Date(a.requestedAt).toLocaleDateString()}</TableCell>
                <TableCell>{a.user?.fullName ?? a.user?.email}</TableCell>
                <TableCell className="max-w-xs">{a.reason}{a.decisionNote && <div className="text-xs text-muted-foreground">{a.decisionNote}</div>}</TableCell>
                <TableCell className="text-right">{formatCurrency(a.amount)}</TableCell>
                <TableCell className="text-right">{formatCurrency(a.monthlyRecovery)}</TableCell>
                <TableCell className="text-right">{formatCurrency(a.recovered)}</TableCell>
                <TableCell><Badge variant="secondary">{a.status}</Badge></TableCell>
                <TableCell className="whitespace-nowrap space-x-2">
                  {a.status === "requested" && (
                    <>
                      <Button size="sm" onClick={() => decide(a, true)}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => decide(a, false)}>Refuse</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function Charges({ superAdmin }: { superAdmin: boolean }) {
  const [rows, setRows] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [form, setForm] = useState({ userId: "", kind: "damage", amount: "", reason: "" });
  const load = useCallback(() => fetch("/api/admin/payroll/charges").then((r) => r.json()).then((d) => setRows(Array.isArray(d) ? d : [])), []);
  useEffect(() => {
    load();
    fetch("/api/admin/payroll/staff").then((r) => r.json()).then((d) => setStaff(Array.isArray(d) ? d.filter((u: any) => u.staffPay) : []));
  }, [load]);
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Propose a charge</CardTitle>
          <CardDescription>The employee reads it and accepts or disputes it. Nothing is taken from a salary unless they accept, or a super admin upholds the dispute. A driver&apos;s shortage cannot be more than the cash they still hold.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-4">
          <select className="rounded-md border px-3 py-2 text-sm" value={form.userId} onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}>
            <option value="">Employee…</option>
            {staff.map((u) => <option key={u.id} value={u.id}>{u.fullName ?? u.email}</option>)}
          </select>
          <select className="rounded-md border px-3 py-2 text-sm" value={form.kind} onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value }))}>
            <option value="driver_shortage">Delivery cash short</option>
            <option value="damage">Damage</option>
            <option value="other">Other</option>
          </select>
          <Input type="number" placeholder="Amount (FCFA)" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
          <Input placeholder="What happened" value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} />
          <Button className="sm:col-span-4 w-fit" disabled={!form.userId || !form.amount || !form.reason} onClick={() => attempt(() => send("/api/admin/payroll/charges", "POST", { ...form, amount: Number(form.amount) }), "Sent to the employee", () => { setForm({ userId: "", kind: "damage", amount: "", reason: "" }); load(); })}>
            Propose
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Employee</TableHead><TableHead>Charge</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Taken</TableHead><TableHead>Answer</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{c.user?.fullName ?? c.user?.email}</TableCell>
                  <TableCell className="max-w-xs">{c.reason}{c.employeeNote && <div className="text-xs text-muted-foreground">“{c.employeeNote}”</div>}</TableCell>
                  <TableCell className="text-right">{formatCurrency(c.amount)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(c.recovered)}</TableCell>
                  <TableCell><Badge variant={c.status === "disputed" ? "destructive" : "secondary"}>{c.status}</Badge></TableCell>
                  <TableCell className="whitespace-nowrap space-x-2">
                    {superAdmin && c.status === "disputed" && <Button size="sm" onClick={() => attempt(() => send(`/api/admin/payroll/charges/${c.id}`, "POST", { uphold: true }), "Upheld", load)}>Uphold</Button>}
                    {superAdmin && ["proposed", "disputed", "acknowledged"].includes(c.status) && <Button size="sm" variant="outline" onClick={() => attempt(() => send(`/api/admin/payroll/charges/${c.id}`, "POST", { uphold: false }), "Withdrawn", load)}>Withdraw</Button>}
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
