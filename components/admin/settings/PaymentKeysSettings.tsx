"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, KeyRound, ShieldCheck, ShieldAlert, Trash2 } from "lucide-react";

type Field = "secretKey" | "payoutKeyId" | "payoutSecret" | "webhookSecret";

interface Status {
  source: "settings" | "environment" | "simulated" | "none";
  environment: "test" | "live" | null;
  canCollect: boolean;
  canPayOut: boolean;
  verifiesWebhooks: boolean;
  baseUrl: string;
  webhookUrl: string;
  saved: Record<Field, string | null>;
  updatedAt: string | null;
}

const FIELDS: { key: Field; label: string; placeholder: string; help: string }[] = [
  { key: "secretKey", label: "Secret key", placeholder: "sk_live_…", help: "Used to collect Mobile Money payments" },
  { key: "payoutKeyId", label: "Payout key ID", placeholder: "pok_…", help: "Used to send payouts (withdrawals, salaries)" },
  { key: "payoutSecret", label: "Payout secret", placeholder: "psk_…", help: "Signs payout requests" },
  { key: "webhookSecret", label: "Webhook secret", placeholder: "whsec_…", help: "Checks that notifications really come from PayWithCAMSOL" },
];

const SOURCE_TEXT: Record<Status["source"], string> = {
  settings: "Keys saved on this page",
  environment: "Keys from the server's CAMSOL_* variables",
  simulated: "Simulated payments (development only): no money moves",
  none: "Not set up: Mobile Money payments are refused",
};

const CHECK_TEXT: Record<string, string> = {
  ok: "accepted",
  refused: "refused (401/403): check the key",
  unreachable: "PayWithCAMSOL could not be reached",
  missing: "not set",
};

export function PaymentKeysSettings({ canEdit }: { canEdit: boolean }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [values, setValues] = useState<Record<Field, string>>({ secretKey: "", payoutKeyId: "", payoutSecret: "", webhookSecret: "" });
  const [baseUrl, setBaseUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [check, setCheck] = useState<{ collections: string; payouts: string } | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/settings/payments");
    if (res.ok) {
      const data: Status = await res.json();
      setStatus(data);
      setBaseUrl(data.baseUrl);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, baseUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setStatus(data);
      setValues({ secretKey: "", payoutKeyId: "", payoutSecret: "", webhookSecret: "" });
      setCheck(null);
      toast.success("Payment keys saved. They are in use now.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm("Remove the saved PayWithCAMSOL keys? Mobile Money payments will stop until new keys are saved.")) return;
    const res = await fetch("/api/admin/settings/payments", { method: "DELETE" });
    if (res.ok) {
      setStatus(await res.json());
      toast.success("Saved keys removed");
    } else toast.error((await res.json()).error || "Failed to remove");
  };

  const test = async () => {
    setTesting(true);
    try {
      const res = await fetch("/api/admin/settings/payments/test", { method: "POST" });
      setCheck(await res.json());
    } finally {
      setTesting(false);
    }
  };

  if (!status) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">Loading payment settings…</CardContent>
      </Card>
    );
  }

  const Flag = ({ on, label }: { on: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {on ? <ShieldCheck className="h-4 w-4 text-green-600" /> : <ShieldAlert className="h-4 w-4 text-amber-600" />}
      <span>{label}: {on ? "on" : "off"}</span>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          PayWithCAMSOL (Mobile Money)
        </CardTitle>
        <CardDescription>
          Keys from your PayWithCAMSOL dashboard. They are stored encrypted and never shown again:
          only the last 4 characters appear here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{SOURCE_TEXT[status.source]}</span>
            {status.environment && (
              <Badge variant={status.environment === "live" ? "default" : "secondary"}>
                {status.environment === "live" ? "LIVE: real money" : "TEST mode"}
              </Badge>
            )}
          </div>
          <div className="grid gap-1 sm:grid-cols-3">
            <Flag on={status.canCollect} label="Collect payments" />
            <Flag on={status.canPayOut} label="Send payouts" />
            <Flag on={status.verifiesWebhooks} label="Check webhooks" />
          </div>
          {status.updatedAt && (
            <p className="text-xs text-muted-foreground">Last saved {new Date(status.updatedAt).toLocaleString()}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Webhook address to paste in the PayWithCAMSOL dashboard</Label>
          <div className="flex gap-2">
            <Input readOnly value={status.webhookUrl} className="font-mono text-sm" />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(status.webhookUrl);
                toast.success("Copied");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {/localhost|127\.0\.0\.1/.test(status.webhookUrl) && (
            <p className="text-sm text-amber-700">
              This address is not public. PayWithCAMSOL can never reach localhost; set NEXT_PUBLIC_APP_URL to the site&apos;s public HTTPS address.
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {FIELDS.map((field) => (
            <div key={field.key} className="space-y-1">
              <Label htmlFor={field.key}>
                {field.label}
                {status.saved[field.key] && (
                  <span className="ml-2 font-mono text-xs text-muted-foreground">saved: {status.saved[field.key]}</span>
                )}
              </Label>
              <Input
                id={field.key}
                type="password"
                autoComplete="off"
                disabled={!canEdit}
                placeholder={status.saved[field.key] ? "Leave empty to keep the saved key" : field.placeholder}
                value={values[field.key]}
                onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">{field.help}</p>
            </div>
          ))}
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="baseUrl">API address</Label>
            <Input id="baseUrl" disabled={!canEdit} value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
          </div>
        </div>

        {check && (
          <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-1">
            <div>Collections key: {CHECK_TEXT[check.collections] ?? check.collections}</div>
            <div>Payout keys: {CHECK_TEXT[check.payouts] ?? check.payouts}</div>
            <div className="text-xs text-muted-foreground">Nothing was charged or sent by this check.</div>
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-2">
          <Button type="button" variant="outline" onClick={test} disabled={testing}>
            {testing ? "Testing…" : "Test keys"}
          </Button>
          {canEdit ? (
            <div className="flex gap-2">
              {status.source === "settings" && (
                <Button type="button" variant="outline" onClick={remove}>
                  <Trash2 className="mr-2 h-4 w-4" /> Remove keys
                </Button>
              )}
              <Button type="button" onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save keys"}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Only a super admin can change payment keys.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
