"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MobileMoneyPay } from "@/components/payments/MobileMoneyPay";
import { formatCurrency } from "@/lib/currency";

const STATUS: Record<string, string> = { scheduled: "upcoming", invoiced: "due", paid: "paid", waived: "waived", cancelled: "cancelled" };

/** The apprentice's fees: what is due, how to pay, and every receipt. Hidden when they have no fees. */
export function ApprenticeFees() {
  const [data, setData] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [amount, setAmount] = useState("");
  const load = useCallback(() => fetch("/api/apprentices/me/fees").then((r) => (r.ok ? r.json() : null)).then(setData), []);
  useEffect(() => {
    load();
  }, [load]);
  if (!data || !data.standing.hasFees) return null;
  const s = data.standing;
  const value = Number(amount) || 0;

  return (
    <Card className={s.paused ? "border-destructive" : s.overdue > 0 ? "border-amber-300" : ""}>
      <CardHeader>
        <CardTitle>Training fees</CardTitle>
        <CardDescription>
          {s.outstanding === 0
            ? "Everything is paid. Thank you."
            : `${formatCurrency(s.outstanding)} left to pay${s.nextDue ? `; next: ${formatCurrency(s.nextDue.amount - s.nextDue.paid)} by ${String(s.nextDue.dueDate).slice(0, 10)}` : ""}.`}
          {s.overdue > 0 && ` ${formatCurrency(s.overdue)} is ${s.daysOverdue} days late.`}
          {s.paused && " New assignments are paused until the late fees are paid."}
          {" "}A certificate is given once every fee is paid.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {s.outstanding > 0 && (
          paying ? (
            <div className="space-y-3 rounded-lg border p-3">
              <div className="space-y-1">
                <Label>Amount (FCFA)</Label>
                <div className="flex gap-2">
                  <Input type="number" min={100} value={amount} onChange={(e) => setAmount(e.target.value)} />
                  <Button variant="outline" onClick={() => setAmount(String(s.overdue > 0 ? s.overdue : s.outstanding))}>{s.overdue > 0 ? "What is late" : "All"}</Button>
                </div>
              </div>
              {value >= 100 && value <= s.outstanding && (
                <MobileMoneyPay
                  purpose="apprentice_fee"
                  id={data.apprenticeId}
                  amount={value}
                  extra={{ amount: value }}
                  defaultPhone={data.phone}
                  startUrl="/api/apprentices/me/fees/mobile-money"
                  compact
                  onPaid={() => setTimeout(() => { setPaying(false); setAmount(""); load(); }, 1500)}
                />
              )}
              <Button variant="ghost" size="sm" onClick={() => setPaying(false)}>Close</Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => setPaying(true)}>Pay by Mobile Money</Button>
              <span className="text-sm text-muted-foreground">or pay cash at the shop and ask for a receipt.</span>
            </div>
          )
        )}

        {data.schedules.map((sch: any) => (
          <div key={sch.id} className="space-y-2">
            <div className="font-medium">{sch.planName}{sch.discount > 0 && <span className="text-sm font-normal text-muted-foreground"> · discount {formatCurrency(sch.discount)}</span>} <Badge variant="secondary">{sch.status}</Badge></div>
            <Table>
              <TableHeader><TableRow><TableHead>Due</TableHead><TableHead>For</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Paid</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody>
                {sch.instalments.map((i: any) => (
                  <TableRow key={i.id}>
                    <TableCell>{String(i.dueDate).slice(0, 10)}</TableCell>
                    <TableCell>{i.label}</TableCell>
                    <TableCell className="text-right">{formatCurrency(i.amount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(i.paid)}</TableCell>
                    <TableCell><Badge variant={i.status === "invoiced" && i.paid < i.amount ? "destructive" : "outline"}>{STATUS[i.status]}</Badge></TableCell>
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
                <span>{new Date(p.createdAt).toLocaleDateString()} · {p.receiptNumber} · {p.method.replace(/_/g, " ")}</span>
                <span>{formatCurrency(p.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
