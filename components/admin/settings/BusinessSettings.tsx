"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Lock } from "lucide-react";

interface Setting {
  key: string;
  label: string;
  superAdmin: boolean;
  value: any;
}

const GROUPS: { prefix: string; title: string; description: string }[] = [
  { prefix: "shipping.", title: "Delivery prices", description: "What customers pay for each delivery option, in FCFA. Web and app both use these." },
  { prefix: "checkout.", title: "Checkout", description: "How long an unpaid Mobile Money order keeps its stock." },
  { prefix: "payouts.", title: "Payouts", description: "PayWithCAMSOL charges its fee on top of every payout." },
  { prefix: "investors.", title: "Investors", description: "Rules shown to investors in their agreement. Changing them needs a new agreement version." },
  { prefix: "tax.", title: "Tax", description: "Catalogue prices already include any VAT; this only splits it out in reports." },
  { prefix: "payroll.", title: "Salaries", description: "Used to prepare the monthly pay run and turn salaries into hourly costs." },
  { prefix: "apprentices.", title: "Apprentice fees", description: "When reminders go out and when new work pauses for unpaid fees." },
];

const SHIPPING_LABELS: Record<string, string> = {
  in_store: "Shop pickup",
  standard: "Standard delivery",
  express: "Express delivery",
  overnight: "Next day delivery",
};

