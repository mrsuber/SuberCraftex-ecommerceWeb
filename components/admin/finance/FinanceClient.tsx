"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/currency";
import { CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { PayoutsToSend } from "./PayoutsToSend";

interface Group {
  label: string;
  kind: "holds" | "owes";
  total: number;
  accounts: number;
}

interface Overview {
  groups: Group[];
  healthy: boolean;
  imbalance: number;
  drift: number;
}

interface Collection {
  id: string;
  reference: string;
  purpose: string;
  amount: number;
  phone: string;
  provider: string | null;
  status: string;
  providerReference: string | null;
  providerStatus: string | null;
  failureReason: string | null;
  uncertain: boolean;
  simulated: boolean;
  createdAt: string;
}

interface DriverRow {
  driverId: string;
  name: string;
  phone: string;
  held: number;
  lastHandover: { amount: number; createdAt: string } | null;
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  succeeded: "default",
  pending: "secondary",
  failed: "destructive",
  expired: "outline",
};

export function FinanceClient({ superAdmin }: { superAdmin: boolean }) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [drivers, setDrivers] = useState<DriverRow[]>([]);
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const [o, c, d] = await Promise.all([
      fetch("/api/admin/finance/overview").then((r) => r.json()),
      fetch("/api/admin/finance/collections").then((r) => r.json()),
      fetch("/api/admin/driver-cash").then((r) => r.json()),
    ]);
    setOverview(o);
    setCollections(Array.isArray(c) ? c : []);
    setDrivers(Array.isArray(d) ? d : []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handover = async (driver: DriverRow) => {
    const amount = Number(amounts[driver.driverId] ?? driver.held);
    if (!amount) return;
    const res = await fetch(`/api/admin/driver-cash/${driver.driverId}/handover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, into: "safe" }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Failed");
    toast.success(`${formatCurrency(amount)} received from ${driver.name}`);
    load();
  };

  const writeOff = async (driver: DriverRow) => {
    const amount = Number(amounts[driver.driverId] ?? driver.held);
    const reason = prompt(`Why is ${formatCurrency(amount)} from ${driver.name} being written off?`);
    if (!reason) return;
    const res = await fetch(`/api/admin/driver-cash/${driver.driverId}/write-off`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, reason }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Failed");
    toast.success("Written off");
    load();
  };

  const groupCard = (kind: "holds" | "owes", title: string, description: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {(overview?.groups ?? [])
              .filter((g) => g.kind === kind && (g.total !== 0 || g.accounts > 0))
              .map((g) => (
                <TableRow key={g.label}>
                  <TableCell>{g.label}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(g.total)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Finance</h1>
          <p className="text-muted-foreground">Every franc is in the ledger: where it sits, and who it belongs to.</p>
        </div>
        <Button variant="outline" onClick={load}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      {overview && (
        <div className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${overview.healthy ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>
          {overview.healthy ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {overview.healthy
            ? "The books balance: every movement adds up to zero."
            : `The books do not balance (difference ${overview.imbalance}, ${overview.drift} accounts disagree with their entries). Contact the developer.`}
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payouts">Payouts to send</TabsTrigger>
          <TabsTrigger value="payments">Mobile Money payments</TabsTrigger>
          <TabsTrigger value="drivers">Driver cash</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {groupCard("holds", "Where the money is", "PayWithCAMSOL, cash and money to recover")}
            {groupCard("owes", "Who it belongs to", "Money SuberCraftex holds for investors, customers, staff and apprentices")}
          </div>
          {superAdmin && <OpeningBalances onSaved={load} />}
        </TabsContent>

        <TabsContent value="payouts">
          <PayoutsToSend onChange={load} />
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Money payments</CardTitle>
              <CardDescription>
                The last 100. &quot;Uncertain&quot; means PayWithCAMSOL did not answer when the prompt was sent: check its dashboard for that number and time.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>For</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>PayWithCAMSOL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collections.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="whitespace-nowrap">{new Date(c.createdAt).toLocaleString()}</TableCell>
                      <TableCell className="capitalize">{c.purpose.replace("_", " ")}</TableCell>
                      <TableCell>{c.phone} {c.provider && <span className="text-xs text-muted-foreground">{c.provider}</span>}</TableCell>
                      <TableCell className="text-right">{formatCurrency(c.amount)}</TableCell>
                      <TableCell className="space-x-1">
                        <Badge variant={STATUS_VARIANT[c.status] ?? "outline"}>{c.status}</Badge>
                        {c.uncertain && <Badge variant="destructive">uncertain</Badge>}
                        {c.simulated && <Badge variant="outline">simulated</Badge>}
                        {c.failureReason && <div className="text-xs text-muted-foreground">{c.failureReason}</div>}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{c.providerReference ?? "—"} {c.providerStatus && `(${c.providerStatus})`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle>Cash held by drivers</CardTitle>
              <CardDescription>
                Cash collected on delivery stays on the driver&apos;s account until handed in. A shortage stays owed; it is never taken from salary without the driver agreeing.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead className="text-right">Holds</TableHead>
                    <TableHead>Last hand-in</TableHead>
                    <TableHead>Amount received</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers.map((d) => (
                    <TableRow key={d.driverId}>
                      <TableCell>{d.name}<div className="text-xs text-muted-foreground">{d.phone}</div></TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(d.held)}</TableCell>
                      <TableCell className="text-sm">{d.lastHandover ? `${formatCurrency(d.lastHandover.amount)} on ${new Date(d.lastHandover.createdAt).toLocaleDateString()}` : "—"}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-32"
                          disabled={d.held === 0}
                          value={amounts[d.driverId] ?? String(d.held)}
                          onChange={(e) => setAmounts((a) => ({ ...a, [d.driverId]: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell className="space-x-2 whitespace-nowrap">
                        <Button size="sm" disabled={d.held === 0} onClick={() => handover(d)}>Received</Button>
                        {superAdmin && (
                          <Button size="sm" variant="outline" disabled={d.held === 0} onClick={() => writeOff(d)}>Write off</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OpeningBalances({ onSaved }: { onSaved: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({ camsol: "", safe: "", bank: "", shop_momo: "" });
  const labels: Record<string, string> = {
    camsol: "PayWithCAMSOL live balance",
    safe: "Cash in the safe",
    bank: "Bank account",
    shop_momo: "Shop Mobile Money number",
  };
  const save = async (place: string) => {
    const res = await fetch("/api/admin/finance/opening", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ place, amount: Number(values[place] || 0) }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Failed");
    toast.success(`${labels[place]}: ${formatCurrency(data.balance)}`);
    onSaved();
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Opening balances (once)</CardTitle>
        <CardDescription>
          On the day the ledger starts, record what each place holds. From then on every movement is followed automatically.
          Each place can be recorded only once.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {Object.keys(labels).map((place) => (
          <div key={place} className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <div className="text-sm font-medium">{labels[place]}</div>
              <Input type="number" min={0} value={values[place]} onChange={(e) => setValues((v) => ({ ...v, [place]: e.target.value }))} />
            </div>
            <Button variant="outline" onClick={() => save(place)}>Record</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
