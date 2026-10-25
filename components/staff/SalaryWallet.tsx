"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/currency";

async function send(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed");
  return data;
}

export function SalaryWallet() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [withdraw, setWithdraw] = useState({ amount: "", phone: "" });
  const [advance, setAdvance] = useState({ amount: "", reason: "", months: "1" });
  const [busy, setBusy] = useState(false);
  const load = useCallback(
    () =>
      fetch("/api/staff/salary")
        .then(async (r) => ({ ok: r.ok, body: await r.json() }))
        .then(({ ok, body }) => (ok ? setData(body) : setError(body.error))),
    []
  );
  useEffect(() => {
    load();
  }, [load]);

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true);
    try {
      await fn();
      toast.success(ok);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (error) return <p className="text-muted-foreground">{error}</p>;
  if (!data) return <p className="text-muted-foreground">Loading…</p>;
  const proposed = data.charges.filter((c: any) => c.status === "proposed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Salary</h1>
        <p className="text-muted-foreground">{data.pay.jobTitle} · {formatCurrency(data.pay.monthlySalary)} gross a month</p>
      </div>

      {proposed.length > 0 && (
        <Card className="border-amber-300">
          <CardHeader><CardTitle>Charges waiting for your answer</CardTitle><CardDescription>Nothing is taken from your salary unless you accept. If you dispute, a manager decides.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {proposed.map((c: any) => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                <div><div className="font-medium">{formatCurrency(c.amount)}</div><div className="text-sm">{c.reason}</div></div>
                <div className="flex gap-2">
                  <Button size="sm" disabled={busy} onClick={() => run(() => send(`/api/staff/salary/charges/${c.id}`, { accept: true }), "Accepted")}>Accept</Button>
                  <Button size="sm" variant="outline" disabled={busy} onClick={() => { const note = prompt("Why do you not agree?"); if (note) run(() => send(`/api/staff/salary/charges/${c.id}`, { accept: false, note }), "Sent to a manager"); }}>Dispute</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Salary wallet: {formatCurrency(data.wallet.balance)}</CardTitle>
            <CardDescription>
              Send it to your Mobile Money. {data.feePaidByCompany ? "SuberCraftex pays the transfer fee." : `The most you can send, after the fee, is ${formatCurrency(data.wallet.sendable)}.`} A manager approves each transfer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input type="number" placeholder="Amount (FCFA)" value={withdraw.amount} onChange={(e) => setWithdraw((w) => ({ ...w, amount: e.target.value }))} />
            <Input placeholder={`Number (default ${data.pay.payoutPhone ?? "your phone"})`} value={withdraw.phone} onChange={(e) => setWithdraw((w) => ({ ...w, phone: e.target.value }))} />
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setWithdraw((w) => ({ ...w, amount: String(data.wallet.sendable) }))}>All</Button>
              <Button size="sm" disabled={busy || !withdraw.amount} onClick={() => run(() => send("/api/staff/salary/withdraw", { amount: Number(withdraw.amount), phone: withdraw.phone || undefined }), "Requested: you will receive it once approved")}>Send to my phone</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ask for an advance</CardTitle>
            <CardDescription>Up to {data.advanceMaxPercent}% of a month&apos;s salary, taken back from the next salaries.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" placeholder="Amount (FCFA)" value={advance.amount} onChange={(e) => setAdvance((a) => ({ ...a, amount: e.target.value }))} />
              <div className="flex items-center gap-2"><Label className="whitespace-nowrap text-sm">Repay over</Label><Input type="number" min={1} max={6} value={advance.months} onChange={(e) => setAdvance((a) => ({ ...a, months: e.target.value }))} /><span className="text-sm">months</span></div>
            </div>
            <Input placeholder="What is it for?" value={advance.reason} onChange={(e) => setAdvance((a) => ({ ...a, reason: e.target.value }))} />
            <Button size="sm" disabled={busy || !advance.amount || !advance.reason} onClick={() => run(() => send("/api/staff/salary/advances", { amount: Number(advance.amount), reason: advance.reason, months: Number(advance.months) }), "Sent to a manager")}>Ask</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Payslips</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Month</TableHead><TableHead className="text-right">Gross</TableHead><TableHead className="text-right">Net paid</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {data.payslips.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>{String(p.run.periodStart).slice(0, 7)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.gross)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.net)}</TableCell>
                  <TableCell><Link className="text-sm underline" href={`/account/salary/payslip/${p.id}`}>Open</Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {(data.advances.length > 0 || data.charges.length > 0) && (
        <Card>
          <CardHeader><CardTitle>Advances and charges</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {data.advances.map((a: any) => (
              <div key={a.id} className="flex justify-between gap-3 border-b py-2">
                <span>Advance {formatCurrency(a.amount)}: {a.reason}{a.decisionNote && ` (${a.decisionNote})`}</span>
                <span className="whitespace-nowrap">{formatCurrency(a.recovered)} repaid <Badge variant="secondary">{a.status}</Badge></span>
              </div>
            ))}
            {data.charges.map((c: any) => (
              <div key={c.id} className="flex justify-between gap-3 border-b py-2">
                <span>Charge {formatCurrency(c.amount)}: {c.reason}</span>
                <span className="whitespace-nowrap">{formatCurrency(c.recovered)} taken <Badge variant="secondary">{c.status}</Badge></span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Wallet movements</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>What</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Balance</TableHead></TableRow></TableHeader>
            <TableBody>
              {data.wallet.statement.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap">{new Date(r.at).toLocaleDateString()}</TableCell>
                  <TableCell>{r.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(r.amount)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(r.balanceAfter)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
