"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

const lastMonth = () => {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() - 1);
  return d.toISOString().slice(0, 7);
};

async function send(url: string, method: string, body?: unknown) {
  const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed");
  return data;
}

export function InvestorEngineClient({ superAdmin, equipment }: { superAdmin: boolean; equipment: { id: string; name: string; purchasePrice: number; usefulLifeMonths: number | null; residualValue: number | null; depreciationStart: string | null; powerKw: number | null; floorAreaM2: number | null; carriedLoss: number }[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Investor engine</h1>
        <p className="text-muted-foreground">Moving balances to the ledger, closing machine months, shared bills, exits and agreement versions.</p>
      </div>
      <Tabs defaultValue="migration" className="space-y-6">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="migration">Move to the ledger</TabsTrigger>
          <TabsTrigger value="machines">Machines: monthly close</TabsTrigger>
          <TabsTrigger value="bills">Shared bills</TabsTrigger>
          <TabsTrigger value="exits">Exits</TabsTrigger>
          <TabsTrigger value="agreements">Agreement</TabsTrigger>
        </TabsList>
        <TabsContent value="migration"><Migration superAdmin={superAdmin} /></TabsContent>
        <TabsContent value="machines"><Machines equipment={equipment} /></TabsContent>
        <TabsContent value="bills"><Bills /></TabsContent>
        <TabsContent value="exits"><Exits /></TabsContent>
        <TabsContent value="agreements"><Agreements superAdmin={superAdmin} /></TabsContent>
      </Tabs>
    </div>
  );
}

function Migration({ superAdmin }: { superAdmin: boolean }) {
  const [preview, setPreview] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const load = useCallback(() => fetch("/api/admin/investors/migration").then((r) => r.json()).then(setPreview), []);
  useEffect(() => {
    load();
  }, [load]);
  if (!preview) return <p className="text-muted-foreground">Checking every investor…</p>;

  const run = async () => {
    if (!confirm("Move every investor balance into the ledger now? This happens once. Take a database backup first.")) return;
    setRunning(true);
    try {
      const out = await send("/api/admin/investors/migration", "POST");
      toast.success(`Done: ${out.investors} investors moved. ${out.adjustments.length} adjustment(s).`);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setRunning(false);
    }
  };

  const problems = preview.investors.filter((i: any) => i.problems.length > 0);
  const over = preview.products.filter((p: any) => p.overFundedUnits > 0);
  const overMachines = preview.machines.filter((m: any) => m.overFunded);

  return (
    <div className="space-y-6">
      <Card className={preview.live ? "border-green-300" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {preview.live ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <AlertTriangle className="h-5 w-5 text-amber-600" />}
            {preview.live ? "Investor accounts are on the ledger" : "Investor accounts are still on the old system"}
          </CardTitle>
          <CardDescription>
            {preview.live
              ? "Every sale, machine month, deposit and withdrawal now goes through the ledger."
              : "Check the list below, fix what is wrong, take a backup, then move. Every balance comes over unchanged; units funded beyond real stock are reduced and their capital returned to free capital."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Free capital</div><div className="font-bold">{formatCurrency(preview.totals.free)}</div></div>
            <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Profit</div><div className="font-bold">{formatCurrency(preview.totals.profit)}</div></div>
            <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">In products</div><div className="font-bold">{formatCurrency(preview.totals.inProducts)}</div></div>
            <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">In machines</div><div className="font-bold">{formatCurrency(preview.totals.inMachines)}</div></div>
          </div>
          {(preview.openWithdrawals > 0 || preview.openDeposits > 0) && (
            <p className="text-sm">Open: {preview.openWithdrawals} withdrawal(s), {preview.openDeposits} deposit(s) on the old flow. They keep working and are recorded in the ledger when confirmed.</p>
          )}
          {!preview.live && superAdmin && (
            <Button onClick={run} disabled={running}>{running ? "Moving…" : "Move investor balances to the ledger"}</Button>
          )}
          {!preview.live && !superAdmin && <p className="text-sm text-muted-foreground">Only a super admin can run this.</p>}
        </CardContent>
      </Card>

      {(problems.length > 0 || over.length > 0 || overMachines.length > 0) && (
        <Card>
          <CardHeader><CardTitle>Things to look at</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {problems.map((i: any) => <div key={i.investorId}>{i.investorNumber} {i.name}: {i.problems.join("; ")}</div>)}
            {over.map((p: any) => <div key={p.productId + p.variantId}>{p.name}: {p.fundedUnits} units funded but {p.inStock} in stock ({p.overFundedUnits} will be reduced)</div>)}
            {overMachines.map((m: any) => <div key={m.equipmentId}>{m.name}: funded {m.investorPercent}% (will be reduced to 100%)</div>)}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Every investor</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investor</TableHead>
                <TableHead className="text-right">Free</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead className="text-right">Machines</TableHead>
                <TableHead>History</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {preview.investors.map((i: any) => (
                <TableRow key={i.investorId}>
                  <TableCell>{i.investorNumber}<div className="text-xs text-muted-foreground">{i.name}</div></TableCell>
                  <TableCell className="text-right">{formatCurrency(i.free)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(i.profit)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(i.inProducts)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(i.inMachines)}</TableCell>
                  <TableCell>{i.historyMatches ? <Badge variant="outline">matches</Badge> : <Badge variant="destructive">differs</Badge>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Machines({ equipment }: { equipment: any[] }) {
  const [month, setMonth] = useState(lastMonth());
  const [statements, setStatements] = useState<Record<string, any>>({});
  const [settings, setSettings] = useState<Record<string, any>>(() => Object.fromEntries(equipment.map((e) => [e.id, e])));

  const preview = async (id: string) => {
    const out = await fetch(`/api/admin/equipment/${id}/month?month=${month}`).then((r) => r.json());
    setStatements((s) => ({ ...s, [id]: out }));
  };
  const close = async (id: string) => {
    if (!confirm(`Close ${month} for this machine and share its profit? This cannot be undone.`)) return;
    try {
      await send(`/api/admin/equipment/${id}/month`, "POST", { month });
      toast.success("Month closed and shared");
      preview(id);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  const saveSettings = async (id: string) => {
    const s = settings[id];
    try {
      await send(`/api/admin/equipment/${id}`, "PATCH", {
        usefulLifeMonths: s.usefulLifeMonths,
        residualValue: s.residualValue,
        depreciationStart: s.depreciationStart,
        powerKw: s.powerKw,
        floorAreaM2: s.floorAreaM2,
      });
      toast.success("Saved");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  const field = (id: string, key: string, label: string, type = "number") => (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input type={type} value={settings[id]?.[key] ?? ""} onChange={(e) => setSettings((s) => ({ ...s, [id]: { ...s[id], [key]: e.target.value } }))} />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="space-y-1">
          <Label>Month</Label>
          <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>
        <p className="text-sm text-muted-foreground">Enter the month&apos;s electricity bill and rent first (Shared bills tab). Months close in order, once each.</p>
      </div>
      {equipment.map((e) => {
        const st = statements[e.id];
        const s = st?.statement ?? st?.period;
        return (
          <Card key={e.id}>
            <CardHeader>
              <CardTitle>{e.name} <span className="text-base font-normal text-muted-foreground">· {formatCurrency(e.purchasePrice)}</span></CardTitle>
              {e.carriedLoss > 0 && <CardDescription>Loss carried: {formatCurrency(e.carriedLoss)}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-5">
                {field(e.id, "usefulLifeMonths", "Useful life (months)")}
                {field(e.id, "residualValue", "Value left at the end")}
                {field(e.id, "depreciationStart", "Depreciation from", "date")}
                {field(e.id, "powerKw", "Power (kW)")}
                {field(e.id, "floorAreaM2", "Floor area (m²)")}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => saveSettings(e.id)}>Save settings</Button>
                <Button size="sm" variant="outline" onClick={() => preview(e.id)}>Preview {month}</Button>
                {st && !st.closed && <Button size="sm" onClick={() => close(e.id)}>Close {month}</Button>}
                {st?.closed && <Badge>closed</Badge>}
              </div>
              {s && (
                <div className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                  <div className="flex justify-between"><span>Income from jobs</span><span>{formatCurrency(s.revenue)}</span></div>
                  <div className="flex justify-between"><span>Job costs</span><span>−{formatCurrency(s.directCosts)}</span></div>
                  <div className="flex justify-between"><span>Electricity</span><span>−{formatCurrency(s.electricity)}</span></div>
                  <div className="flex justify-between"><span>Floor rent</span><span>−{formatCurrency(s.rent)}</span></div>
                  <div className="flex justify-between"><span>Depreciation (to reserve)</span><span>−{formatCurrency(s.depreciation)}</span></div>
                  <div className="flex justify-between font-medium"><span>Profit</span><span>{formatCurrency(s.profit)}</span></div>
                  <div className="flex justify-between"><span>Loss recovered</span><span>{formatCurrency(s.lossRecovered)}</span></div>
                  <div className="flex justify-between"><span>Loss carried after</span><span>{formatCurrency(s.lossCarriedOut)}</span></div>
                  <div className="flex justify-between"><span>SuberCraftex share</span><span>{formatCurrency(s.companyShare)}</span></div>
                  <div className="flex justify-between font-medium"><span>Owners&apos; pool</span><span>{formatCurrency(s.investorPool)}</span></div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function Bills() {
  const [month, setMonth] = useState(lastMonth());
  const [rows, setRows] = useState<any[]>([]);
  const [elec, setElec] = useState({ amount: "", totalKwh: "" });
  const [rent, setRent] = useState({ amount: "", totalAreaM2: "" });
  const load = useCallback(() => fetch("/api/admin/shared-costs").then((r) => r.json()).then((d) => setRows(Array.isArray(d) ? d : [])), []);
  useEffect(() => {
    load();
  }, [load]);
  const save = async (kind: "electricity" | "rent") => {
    try {
      await send("/api/admin/shared-costs", "PUT", kind === "electricity" ? { kind, month, amount: Number(elec.amount), totalKwh: Number(elec.totalKwh) } : { kind, month, amount: Number(rent.amount), totalAreaM2: Number(rent.totalAreaM2) });
      toast.success("Saved");
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Bills for a month</CardTitle>
          <CardDescription>
            Electricity is shared by each machine&apos;s power × hours, against the real kWh on the bill; what machines did not use (lights, tills) stays with SuberCraftex.
            Rent is shared by each machine&apos;s floor area. Other overheads are not charged to machines.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1 max-w-xs">
            <Label>Month</Label>
            <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-lg border p-3">
              <div className="font-medium">Electricity bill</div>
              <Input placeholder="Amount (FCFA)" type="number" value={elec.amount} onChange={(e) => setElec((v) => ({ ...v, amount: e.target.value }))} />
              <Input placeholder="kWh on the bill" type="number" value={elec.totalKwh} onChange={(e) => setElec((v) => ({ ...v, totalKwh: e.target.value }))} />
              <Button size="sm" onClick={() => save("electricity")}>Save</Button>
            </div>
            <div className="space-y-2 rounded-lg border p-3">
              <div className="font-medium">Workshop rent</div>
              <Input placeholder="Amount (FCFA)" type="number" value={rent.amount} onChange={(e) => setRent((v) => ({ ...v, amount: e.target.value }))} />
              <Input placeholder="Total rented area (m²)" type="number" value={rent.totalAreaM2} onChange={(e) => setRent((v) => ({ ...v, totalAreaM2: e.target.value }))} />
              <Button size="sm" onClick={() => save("rent")}>Save</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Month</TableHead><TableHead>Bill</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">kWh / m²</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{String(r.periodStart).slice(0, 7)}</TableCell>
                  <TableCell className="capitalize">{r.kind}</TableCell>
                  <TableCell className="text-right">{formatCurrency(r.amount)}</TableCell>
                  <TableCell className="text-right">{r.totalKwh ?? r.totalAreaM2}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Exits() {
  const [rows, setRows] = useState<any[]>([]);
  const load = useCallback(() => fetch("/api/admin/investor-exits").then((r) => r.json()).then((d) => setRows(Array.isArray(d) ? d : [])), []);
  useEffect(() => {
    load();
  }, [load]);

  const complete = async (exit: any) => {
    let body: Record<string, unknown>;
    if (exit.kind === "product") {
      const asked = exit.requestedOption ?? "collect";
      const option = prompt(
        `The investor asked to ${asked === "collect" ? "COLLECT the goods" : "be paid at cost (BUY_BACK)"}${exit.unitsMilli ? ` for ${Number(exit.unitsMilli) / 1000} unit(s)` : " for the whole lot"}. Type collect or buy_back.`,
        asked
      );
      if (!option) return;
      const note =
        option !== asked
          ? prompt("This is not what the investor asked for. Say why (they will see it):")
          : option === "collect"
            ? prompt("Handover note (who collected, ID checked, condition):", "")
            : "";
      if (option !== asked && !note) return;
      body = { option, note };
    } else {
      const option = prompt("Who buys the share? Type co_owner, company or sell.");
      if (!option) return;
      if (option === "co_owner") body = { option, buyerInvestorId: prompt("Buyer's investor id (from their page)"), price: Number(prompt("Price (FCFA)", String(exit.valuation))) };
      else if (option === "company") body = { option, price: Number(prompt("Price (FCFA)", String(exit.valuation))), instalments: Number(prompt("Monthly instalments", "1")) };
      else body = { option, proceeds: Number(prompt("Sale price received (FCFA)")), into: prompt("Where is the money? camsol, safe or bank", "bank") };
    }
    try {
      await send(`/api/admin/investor-exits/${exit.id}/complete`, "POST", body);
      toast.success("Exit completed");
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investors leaving</CardTitle>
        <CardDescription>Co-owners may buy a machine share first, then SuberCraftex. The notice period must end first (a super admin may waive it).</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Asked</TableHead><TableHead>Investor</TableHead><TableHead>What</TableHead><TableHead className="text-right">Valued at</TableHead><TableHead>Notice ends</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {rows.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{new Date(e.requestedAt).toLocaleDateString()}</TableCell>
                <TableCell>{e.investor?.fullName}<div className="text-xs text-muted-foreground">{e.investor?.investorNumber}</div></TableCell>
                <TableCell>
                  <span className="capitalize">{e.kind}</span>
                  {e.kind === "product" && (
                    <div className="text-xs text-muted-foreground">
                      {e.status === "completed"
                        ? `${e.collectedUnits ? `${e.collectedUnits} collected` : ""}${e.boughtBackMilli && Number(e.boughtBackMilli) > 0 ? ` ${Number(e.boughtBackMilli) / 1000} bought back` : ""}`
                        : `wants ${e.requestedOption === "buy_back" ? "buy back" : "to collect"} · ${e.unitsMilli ? `${Number(e.unitsMilli) / 1000} unit(s)` : "whole lot"}`}
                    </div>
                  )}
                  {e.handedOverAt && (
                    <div className="text-xs">
                      {e.investorConfirmedAt ? "✓ receipt confirmed" : e.investorDisputeNote ? <span className="text-destructive">disputed: {e.investorDisputeNote}</span> : "waiting for the investor to confirm"}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">{formatCurrency(e.valuation ?? 0)}</TableCell>
                <TableCell>{new Date(e.noticeEndsAt).toLocaleDateString()}</TableCell>
                <TableCell><Badge variant={e.status === "completed" ? "default" : "secondary"}>{e.status}</Badge></TableCell>
                <TableCell className="space-x-2 whitespace-nowrap">
                  {["requested", "offered", "agreed"].includes(e.status) && (
                    <>
                      <Button size="sm" onClick={() => complete(e)}>Complete</Button>
                      <Button size="sm" variant="outline" onClick={async () => { await send(`/api/admin/investor-exits/${e.id}/cancel`, "POST"); load(); }}>Cancel</Button>
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

function Agreements({ superAdmin }: { superAdmin: boolean }) {
  const [rows, setRows] = useState<any[]>([]);
  const load = useCallback(() => fetch("/api/admin/investors/agreements").then((r) => r.json()).then((d) => setRows(Array.isArray(d) ? d : [])), []);
  useEffect(() => {
    load();
  }, [load]);
  const publish = async () => {
    if (!confirm("Publish a new agreement version from today's money rules? Every investor must accept it before investing new money.")) return;
    try {
      const out = await send("/api/admin/investors/agreements", "POST", {});
      toast.success(`Version ${out.version} published`);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investor agreement versions</CardTitle>
        <CardDescription>Each version is kept word for word, with who accepted it and when. Change the money rules in Settings, then publish a new version.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {superAdmin && <Button onClick={publish}>Publish a new version</Button>}
        <Table>
          <TableHeader><TableRow><TableHead>Version</TableHead><TableHead>Title</TableHead><TableHead>Published</TableHead><TableHead className="text-right">Accepted by</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.version}</TableCell>
                <TableCell>{v.title}</TableCell>
                <TableCell>{new Date(v.publishedAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">{v._count?.acceptances ?? 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
