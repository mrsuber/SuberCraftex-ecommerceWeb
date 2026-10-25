"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/currency";

interface Payout {
  id: string;
  reason: string;
  userId: string;
  recipientName: string | null;
  amount: number;
  fee: number;
  feePaidByCompany: boolean;
  phone: string;
  provider: string;
  status: string;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Data {
  waiting: Payout[];
  recent: Payout[];
  totalNeeded: number;
  camsolBalance: { balance: number; type: string; currency: string } | null;
  users: Record<string, { fullName: string | null; email: string; role: string }>;
}

const REASON: Record<string, string> = {
  investor_withdrawal: "Investor withdrawal",
  salary: "Salary",
  salary_advance: "Salary advance",
  customer_refund: "Refund",
};

export function PayoutsToSend({ onChange }: { onChange?: () => void }) {
  const [data, setData] = useState<Data | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setData(await fetch("/api/admin/payouts").then((r) => r.json()));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (payout: Payout, action: "approve" | "reject") => {
    let reason = "";
    if (action === "reject") {
      reason = prompt("Why is this payout rejected? The person will see this.") ?? "";
      if (!reason) return;
    } else if (!confirm(`Send ${formatCurrency(payout.amount)} to ${payout.phone}? PayWithCAMSOL takes ${formatCurrency(payout.amount + payout.fee)} from the balance.`)) {
      return;
    }
    setBusy(payout.id);
    const res = await fetch(`/api/admin/payouts/${payout.id}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    const body = await res.json();
    setBusy(null);
    if (!res.ok) return toast.error(body.error || "Failed");
    toast.success(action === "approve" ? `Sent: ${body.status}` : "Rejected: the money is back in the wallet");
    load();
    onChange?.();
  };

  if (!data) return <p className="text-muted-foreground">Loading payouts…</p>;

  const covered = data.camsolBalance ? data.camsolBalance.balance >= data.totalNeeded : null;
  const who = (p: Payout) => data.users[p.userId]?.fullName ?? p.recipientName ?? data.users[p.userId]?.email ?? "—";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payouts waiting for approval</CardTitle>
          <CardDescription>
            The money is already reserved from each wallet. Money paid in can stay pending at PayWithCAMSOL for a while, so check the
            live balance covers these before sending.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Needed for all waiting payouts (with fees)</div>
              <div className="text-xl font-bold">{formatCurrency(data.totalNeeded)}</div>
            </div>
            <div className={`rounded-lg border p-3 ${covered === false ? "border-red-200 bg-red-50" : ""}`}>
              <div className="text-xs text-muted-foreground">PayWithCAMSOL balance {data.camsolBalance ? `(${data.camsolBalance.type})` : ""}</div>
              <div className="text-xl font-bold">{data.camsolBalance ? formatCurrency(data.camsolBalance.balance) : "Check the PayWithCAMSOL dashboard"}</div>
              {covered === false && <div className="text-xs text-red-700">Not enough to send all of them yet.</div>}
            </div>
          </div>
          {data.waiting.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing is waiting.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asked</TableHead>
                    <TableHead>For</TableHead>
                    <TableHead>Who</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="text-right">They receive</TableHead>
                    <TableHead className="text-right">Fee</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.waiting.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="whitespace-nowrap">{new Date(p.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{REASON[p.reason] ?? p.reason}</TableCell>
                      <TableCell>{who(p)}</TableCell>
                      <TableCell>{p.phone} <span className="text-xs text-muted-foreground">{p.provider}</span></TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(p.amount)}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(p.fee)}{p.feePaidByCompany && <div className="text-xs text-muted-foreground">paid by SuberCraftex</div>}</TableCell>
                      <TableCell className="space-x-2 whitespace-nowrap">
                        <Button size="sm" disabled={busy === p.id} onClick={() => act(p, "approve")}>Send</Button>
                        <Button size="sm" variant="outline" disabled={busy === p.id} onClick={() => act(p, "reject")}>Reject</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent payouts</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Updated</TableHead>
                <TableHead>For</TableHead>
                <TableHead>Who</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recent.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="whitespace-nowrap">{new Date(p.updatedAt).toLocaleString()}</TableCell>
                  <TableCell>{REASON[p.reason] ?? p.reason}</TableCell>
                  <TableCell>{who(p)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "succeeded" ? "default" : p.status === "failed" || p.status === "rejected" ? "destructive" : "secondary"}>
                      {p.status}
                    </Badge>
                    {p.failureReason && <div className="text-xs text-muted-foreground">{p.failureReason}</div>}
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
