"use client";

import { useCallback, useEffect, useState } from "react";
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

/** The ledger view of one investor, with the admin actions the new engine adds. */
export function InvestorLedgerPanel({ investorId, products }: { investorId: string; products: { id: string; name: string; variants: { id: string; name: string }[] }[] }) {
  const [data, setData] = useState<any>(null);
  const [inKind, setInKind] = useState({ productId: "", variantId: "", quantity: "", unitCost: "", note: "" });
  const [instalment, setInstalment] = useState("");
  const load = useCallback(() => fetch(`/api/admin/investors/${investorId}/portfolio`).then((r) => r.json()).then(setData), [investorId]);
  useEffect(() => {
    load();
  }, [load]);
  if (!data) return null;

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    try {
      await fn();
      toast.success(ok);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const closeLot = (lotId: string, unitsLeft: number) => {
    const how = prompt("buy_back (SuberCraftex buys at cost), collect (investor takes the goods) or stock_loss (lost in our care, super admin)");
    if (!how) return;
    const units = prompt(`How many whole units? Leave empty for all ${unitsLeft}.`, "");
    if (units === null) return;
    const note = prompt(how === "collect" ? "Handover note (who collected, ID checked, condition)" : "Note (required for stock_loss)") ?? "";
    run(() => send(`/api/admin/lots/${lotId}/close`, { how, units: units.trim() || null, note }), how === "collect" ? "Handed over: the investor will be asked to confirm" : "Done");
  };

  const product = products.find((p) => p.id === inKind.productId);
  const b = data.balances;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ledger accounts</CardTitle>
        <CardDescription>
          What the investor sees. Agreement version {data.agreement.version}: {data.agreement.acceptedCurrent ? "accepted" : "not accepted yet"}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["Free capital", b.free],
            ["Profit available", b.profitAvailable],
            ["Profit held", b.profitPending],
            ["In products", b.inProducts],
            ["In machines", b.inMachines],
            ["Exit owed", b.exitDue],
          ].map(([label, v]) => (
            <div key={label as string} className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className={`font-bold ${(v as number) < 0 ? "text-destructive" : ""}`}>{formatCurrency(v as number)}</div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="font-medium">Product lots</div>
          <Table>
            <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Units left</TableHead><TableHead className="text-right">Capital</TableHead><TableHead className="text-right">Profit earned</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {[...data.proposals, ...data.lots].map((l: any) => (
                <TableRow key={l.id}>
                  <TableCell>{l.productName}{l.source === "in_kind" && <Badge variant="outline" className="ml-2">goods</Badge>}</TableCell>
                  <TableCell><Badge variant={l.status === "active" ? "default" : "secondary"}>{l.status}</Badge></TableCell>
                  <TableCell className="text-right">{l.unitsLeft} / {l.unitsStart}</TableCell>
                  <TableCell className="text-right">{formatCurrency(l.capital)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(l.profitEarned)}</TableCell>
                  <TableCell>{l.status === "active" && <Button size="sm" variant="outline" onClick={() => closeLot(l.id, l.unitsLeft)}>Close</Button>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-lg border p-3">
            <div className="font-medium">Value goods the investor brought</div>
            <p className="text-xs text-muted-foreground">They must accept the value before it counts. The goods are added to stock when they accept.</p>
            <select className="w-full rounded-md border px-3 py-2 text-sm" value={inKind.productId} onChange={(e) => setInKind((v) => ({ ...v, productId: e.target.value, variantId: "" }))}>
              <option value="">Product…</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {product && product.variants.length > 0 && (
              <select className="w-full rounded-md border px-3 py-2 text-sm" value={inKind.variantId} onChange={(e) => setInKind((v) => ({ ...v, variantId: e.target.value }))}>
                <option value="">No variant</option>
                {product.variants.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" placeholder="Quantity" value={inKind.quantity} onChange={(e) => setInKind((v) => ({ ...v, quantity: e.target.value }))} />
              <Input type="number" placeholder="Value per unit (FCFA)" value={inKind.unitCost} onChange={(e) => setInKind((v) => ({ ...v, unitCost: e.target.value }))} />
            </div>
            <Input placeholder="How the value was set" value={inKind.note} onChange={(e) => setInKind((v) => ({ ...v, note: e.target.value }))} />
            <Button size="sm" disabled={!inKind.productId || !inKind.quantity || !inKind.unitCost} onClick={() => run(() => send(`/api/admin/investors/${investorId}/in-kind`, inKind), "Sent to the investor to accept")}>
              Propose value
            </Button>
          </div>
          {b.exitDue > 0 && (
            <div className="space-y-2 rounded-lg border p-3">
              <div className="font-medium">Pay an exit instalment</div>
              <p className="text-xs text-muted-foreground">Moves money SuberCraftex owes for a buy-out into the investor&apos;s free capital, which they can withdraw.</p>
              <Label>Amount (FCFA)</Label>
              <Input type="number" value={instalment} onChange={(e) => setInstalment(e.target.value)} />
              <Button size="sm" disabled={!instalment} onClick={() => run(() => send(`/api/admin/investors/${investorId}/exit-instalment`, { amount: Number(instalment) }), "Instalment paid")}>Pay</Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="font-medium">Latest movements</div>
          <div className="max-h-80 overflow-y-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Account</TableHead><TableHead>What</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Balance</TableHead></TableRow></TableHeader>
              <TableBody>
                {data.statement.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap">{new Date(r.at).toLocaleDateString()}</TableCell>
                    <TableCell>{r.account}</TableCell>
                    <TableCell>{r.description}</TableCell>
                    <TableCell className="text-right">{formatCurrency(r.amount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(r.balanceAfter)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
