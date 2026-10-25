"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, Smartphone, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

export type PaymentPurpose = "order" | "pos_order" | "booking" | "repair" | "investor_deposit" | "apprentice_fee";

interface Collection {
  reference: string;
  status: "pending" | "succeeded" | "failed" | "expired";
  amount: number;
  phone: string;
  provider: "MTN" | "ORANGE" | null;
  failureReason: string | null;
  expiresAt: string | null;
}

interface Props {
  purpose: PaymentPurpose;
  id: string;
  /** What will be charged, for display: the server works out the real amount */
  amount: number;
  token?: string;
  defaultPhone?: string;
  /** Extra fields some purposes need (e.g. an investor deposit amount) */
  extra?: Record<string, unknown>;
  onPaid?: (collection: Collection) => void;
  /** Where the request goes; investor deposits and apprentice fees have their own endpoints */
  startUrl?: string;
  compact?: boolean;
}

const POLL_MS = 3000;

function localDigits(phone: string) {
  return phone.replace(/^237/, "").replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4");
}

export function MobileMoneyPay({ purpose, id, amount, token, defaultPhone, extra, onPaid, startUrl, compact }: Props) {
  const [phone, setPhone] = useState(defaultPhone ?? "");
  const [collection, setCollection] = useState<Collection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paidNotified = useRef(false);

  const poll = useCallback(
    async (reference: string) => {
      try {
        const res = await fetch(`/api/payments/mobile-money/${reference}`, { cache: "no-store" });
        if (res.ok) {
          const data: Collection = await res.json();
          setCollection(data);
          if (data.status === "succeeded") {
            if (!paidNotified.current) {
              paidNotified.current = true;
              onPaid?.(data);
            }
            return;
          }
          if (data.status !== "pending") return;
        }
      } catch {
        // network blip: keep polling
      }
      timer.current = setTimeout(() => poll(reference), POLL_MS);
    },
    [onPaid]
  );

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const start = async () => {
    setError(null);
    setStarting(true);
    try {
      const res = await fetch(startUrl ?? "/api/payments/mobile-money", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose, id, phone, token, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start the payment");
      setCollection(data);
      paidNotified.current = false;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => poll(data.reference), POLL_MS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start the payment");
    } finally {
      setStarting(false);
    }
  };

  if (collection?.status === "succeeded") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 flex items-start gap-3">
        <CheckCircle2 className="h-6 w-6 shrink-0" />
        <div>
          <div className="font-semibold">Payment received: {formatCurrency(collection.amount)}</div>
          <div className="text-sm">Thank you. A confirmation has been recorded.</div>
        </div>
      </div>
    );
  }

  if (collection?.status === "pending") {
    return (
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Loader2 className="h-6 w-6 shrink-0 animate-spin text-primary" />
          <div className="space-y-1">
            <div className="font-semibold">Approve the payment on your phone</div>
            <div className="text-sm text-muted-foreground">
              A request for {formatCurrency(collection.amount)} was sent to {localDigits(collection.phone)}
              {collection.provider ? ` (${collection.provider === "MTN" ? "MTN Mobile Money" : "Orange Money"})` : ""}.
              Enter your PIN to approve it. This page updates by itself.
            </div>
            <div className="text-xs text-muted-foreground">
              No prompt? Dial {collection.provider === "ORANGE" ? "#150*50#" : "*126#"} to see payments waiting for approval.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {collection && (collection.status === "failed" || collection.status === "expired") && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 flex gap-2">
          <XCircle className="h-5 w-5 shrink-0" />
          <span>
            {collection.status === "expired"
              ? "The payment was not approved in time. You can try again."
              : collection.failureReason || "The payment did not go through. You can try again."}
          </span>
        </div>
      )}
      <div className="space-y-1">
        <Label htmlFor={`momo-${id}`}>Mobile Money number</Label>
        <Input
          id={`momo-${id}`}
          type="tel"
          inputMode="tel"
          placeholder="6XX XX XX XX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">MTN Mobile Money or Orange Money. SuberCraftex charges no fee.</p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button onClick={start} disabled={starting || phone.replace(/\D/g, "").length < 9} className="w-full" size={compact ? "default" : "lg"}>
        {starting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Smartphone className="mr-2 h-4 w-4" />}
        Pay {formatCurrency(amount)} with Mobile Money
      </Button>
    </div>
  );
}
