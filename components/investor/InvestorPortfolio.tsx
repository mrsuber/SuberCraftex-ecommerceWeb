"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownToLine, ArrowUpFromLine, Download, FileWarning, ShieldAlert } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { MobileMoneyPay } from "@/components/payments/MobileMoneyPay";

interface Portfolio {
  investor: { id: string; investorNumber: string; fullName: string; status: string; suspendedReason: string | null; suspendedAt: string | null };
  balances: { free: number; profitAvailable: number; profitPending: number; exitDue: number; inProducts: number; inMachines: number; reserves: number; atMarket: number };
  purchases: any[];
  lots: any[];
  proposals: any[];
  machines: any[];
  exits: any[];
  agreement: { version: number; acceptedCurrent: boolean };
}

interface Entry {
  id: string;
  at: string;
  reference: string;
  description: string;
  account: string;
  amount: number;
  balanceAfter: number;
}

export function InvestorPortfolio() {
  const [data, setData] = useState<Portfolio | null>(null);
  const [statement, setStatement] = useState<Entry[]>([]);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [leaving, setLeaving] = useState<any>(null);

  const load = useCallback(async () => {
    const [p, s] = await Promise.all([fetch("/api/investors/me/portfolio").then((r) => r.json()), fetch("/api/investors/me/statement").then((r) => r.json())]);
    setData(p);
    setStatement(Array.isArray(s) ? s : []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!data) return <p className="py-10 text-center text-muted-foreground">Loading your account…</p>;
  const b = data.balances;

  const leave = async (body: Record<string, unknown>, label: string) => {
    if (!confirm(`Ask to leave ${label}? A notice period applies, and SuberCraftex will contact you with the options.`)) return;
    const res = await fetch("/api/investors/exits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const out = await res.json();
    if (!res.ok) return toast.error(out.error || "Could not send");
    toast.success(`Request sent. Valued at ${formatCurrency(out.valuation)}; notice ends ${new Date(out.noticeEndsAt).toLocaleDateString()}.`);
    setLeaving(null);
    load();
  };

  const handover = async (id: string, received: boolean) => {
    const note = received ? null : prompt("What is wrong? (units missing, damaged…)");
    if (!received && !note) return;
    const res = await fetch(`/api/investors/exits/${id}/handover`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ received, note }) });
    const out = await res.json();
    if (!res.ok) return toast.error(out.error || "Could not send");
    toast.success(received ? "Thank you: receipt confirmed" : "Sent to SuberCraftex");
    load();
  };

  const proposal = async (id: string, action: "accept" | "decline") => {
    const reason = action === "decline" ? prompt("Why don't you accept this value?") ?? "" : "";
    if (action === "decline" && !reason) return;
    const res = await fetch(`/api/investors/lots/${id}/${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason }) });
    const out = await res.json();
    if (!res.ok) return toast.error(out.error || "Could not save");
    toast.success(action === "accept" ? "Accepted: the goods are now your capital" : "Declined: SuberCraftex has been told");
    load();
  };

  const dispute = async (entry: Entry) => {
    const message = prompt(`What is wrong with "${entry.description}"?`);
    if (!message) return;
    const res = await fetch("/api/investors/disputes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference: entry.reference, message }) });
    const out = await res.json();
    if (!res.ok) return toast.error(out.error || "Could not send");
    toast.success(`Sent. SuberCraftex will answer by ${new Date(out.answerDueBy).toLocaleDateString()}.`);
  };

  const card = (label: string, value: number, hint?: string) => (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{formatCurrency(value)}</CardTitle>
      </CardHeader>
      {hint && <CardContent className="pt-0 text-xs text-muted-foreground">{hint}</CardContent>}
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{data.investor.fullName}</h1>
          <p className="text-muted-foreground">Investor {data.investor.investorNumber}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setDepositOpen(true)} disabled={!data.agreement.acceptedCurrent || data.investor.status === "suspended"}>
            <ArrowDownToLine className="mr-2 h-4 w-4" /> Deposit
          </Button>
          <Button variant="outline" onClick={() => setWithdrawOpen(true)} disabled={data.investor.status === "suspended"}>
            <ArrowUpFromLine className="mr-2 h-4 w-4" /> Withdraw
          </Button>
          <Button variant="outline" asChild>
            <a href="/api/investors/me/statement?format=csv"><Download className="mr-2 h-4 w-4" /> Statement</a>
          </Button>
        </div>
      </div>

      {data.investor.status === "suspended" && (
        <div className="rounded-lg border border-destructive bg-destructive/5 p-4 text-sm">
          <div className="flex items-center gap-2 font-semibold text-destructive"><ShieldAlert className="h-5 w-5" /> Your account is suspended{data.investor.suspendedAt ? ` since ${new Date(data.investor.suspendedAt).toLocaleDateString()}` : ""}</div>
          {data.investor.suspendedReason && <p className="mt-1">Reason: {data.investor.suspendedReason}</p>}
          <p className="mt-1 text-muted-foreground">
            Deposits, withdrawals and new investments are paused. Your investments keep earning, and you can still raise a dispute or ask to leave an investment. Contact SuberCraftex to resolve it.
          </p>
        </div>
      )}

      {!data.agreement.acceptedCurrent && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <div className="flex items-center gap-2"><ShieldAlert className="h-5 w-5" /> A new version of the investor agreement (version {data.agreement.version}) must be accepted before any new money is invested.</div>
          <Button asChild size="sm"><Link href="/investor/agreement">Read and accept</Link></Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {card("Free capital", b.free, "Withdraw it, or SuberCraftex reinvests it")}
        {card("Profit available", b.profitAvailable, b.profitAvailable < 0 ? "Below zero after a return: recovered from your next earnings" : "Ready to withdraw")}
        {card("Profit pending", b.profitPending, "Becomes available when the return period ends")}
        {card("Invested", b.inProducts + b.inMachines + b.reserves + b.atMarket, `${formatCurrency(b.inProducts)} in products, ${formatCurrency(b.inMachines)} in machines, ${formatCurrency(b.reserves)} in machine reserves${b.atMarket > 0 ? `, ${formatCurrency(b.atMarket)} at the market buying stock` : ""}`)}
      </div>
      {b.exitDue > 0 && <p className="text-sm">SuberCraftex still owes you {formatCurrency(b.exitDue)} from an exit, paid in instalments.</p>}

      {data.proposals.length > 0 && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Values to accept for goods you brought</CardTitle>
            <CardDescription>Nothing counts until you accept. Decline if you disagree, and say why.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.proposals.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                <div>
                  <div className="font-medium">{p.unitsStart} × {p.productName} at {formatCurrency(p.unitCost)} each = {formatCurrency(p.unitsStart * p.unitCost)}</div>
                  {p.proposedValueNote && <div className="text-sm text-muted-foreground">{p.proposedValueNote}</div>}
                </div>
                <div className="space-x-2">
                  <Button size="sm" onClick={() => proposal(p.id, "accept")}>Accept</Button>
                  <Button size="sm" variant="outline" onClick={() => proposal(p.id, "decline")}>Decline</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="products">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="products">Products ({data.lots.filter((l) => l.status === "active").length})</TabsTrigger>
          <TabsTrigger value="machines">Machines ({data.machines.filter((m) => m.status === "active").length})</TabsTrigger>
          <TabsTrigger value="statement">Statement</TabsTrigger>
          {data.purchases.length > 0 && <TabsTrigger value="purchases">Restocking ({data.purchases.length})</TabsTrigger>}
          {data.exits.length > 0 && <TabsTrigger value="exits">Leaving ({data.exits.length})</TabsTrigger>}
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardDescription>
                Each sale is shared across everyone who holds this product, in proportion to what each still has, so your stock sells at the same pace as everyone else&apos;s.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Left</TableHead>
                    <TableHead className="text-right">Sold</TableHead>
                    <TableHead className="text-right">Cost each</TableHead>
                    <TableHead className="text-right">Capital in it</TableHead>
                    <TableHead className="text-right">Your profit</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.lots.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>{l.productName}{l.source === "in_kind" && <Badge variant="outline" className="ml-2">brought by you</Badge>}{l.status !== "active" && <Badge variant="secondary" className="ml-2">{l.status.replace("_", " ")}</Badge>}</TableCell>
                      <TableCell className="text-right">{l.unitsLeft}</TableCell>
                      <TableCell className="text-right">{l.unitsSold}</TableCell>
                      <TableCell className="text-right">{formatCurrency(l.unitCost)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(l.capital)}</TableCell>
                      <TableCell className={`text-right ${l.profitEarned < 0 ? "text-red-600" : ""}`}>{formatCurrency(l.profitEarned)}</TableCell>
                      <TableCell>{l.status === "active" && <Button size="sm" variant="ghost" onClick={() => setLeaving({ lot: l, option: "collect", units: "", notes: "" })}>Leave</Button>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="machines" className="space-y-4">
          {data.machines.map((m) => (
            <Card key={m.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle>{m.name} <span className="text-base font-normal text-muted-foreground">· {m.percent.toFixed(2)}% yours</span></CardTitle>
                  {m.status === "active" ? <Button size="sm" variant="ghost" onClick={() => leave({ holdingId: m.id }, m.name)}>Leave</Button> : <Badge variant="secondary">{m.status}</Badge>}
                </div>
                <CardDescription>
                  You paid {formatCurrency(m.costBasis)}. Now: {formatCurrency(m.capital)} in the machine + {formatCurrency(m.reserve)} in its replacement reserve
                  {m.lossShare > 0 && <> − {formatCurrency(m.lossShare)} share of a loss still carried</>} = {formatCurrency(m.bookValue)}.
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {m.months.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No month closed yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Income</TableHead>
                        <TableHead className="text-right">Job costs</TableHead>
                        <TableHead className="text-right">Electricity</TableHead>
                        <TableHead className="text-right">Rent</TableHead>
                        <TableHead className="text-right">Depreciation</TableHead>
                        <TableHead className="text-right">Profit</TableHead>
                        <TableHead className="text-right">Yours</TableHead>
                        <TableHead className="text-right">To your reserve</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {m.months.map((p: any) => (
                        <TableRow key={p.month}>
                          <TableCell>{p.month}</TableCell>
                          <TableCell className="text-right">{formatCurrency(p.revenue)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(p.directCosts)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(p.electricity)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(p.rent)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(p.depreciation)}</TableCell>
                          <TableCell className={`text-right ${p.profit < 0 ? "text-red-600" : ""}`}>{formatCurrency(p.profit)}{p.lossCarriedOut > 0 && <div className="text-xs text-muted-foreground">loss carried {formatCurrency(p.lossCarriedOut)}</div>}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(p.yourProfit)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(p.yourReserve)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          ))}
          {data.machines.length === 0 && <p className="text-muted-foreground">No machine shares yet.</p>}
        </TabsContent>

        <TabsContent value="statement">
          <Card>
            <CardHeader>
              <CardDescription>Every movement on your accounts. Entries are never changed: a correction is a new entry. If one looks wrong, dispute it.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>What</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">After</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statement.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="whitespace-nowrap">{new Date(e.at).toLocaleDateString()}</TableCell>
                      <TableCell>{e.description}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{e.account}</TableCell>
                      <TableCell className={`text-right ${e.amount < 0 ? "text-red-600" : "text-green-700"}`}>{e.amount > 0 ? "+" : ""}{formatCurrency(e.amount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(e.balanceAfter)}</TableCell>
                      <TableCell><Button size="sm" variant="ghost" title="Dispute this entry" onClick={() => dispute(e)}><FileWarning className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardDescription>
                SuberCraftex takes investors&apos; free capital to the market to restock. Your part of each purchase buys your share of every line, at the price paid
                plus a share of transport. What is not spent comes back to your free capital.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.purchases.map((p) => (
                <div key={p.id} className="rounded-lg border p-3 text-sm space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{p.number} · {new Date(p.date).toLocaleDateString()}</span>
                    <Badge variant={p.status === "received" ? "default" : "secondary"}>{p.status === "received" ? "received" : p.status === "cancelled" ? "cancelled" : "at the market"}</Badge>
                  </div>
                  <div>
                    Your part: {formatCurrency(p.yourAmount)} of {formatCurrency(p.total)}
                    {p.yourUsed !== null && ` · in goods ${formatCurrency(p.yourUsed)} · back to free capital ${formatCurrency(p.yourReturned)}`}
                  </div>
                  {p.lines.length > 0 && (
                    <div className="text-muted-foreground">
                      {p.lines.map((l: any, i: number) => (
                        <div key={i}>{l.quantity} × {l.product}: {formatCurrency(l.lineTotal)} + {formatCurrency(l.transportShare)} transport = {formatCurrency(l.unitCost)} each</div>
                      ))}
                    </div>
                  )}
                  {p.receipts.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {p.receipts.map((r: string, i: number) => <a key={r} className="underline" href={r} target="_blank" rel="noreferrer">Receipt {i + 1}</a>)}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exits">
          <Card>
            <CardContent className="pt-6 space-y-3">
              {data.exits.map((e) => (
                <div key={e.id} className="rounded-lg border p-3 text-sm space-y-1">
                  <div className="font-medium">{e.productName ?? e.machineName ?? (e.kind === "product" ? "Product lot" : "Machine share")} · <span className="capitalize">{e.status}</span></div>
                  {e.kind === "product" && e.status !== "completed" && (
                    <div>You asked to {e.requestedOption === "buy_back" ? "be paid at cost" : "collect the goods"}{e.units ? ` for ${e.units} unit(s)` : " for the whole lot"}.</div>
                  )}
                  <div>Valued at {formatCurrency(e.valuation ?? 0)} ({e.valuationMethod?.replace("_", " ")}); notice ends {new Date(e.noticeEndsAt).toLocaleDateString()}.</div>
                  {e.status === "completed" && e.kind === "product" && (
                    <div>
                      {e.collectedUnits ? `You collected ${e.collectedUnits} unit(s)` : ""}
                      {e.collectedUnits && e.boughtBackUnits ? "; " : ""}
                      {e.boughtBackUnits ? `SuberCraftex bought back ${e.boughtBackUnits} unit(s) at cost (paid into your free capital)` : ""}.
                    </div>
                  )}
                  {e.price !== null && e.kind !== "product" && <div>Agreed: {formatCurrency(e.price)}{e.instalments > 1 ? ` in ${e.instalments} instalments` : ""}</div>}
                  {e.handedOverAt && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span>Handed over on {new Date(e.handedOverAt).toLocaleDateString()}{e.handoverNote ? ` (${e.handoverNote})` : ""}.</span>
                      {e.investorConfirmedAt && <Badge variant="outline">you confirmed receipt</Badge>}
                      {e.investorDisputeNote && <Badge variant="destructive">you reported a problem</Badge>}
                      {!e.investorConfirmedAt && !e.investorDisputeNote && (
                        <>
                          <Button size="sm" onClick={() => handover(e.id, true)}>I received them</Button>
                          <Button size="sm" variant="outline" onClick={() => handover(e.id, false)}>Something is wrong</Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!leaving} onOpenChange={(o) => !o && setLeaving(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave {leaving?.lot.productName}</DialogTitle>
            <DialogDescription>
              {leaving && `${leaving.lot.unitsLeft} unit(s) left in this lot, worth ${formatCurrency(leaving.lot.capital)} at cost.`} A notice period applies. Units sold meanwhile are shared as usual.
            </DialogDescription>
          </DialogHeader>
          {leaving && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-sm"><input type="radio" checked={leaving.option === "collect"} onChange={() => setLeaving((x: any) => ({ ...x, option: "collect" }))} /> Collect the goods (whole units; any part-unit is paid to you at cost)</label>
                <label className="flex items-start gap-2 text-sm"><input type="radio" checked={leaving.option === "buy_back"} onChange={() => setLeaving((x: any) => ({ ...x, option: "buy_back" }))} /> SuberCraftex keeps them and pays me their cost into my free capital</label>
              </div>
              <div className="space-y-1">
                <Label>Units (leave empty for the whole lot)</Label>
                <Input type="number" min={1} max={Math.floor(leaving.lot.unitsLeft)} value={leaving.units} onChange={(e) => setLeaving((x: any) => ({ ...x, units: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Note (optional)</Label>
                <Input value={leaving.notes} onChange={(e) => setLeaving((x: any) => ({ ...x, notes: e.target.value }))} />
              </div>
              <Button className="w-full" onClick={() => leave({ lotId: leaving.lot.id, option: leaving.option, units: leaving.units || null, notes: leaving.notes }, leaving.lot.productName)}>Send request</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit by Mobile Money</DialogTitle>
            <DialogDescription>The money arrives in your free capital as soon as you approve it on your phone.</DialogDescription>
          </DialogHeader>
          <DepositForm investorId={data.investor.id} onDone={() => { setDepositOpen(false); load(); }} />
        </DialogContent>
      </Dialog>

      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw to Mobile Money</DialogTitle>
            <DialogDescription>PayWithCAMSOL charges its fee on top. SuberCraftex checks and sends it; the money is reserved at once.</DialogDescription>
          </DialogHeader>
          <WithdrawForm balances={b} onDone={() => { setWithdrawOpen(false); load(); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DepositForm({ investorId, onDone }: { investorId: string; onDone: () => void }) {
  const [amount, setAmount] = useState("");
  const value = Math.floor(Number(amount) || 0);
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="dep-amount">Amount (FCFA)</Label>
        <Input id="dep-amount" type="number" min={100} step={1} value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      {value >= 100 && (
        <MobileMoneyPay
          purpose="investor_deposit"
          id={investorId}
          amount={value}
          extra={{ amount: value }}
          startUrl="/api/investors/deposits/mobile-money"
          compact
          onPaid={() => setTimeout(onDone, 1500)}
        />
      )}
    </div>
  );
}

function WithdrawForm({ balances, onDone }: { balances: Portfolio["balances"]; onDone: () => void }) {
  const [from, setFrom] = useState<"cash" | "profit">("cash");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [quote, setQuote] = useState<{ max: number; quote: { fee: number; fromAccount: number; enough: boolean } | null } | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/investors/withdrawals/quote?from=${from}&amount=${Math.floor(Number(amount) || 0)}`)
        .then((r) => r.json())
        .then(setQuote);
    }, 250);
    return () => clearTimeout(t);
  }, [from, amount]);

  const submit = async () => {
    setSending(true);
    const res = await fetch("/api/investors/withdrawals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: from, amount: Math.floor(Number(amount)), momoNumber: phone }),
    });
    const out = await res.json();
    setSending(false);
    if (!res.ok) return toast.error(out.error || "Could not send");
    toast.success(`Request ${out.request_number} sent: ${formatCurrency(out.total_from_account)} reserved.`);
    onDone();
  };

  const value = Math.floor(Number(amount) || 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button variant={from === "cash" ? "default" : "outline"} onClick={() => setFrom("cash")}>Free capital ({formatCurrency(balances.free)})</Button>
        <Button variant={from === "profit" ? "default" : "outline"} onClick={() => setFrom("profit")}>Profit ({formatCurrency(Math.max(0, balances.profitAvailable))})</Button>
      </div>
      <div className="space-y-1">
        <Label htmlFor="wd-amount">You receive (FCFA)</Label>
        <Input id="wd-amount" type="number" min={100} step={1} value={amount} onChange={(e) => setAmount(e.target.value)} />
        {quote && <button type="button" className="text-xs underline" onClick={() => setAmount(String(quote.max))}>The most you can send: {formatCurrency(quote.max)}</button>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="wd-phone">Mobile Money number</Label>
        <Input id="wd-phone" type="tel" placeholder="6XX XX XX XX" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      {quote?.quote && value >= 100 && (
        <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
          <div className="flex justify-between"><span>You receive</span><span>{formatCurrency(value)}</span></div>
          <div className="flex justify-between"><span>PayWithCAMSOL fee</span><span>{formatCurrency(quote.quote.fee)}</span></div>
          <div className="flex justify-between font-medium"><span>Taken from your account</span><span>{formatCurrency(quote.quote.fromAccount)}</span></div>
          <div className="text-xs text-muted-foreground">SuberCraftex charges nothing.</div>
          {!quote.quote.enough && <div className="text-red-600">Not enough: with the fee, the most you can send is {formatCurrency(quote.max)}.</div>}
        </div>
      )}
      <Button className="w-full" disabled={sending || value < 100 || !quote?.quote?.enough || phone.replace(/\D/g, "").length < 9} onClick={submit}>
        Ask for this withdrawal
      </Button>
    </div>
  );
}