export function BusinessSettings({ only }: { only?: string[] }) {
  const [settings, setSettings] = useState<Setting[] | null>(null);
  const [canEditMoney, setCanEditMoney] = useState(false);
  const [draft, setDraft] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings/business")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings);
        setCanEditMoney(data.canEditMoneySettings);
        setDraft(Object.fromEntries(data.settings.map((s: Setting) => [s.key, s.value])));
      });
  }, []);

  const groups = useMemo(
    () =>
      GROUPS.filter((g) => !only || only.includes(g.prefix))
        .map((g) => ({ ...g, items: (settings ?? []).filter((s) => s.key.startsWith(g.prefix)) }))
        .filter((g) => g.items.length > 0),
    [settings, only]
  );

  const saveGroup = async (prefix: string, items: Setting[]) => {
    setSaving(prefix);
    try {
      const values = Object.fromEntries(
        items.filter((s) => !s.superAdmin || canEditMoney).map((s) => [s.key, draft[s.key]])
      );
      const res = await fetch("/api/admin/settings/business", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      toast.success("Settings saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setSaving(null);
    }
  };

  if (!settings) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">Loading settings…</CardContent>
      </Card>
    );
  }

  const field = (s: Setting) => {
    const locked = s.superAdmin && !canEditMoney;
    const value = draft[s.key];
    if (s.key === "shipping.rates") {
      return (
        <div className="grid gap-3 sm:grid-cols-2" key={s.key}>
          {Object.keys(SHIPPING_LABELS).map((k) => (
            <div key={k} className="space-y-1">
              <Label>{SHIPPING_LABELS[k]} (FCFA)</Label>
              <Input
                type="number"
                min={0}
                step={1}
                value={value?.[k] ?? 0}
                onChange={(e) => setDraft((d) => ({ ...d, [s.key]: { ...d[s.key], [k]: Number(e.target.value) } }))}
              />
            </div>
          ))}
        </div>
      );
    }
    if (s.key === "payroll.deductions") {
      const rows: any[] = value ?? [];
      const set = (i: number, k: string, v: unknown) =>
        setDraft((d) => ({ ...d, [s.key]: rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)) }));
      return (
        <div key={s.key} className="space-y-2">
          <Label className="flex items-center gap-2">{s.label} {locked && <Lock className="h-3 w-3" />}</Label>
          <p className="text-xs text-muted-foreground">Percent of gross salary, up to the monthly ceiling (0 = no ceiling). Have the accountant confirm every rate.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-muted-foreground"><th>On</th><th>Code</th><th>Name</th><th>Employee %</th><th>Employer %</th><th>Ceiling</th></tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td><Switch checked={!!r.enabled} disabled={locked} onCheckedChange={(v) => set(i, "enabled", v)} /></td>
                    <td><Input className="w-28" disabled={locked} value={r.code} onChange={(e) => set(i, "code", e.target.value)} /></td>
                    <td><Input disabled={locked} value={r.label} onChange={(e) => set(i, "label", e.target.value)} /></td>
                    <td><Input className="w-20" type="number" step="0.01" disabled={locked} value={r.employeePercent} onChange={(e) => set(i, "employeePercent", Number(e.target.value))} /></td>
                    <td><Input className="w-20" type="number" step="0.01" disabled={locked} value={r.employerPercent} onChange={(e) => set(i, "employerPercent", Number(e.target.value))} /></td>
                    <td><Input className="w-28" type="number" disabled={locked} value={r.monthlyCeiling} onChange={(e) => set(i, "monthlyCeiling", Number(e.target.value))} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!locked && (
            <Button type="button" size="sm" variant="outline" onClick={() => setDraft((d) => ({ ...d, [s.key]: [...rows, { code: "", label: "", employeePercent: 0, employerPercent: 0, monthlyCeiling: 0, enabled: false }] }))}>
              Add a contribution
            </Button>
          )}
        </div>
      );
    }
    if (s.key === "payroll.incomeTax") {
      const v = value ?? {};
      const set = (k: string, x: unknown) => setDraft((d) => ({ ...d, [s.key]: { ...d[s.key], [k]: x } }));
      const bands: any[] = v.annualBrackets ?? [];
      const setBand = (i: number, k: string, x: number) => set("annualBrackets", bands.map((b, j) => (j === i ? { ...b, [k]: x } : b)));
      const num = (k: string, label: string) => (
        <div className="space-y-1">
          <Label className="text-xs">{label}</Label>
          <Input type="number" disabled={locked} value={v[k] ?? 0} onChange={(e) => set(k, Number(e.target.value))} />
        </div>
      );
      return (
        <div key={s.key} className="space-y-3 rounded-lg border p-3">
          <div className="flex items-center justify-between gap-4">
            <Label className="flex items-center gap-2">{s.label} {locked && <Lock className="h-3 w-3" />}</Label>
            <Switch checked={!!v.enabled} disabled={locked} onCheckedChange={(x) => set("enabled", x)} />
          </div>
          <p className="text-xs text-muted-foreground">
            Taxable yearly salary = gross × (100 − professional costs)% − employee contributions − abatement. Tax by band, plus the surcharge on the tax. Off until the accountant confirms it.
          </p>
          <div className="grid gap-3 sm:grid-cols-4">
            {num("professionalCostPercent", "Professional costs %")}
            {num("annualAbatement", "Yearly abatement")}
            {num("exemptBelowMonthly", "No tax below (monthly)")}
            {num("surchargePercent", "Surcharge on tax %")}
          </div>
          <div className="space-y-1">
            {bands.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-24">Up to (yearly)</span>
                <Input className="w-36" type="number" disabled={locked || i === bands.length - 1} value={i === bands.length - 1 ? "" : b.upTo} placeholder="no limit" onChange={(e) => setBand(i, "upTo", Number(e.target.value))} />
                <Input className="w-20" type="number" step="0.5" disabled={locked} value={b.percent} onChange={(e) => setBand(i, "percent", Number(e.target.value))} />
                <span>%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (typeof value === "boolean") {
      return (
        <div key={s.key} className="flex items-center justify-between gap-4">
          <Label className="flex items-center gap-2">
            {s.label} {locked && <Lock className="h-3 w-3" />}
          </Label>
          <Switch checked={value} disabled={locked} onCheckedChange={(v) => setDraft((d) => ({ ...d, [s.key]: v }))} />
        </div>
      );
    }
    return (
      <div key={s.key} className="space-y-1">
        <Label className="flex items-center gap-2">
          {s.label} {locked && <Lock className="h-3 w-3" />}
        </Label>
        <Input
          type="number"
          disabled={locked}
          value={value ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, [s.key]: e.target.value === "" ? "" : Number(e.target.value) }))}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <Card key={group.prefix}>
          <CardHeader>
            <CardTitle>{group.title}</CardTitle>
            <CardDescription>{group.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">{group.items.map(field)}</div>
            {group.items.some((s) => s.superAdmin) && !canEditMoney && (
              <p className="text-xs text-muted-foreground">Settings with a lock can only be changed by a super admin.</p>
            )}
            <div className="flex justify-end">
              <Button onClick={() => saveGroup(group.prefix, group.items)} disabled={saving === group.prefix}>
                {saving === group.prefix ? "Saving…" : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AccountantSettings() {
  const [value, setValue] = useState({ name: "", firm: "", email: "", phone: "", notes: "" });
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings/business")
      .then((r) => r.json())
      .then((data) => {
        const found = data.settings.find((s: Setting) => s.key === "company.accountant");
        if (found) setValue(found.value);
        setLoaded(true);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings/business", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: { "company.accountant": value } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      toast.success("Accountant details saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const input = (key: keyof typeof value, label: string, type = "text") => (
    <div className="space-y-1">
      <Label htmlFor={`acct-${key}`}>{label}</Label>
      <Input id={`acct-${key}`} type={type} value={value[key]} onChange={(e) => setValue((v) => ({ ...v, [key]: e.target.value }))} />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accountant</CardTitle>
        <CardDescription>
          Who checks the books, sets payroll deduction rates (CNPS, income tax) and depreciation lives.
          Shown to admins on the payroll and machines pages.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!loaded ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {input("name", "Name")}
              {input("firm", "Firm")}
              {input("email", "Email", "email")}
              {input("phone", "Phone", "tel")}
            </div>
            <div className="space-y-1">
              <Label htmlFor="acct-notes">Notes</Label>
              <Textarea id="acct-notes" value={value.notes} onChange={(e) => setValue((v) => ({ ...v, notes: e.target.value }))} />
            </div>
            <div className="flex justify-end">
              <Button onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
