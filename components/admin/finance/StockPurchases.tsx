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

interface Product {
  id: string;
  name: string;
  variants: { id: string; name: string }[];
}

async function send(url: string, body?: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body ?? {}) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed");
  return data;
}

const STATUS: Record<string, string> = { waiting_payout: "money being sent", open: "at the market", received: "received", cancelled: "cancelled" };
const SOURCES: [string, string][] = [
  ["safe", "Cash from the safe"],
  ["bank", "From the bank"],
  ["shop_momo", "From the shop's own Mobile Money"],
  ["camsol", "Send from PayWithCAMSOL to the buyer's phone"],
];

/** Restocking with investors' money: start a purchase, then record what was bought. */
export function StockPurchases({ onChange }: { onChange: () => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [starting, setStarting] = useState(false);
  const [receiving, setReceiving] = useState<string | null>(null);
  const load = useCallback(() => fetch("/api/admin/purchases").then((r) => r.json()).then((d) => setRows(Array.isArray(d) ? d : [])), []);
  useEffect(() => {
    load();
    fetch("/api/admin/purchases/products").then((r) => r.json()).then((d) => setProducts(Array.isArray(d) ? d : []));
  }, [load]);
  const refresh = () => {
    load();
    onChange();
  };

  const cancel = async (p: any) => {
    let returnedTo: string | null = null;
    if (p.status === "open") {
      returnedTo = prompt(`Cancel ${p.number}? Nothing was bought. Where was the ${p.amount} FCFA put back? Type safe, bank or shop_momo.`, p.source === "camsol" ? "safe" : p.source);
      if (!returnedTo) return;
    } else if (!confirm(`Cancel ${p.number}? The payout is stopped if it has not been sent.`)) return;
    try {
      await send(`/api/admin/purchases/${p.id}/cancel`, { returnedTo });
      toast.success("Cancelled: investors' capital is free again");
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Restocking with investors&apos; money</CardTitle>
          <CardDescription>
            Take money to the market, funded by investors&apos; free capital (by default in proportion to what each has free) and, if needed, SuberCraftex&apos;s own money.
            Their parts are reserved at once. When the buyer is back, record what was bought: the goods go into stock and each funder gets their share of every line
            at the real cost, transport included. Change and anything not spent go back. Investors see every line and the receipts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {starting ? <StartForm onDone={() => { setStarting(false); refresh(); }} onClose={() => setStarting(false)} /> : <Button onClick={() => setStarting(true)}>Start a purchase</Button>}
        </CardContent>
      </Card>

      {receiving && (
        <ReceiveForm
          purchase={rows.find((r) => r.id === receiving)}
          products={products}
          onClose={() => setReceiving(null)}
          onDone={() => { setReceiving(null); refresh(); }}
        />
      )}

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purchase</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Funded by</TableHead>
                <TableHead className="text-right">Taken</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="whitespace-nowrap">{p.number}<div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</div></TableCell>
                  <TableCell>{p.buyerName}<div className="text-xs text-muted-foreground">{SOURCES.find((s) => s[0] === p.source)?.[1]}</div></TableCell>
                  <TableCell className="text-xs">
                    {p.fundings.map((f: any) => <div key={f.id}>{f.investor?.investorNumber ?? "Investor"}: {formatCurrency(f.amount)}{f.used !== null && ` (in goods ${formatCurrency(f.used)}, back ${formatCurrency(f.returned)})`}</div>)}
                    {p.companyAmount > 0 && <div>SuberCraftex: {formatCurrency(p.companyAmount)}</div>}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(p.amount)}</TableCell>
                  <TableCell className="text-right">{p.spent !== null ? formatCurrency(p.spent) : "—"}{p.changeReturned > 0 && <div className="text-xs text-muted-foreground">change {formatCurrency(p.changeReturned)}</div>}</TableCell>
                  <TableCell><Badge variant={p.status === "received" ? "default" : "secondary"}>{STATUS[p.status]}</Badge></TableCell>
                  <TableCell className="space-x-2 whitespace-nowrap">
                    {p.status === "open" && <Button size="sm" onClick={() => setReceiving(p.id)}>Record what was bought</Button>}
                    {["open", "waiting_payout"].includes(p.status) && <Button size="sm" variant="outline" onClick={() => cancel(p)}>Cancel</Button>}
                    {p.status === "received" && p.lines.length > 0 && <span className="text-xs text-muted-foreground">{p.lines.map((l: any) => `${l.quantity} × ${l.productName} @ ${l.unitCost}`).join(", ")}</span>}
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

function StartForm({ onDone, onClose }: { onDone: () => void; onClose: () => void }) {
  const [target, setTarget] = useState("");
  const [split, setSplit] = useState<any>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [company, setCompany] = useState("0");
  const [source, setSource] = useState("safe");
  const [buyer, setBuyer] = useState({ name: "", phone: "" });
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const share = async () => {
    const out = await fetch(`/api/admin/purchases/split?amount=${Math.floor(Number(target) || 0)}`).then((r) => r.json());
    setSplit(out);
    setAmounts(Object.fromEntries(out.investors.map((i: any) => [i.investorId, String(i.amount)])));
    setCompany(String(out.fromCompany));
  };
  const fromInvestors = Object.values(amounts).reduce((s, v) => s + (Number(v) || 0), 0);
  const total = fromInvestors + (Number(company) || 0);

  const start = async () => {
    if (!confirm(`Take ${total} FCFA to the market (${fromInvestors} from investors, ${Number(company) || 0} from SuberCraftex)? Investors' parts are reserved now.`)) return;
    setBusy(true);
    try {
      const out = await send("/api/admin/purchases", {
        source,
        buyerName: buyer.name,
        buyerPhone: buyer.phone || null,
        fundings: Object.entries(amounts).map(([investorId, amount]) => ({ investorId, amount: Number(amount) || 0 })),
        companyAmount: Number(company) || 0,
        notes,
      });
      toast.success(source === "camsol" ? `${out.number} started: approve the payout in "Payouts to send"` : `${out.number} started`);
      onDone();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex flex-wrap items-end gap-2">
        <div className="space-y-1">
          <Label>How much should investors fund? (FCFA)</Label>
          <Input type="number" min={0} value={target} onChange={(e) => setTarget(e.target.value)} />
        </div>
        <Button variant="outline" disabled={!target} onClick={share}>Share by free capital</Button>
      </div>
      {split && (
        <>
          <p className="text-sm text-muted-foreground">Investors have {formatCurrency(split.totalFree)} of free capital in total. You can change any amount.</p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Investor</TableHead><TableHead className="text-right">Free capital</TableHead><TableHead className="text-right">Takes part with</TableHead></TableRow></TableHeader>
              <TableBody>
                {split.investors.map((i: any) => (
                  <TableRow key={i.investorId}>
                    <TableCell>{i.investorNumber}<div className="text-xs text-muted-foreground">{i.fullName}</div></TableCell>
                    <TableCell className="text-right">{formatCurrency(i.free)}</TableCell>
                    <TableCell className="text-right">
                      <Input className="ml-auto w-32 text-right" type="number" min={0} max={i.free} value={amounts[i.investorId] ?? "0"} onChange={(e) => setAmounts((a) => ({ ...a, [i.investorId]: e.target.value }))} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1"><Label>SuberCraftex&apos;s own money (FCFA)</Label><Input type="number" min={0} value={company} onChange={(e) => setCompany(e.target.value)} /></div>
            <div className="space-y-1">
              <Label>The money comes from</Label>
              <select className="w-full rounded-md border px-3 py-2 text-sm" value={source} onChange={(e) => setSource(e.target.value)}>
                {SOURCES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-1"><Label>Who goes to the market</Label><Input value={buyer.name} onChange={(e) => setBuyer((b) => ({ ...b, name: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Their Mobile Money number{source === "camsol" ? "" : " (optional)"}</Label><Input value={buyer.phone} onChange={(e) => setBuyer((b) => ({ ...b, phone: e.target.value }))} /></div>
          </div>
          <div className="space-y-1"><Label>What it is for (optional)</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. sandals and threads at Marché Central" /></div>
          <div className="flex items-center gap-3">
            <Button disabled={busy || total <= 0 || !buyer.name} onClick={start}>Start: take {formatCurrency(total)} to the market</Button>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>
        </>
      )}
    </div>
  );
}

function ReceiveForm({ purchase, products, onClose, onDone }: { purchase: any; products: Product[]; onClose: () => void; onDone: () => void }) {
  const [lines, setLines] = useState([{ productId: "", variantId: "", quantity: "", lineTotal: "" }]);
  const [transport, setTransport] = useState("0");
  const [changeInto, setChangeInto] = useState(purchase?.source === "camsol" ? "safe" : purchase?.source ?? "safe");
  const [receipts, setReceipts] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  if (!purchase) return null;

  const goods = lines.reduce((s, l) => s + (Number(l.lineTotal) || 0), 0);
  const spent = goods + (Number(transport) || 0);
  const change = purchase.amount - spent;
  const set = (i: number, k: string, v: string) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, [k]: v, ...(k === "productId" ? { variantId: "" } : {}) } : l)));

  const upload = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    form.append("type", "purchase-receipt");
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Upload failed");
    setReceipts((r) => [...r, data.url]);
  };

  const save = async () => {
    if (!confirm(`Record ${goods} FCFA of goods + ${Number(transport) || 0} transport${change > 0 ? `, ${change} FCFA change back to ${changeInto}` : ""}? Stock goes up and each funder gets their lots. This cannot be undone.`)) return;
    setBusy(true);
    try {
      await send(`/api/admin/purchases/${purchase.id}/receive`, {
        lines: lines.filter((l) => l.productId).map((l) => ({ productId: l.productId, variantId: l.variantId || null, quantity: Number(l.quantity), lineTotal: Number(l.lineTotal) })),
        transport: Number(transport) || 0,
        changeInto,
        receiptUrls: receipts,
        note,
      });
      toast.success(`${purchase.number} recorded: stock and investors updated`);
      onDone();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle>What was bought on {purchase.number}</CardTitle>
        <CardDescription>{purchase.buyerName} took {formatCurrency(purchase.amount)}. Enter each product, how many, and what the market charged for the whole line.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {lines.map((l, i) => {
          const product = products.find((p) => p.id === l.productId);
          return (
            <div key={i} className="grid gap-2 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]">
              <select className="rounded-md border px-3 py-2 text-sm" value={l.productId} onChange={(e) => set(i, "productId", e.target.value)}>
                <option value="">Product…</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select className="rounded-md border px-3 py-2 text-sm" disabled={!product?.variants.length} value={l.variantId} onChange={(e) => set(i, "variantId", e.target.value)}>
                <option value="">{product?.variants.length ? "Variant…" : "No variants"}</option>
                {product?.variants.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
              <Input type="number" min={1} placeholder="Quantity" value={l.quantity} onChange={(e) => set(i, "quantity", e.target.value)} />
              <Input type="number" min={1} placeholder="Paid for the line" value={l.lineTotal} onChange={(e) => set(i, "lineTotal", e.target.value)} />
              <Button variant="ghost" size="sm" onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))} disabled={lines.length === 1}>Remove</Button>
            </div>
          );
        })}
        <Button variant="outline" size="sm" onClick={() => setLines((ls) => [...ls, { productId: "", variantId: "", quantity: "", lineTotal: "" }])}>Add a line</Button>
        <p className="text-xs text-muted-foreground">A product not in the catalogue yet? Create it in Products first (stock 0), then come back.</p>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1"><Label>Transport and market costs (FCFA)</Label><Input type="number" min={0} value={transport} onChange={(e) => setTransport(e.target.value)} /></div>
          <div className="space-y-1">
            <Label>Change was put in</Label>
            <select className="w-full rounded-md border px-3 py-2 text-sm" value={changeInto} onChange={(e) => setChangeInto(e.target.value)}>
              <option value="safe">The safe</option>
              <option value="bank">The bank</option>
              <option value="shop_momo">The shop&apos;s Mobile Money</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label>Receipts (photos)</Label>
            <Input type="file" accept="image/*,application/pdf" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            {receipts.length > 0 && <p className="text-xs text-muted-foreground">{receipts.length} receipt(s) attached</p>}
          </div>
        </div>
        <div className="space-y-1"><Label>Note (optional)</Label><Input value={note} onChange={(e) => setNote(e.target.value)} /></div>

        <div className={`rounded-md p-3 text-sm ${change < 0 ? "bg-destructive/10 text-destructive" : "bg-muted"}`}>
          Goods {formatCurrency(goods)} + transport {formatCurrency(Number(transport) || 0)} = spent {formatCurrency(spent)} of {formatCurrency(purchase.amount)}.{" "}
          {change < 0 ? "More than was taken: check the prices." : `Change back: ${formatCurrency(change)}.`}
        </div>
        <div className="flex gap-2">
          <Button disabled={busy || change < 0 || !lines.some((l) => l.productId && Number(l.quantity) > 0 && Number(l.lineTotal) > 0)} onClick={save}>Record purchase</Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </CardContent>
    </Card>
  );
}
