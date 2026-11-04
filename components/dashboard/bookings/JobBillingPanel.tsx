"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Banknote,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  MessageCircle,
  Play,
  Plus,
  Smartphone,
  Trash2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/currency";

type LineKind = "labour" | "material" | "part" | "travel" | "fee" | "other";
interface Line {
  kind: LineKind;
  description: string;
  quantity: string;
  unitPrice: string;
}
interface InvoiceData {
  id: string;
  number: string | null;
  status: "draft" | "issued" | "void";
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  subtotal: number;
  discount: number;
  total: number;
  notes: string | null;
  dueDate: string | null;
  issuedAt: string | null;
  sentAt: string | null;
  paidAt: string | null;
  voidReason: string | null;
  lines: { kind: LineKind; description: string; quantity: number; unitPrice: number; amount: number }[];
  summary: { total: number; paid: number; balance: number; credit: number } | null;
  link?: string;
}
interface Payment {
  id: string;
  amount: number;
  paymentType: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const KINDS: { value: LineKind; label: string }[] = [
  { value: "labour", label: "Labour" },
  { value: "part", label: "Part" },
  { value: "material", label: "Material" },
  { value: "travel", label: "Travel" },
  { value: "fee", label: "Fee" },
  { value: "other", label: "Other" },
];

const STATUS_TEXT: Record<string, string> = {
  pending: "Booked",
  quote_pending: "Waiting for quote",
  quote_sent: "Quote sent",
  quote_approved: "Quote approved",
  quote_rejected: "Quote declined",
  awaiting_payment: "Awaiting payment",
  payment_partial: "Part paid",
  confirmed: "Confirmed",
  in_progress: "Work in progress",
  awaiting_collection: "Ready for collection",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No show",
  rescheduled: "Rescheduled",
};

const fcfa = (n: number) => formatCurrency(n);

/** quantity × unit price, rounded like the server (half up, whole francs) */
function amountOf(line: Line): number | null {
  const q = Number(line.quantity);
  const u = Number(line.unitPrice);
  if (!line.quantity || !line.unitPrice || !isFinite(q) || !isFinite(u) || q <= 0 || u < 0) return null;
  return Math.round(Math.round(q * 100) * u / 100);
}

async function call(url: string, init?: RequestInit) {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

export interface JobBillingPanelProps {
  bookingId: string;
  bookingNumber: string;
  status: string;
  serviceType: string;
  customerPhone: string | null;
  isAdmin: boolean;
}

/**
 * Everything staff do once a job is agreed: move the work along, write and issue the
 * invoice, and take the money (cash at the shop or a Mobile Money prompt to the customer).
 */
export function JobBillingPanel({ bookingId, bookingNumber, status, serviceType, customerPhone, isAdmin }: JobBillingPanelProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [voided, setVoided] = useState<InvoiceData[]>([]);
  const [balance, setBalance] = useState({ total: 0, paid: 0, remaining: 0 });
  const [payments, setPayments] = useState<Payment[]>([]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    lines: [] as Line[],
    discount: "",
    notes: "",
    dueDate: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
  });
  const [sendEmail, setSendEmail] = useState(true);
  const [cash, setCash] = useState("");
  const [momoPhone, setMomoPhone] = useState(customerPhone ?? "");
  const [momoRef, setMomoRef] = useState<string | null>(null);
  const [voidReason, setVoidReason] = useState("");
  const [showVoid, setShowVoid] = useState(false);

  const load = useCallback(async () => {
    try {
      const [inv, pays] = await Promise.all([call(`/api/bookings/${bookingId}/invoice`), call(`/api/bookings/${bookingId}/payments`)]);
      setInvoice(inv.invoice);
      setVoided(inv.voided ?? []);
      setBalance(inv.balance);
      setPayments(pays);
      const base = inv.invoice;
      const lines: Line[] = base
        ? base.lines.map((l: InvoiceData["lines"][number]) => ({ kind: l.kind, description: l.description, quantity: String(l.quantity), unitPrice: String(l.unitPrice) }))
        : (inv.suggestedLines ?? []).map((l: any) => ({ kind: l.kind ?? "other", description: l.description, quantity: String(l.quantity), unitPrice: String(l.unitPrice) }));
      setDraft({
        lines,
        discount: base?.discount ? String(base.discount) : "",
        notes: base?.notes ?? "",
        dueDate: base?.dueDate ?? "",
        customerName: base?.customerName ?? inv.customerDefaults?.name ?? "",
        customerPhone: base?.customerPhone ?? inv.customerDefaults?.phone ?? "",
        customerEmail: base?.customerEmail ?? inv.customerDefaults?.email ?? "",
        customerAddress: base?.customerAddress ?? inv.customerDefaults?.address ?? "",
      });
      // Suggest the amount due, but never overwrite what staff are typing
      setCash((typed) => (typed.trim() ? typed : String(inv.balance?.remaining || "")));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load billing");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    load();
  }, [load]);

  // Follow a Mobile Money prompt until the customer approves or declines it
  useEffect(() => {
    if (!momoRef) return;
    let stop = false;
    const tick = async () => {
      try {
        const c = await call(`/api/payments/mobile-money/${momoRef}`);
        if (c.status === "succeeded") {
          toast.success("Mobile Money payment received");
          setMomoRef(null);
          await load();
          router.refresh();
          return;
        }
        if (c.status === "failed" || c.status === "expired") {
          toast.error(c.failureReason || "The customer did not approve the payment");
          setMomoRef(null);
          return;
        }
      } catch {
        /* keep trying */
      }
      if (!stop) setTimeout(tick, 4000);
    };
    const t = setTimeout(tick, 4000);
    return () => {
      stop = true;
      clearTimeout(t);
    };
  }, [momoRef, load, router]);

  const subtotal = useMemo(() => draft.lines.reduce((s, l) => s + (amountOf(l) ?? 0), 0), [draft.lines]);
  const discount = Number(draft.discount || 0);
  const total = Math.max(0, subtotal - discount);

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    try {
      await fn();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  };

  const moveTo = (next: string, confirmText?: string) =>
    run(`status-${next}`, async () => {
      if (confirmText && !window.confirm(confirmText)) return;
      await call(`/api/bookings/${bookingId}`, { method: "PATCH", body: JSON.stringify({ status: next }) });
      toast.success(`Job marked: ${STATUS_TEXT[next]}`);
      router.refresh();
    });

  const saveDraft = () =>
    run("save", async () => {
      await call(`/api/bookings/${bookingId}/invoice`, {
        method: "PUT",
        body: JSON.stringify({
          lines: draft.lines.map((l) => ({ ...l, quantity: l.quantity.trim(), unitPrice: l.unitPrice.trim() })),
          discount: draft.discount || 0,
          notes: draft.notes,
          dueDate: draft.dueDate || null,
          customerName: draft.customerName || undefined,
          customerPhone: draft.customerPhone,
          customerEmail: draft.customerEmail,
          customerAddress: draft.customerAddress,
        }),
      });
      toast.success("Invoice draft saved");
      setEditing(false);
      await load();
    });

  const issue = () =>
    run("issue", async () => {
      if (!window.confirm(`Issue this invoice for ${fcfa(invoice?.total ?? total)}? Once issued it gets its number and can no longer be edited.`)) return;
      const data = await call(`/api/bookings/${bookingId}/invoice/issue`, { method: "POST", body: JSON.stringify({ send: sendEmail }) });
      toast.success(
        `Invoice ${data.invoice.number} issued${data.emailed ? " and emailed" : sendEmail ? " — no email sent (no address); share the link instead" : ""}`,
      );
      await load();
      router.refresh();
    });

  const resend = () =>
    run("send", async () => {
      await call(`/api/bookings/${bookingId}/invoice/send`, { method: "POST" });
      toast.success("Invoice emailed again");
      await load();
    });

  const voidIt = () =>
    run("void", async () => {
      await call(`/api/bookings/${bookingId}/invoice/void`, { method: "POST", body: JSON.stringify({ reason: voidReason }) });
      toast.success(invoice?.status === "draft" ? "Draft discarded" : "Invoice voided — prepare the corrected one");
      setShowVoid(false);
      setVoidReason("");
      await load();
      router.refresh();
    });

  const takeCash = () =>
    run("cash", async () => {
      const amount = cash.trim();
      if (!/^\d+$/.test(amount) || Number(amount) <= 0) throw new Error("Enter the amount received, in FCFA");
      if (!window.confirm(`Record ${fcfa(Number(amount))} received in cash?`)) return;
      await call(`/api/bookings/${bookingId}/payments`, { method: "POST", body: JSON.stringify({ amount }) });
      toast.success("Cash payment recorded");
      setCash("");
      await load();
      router.refresh();
    });

  const askMomo = () =>
    run("momo", async () => {
      if (!momoPhone.trim()) throw new Error("Enter the customer's Mobile Money number");
      const c = await call(`/api/payments/mobile-money`, {
        method: "POST",
        body: JSON.stringify({ purpose: "booking", id: bookingId, phone: momoPhone.trim() }),
      });
      setMomoRef(c.reference);
      toast.success(`Prompt for ${fcfa(c.amount)} sent to ${c.phone}. Ask the customer to approve it on their phone.`);
    });

  const copyLink = async () => {
    if (!invoice?.link) return;
    await navigator.clipboard.writeText(invoice.link);
    toast.success("Invoice link copied");
  };

  const whatsapp = () => {
    if (!invoice?.link || !invoice.summary) return;
    const phone = (invoice.customerPhone ?? "").replace(/[^\d]/g, "");
    const intl = phone.length === 9 ? `237${phone}` : phone;
    const text = `Hello ${invoice.customerName}, here is your SuberCraftex invoice ${invoice.number} (${fcfa(invoice.summary.total)}). Balance due: ${fcfa(invoice.summary.balance)}. ${invoice.link}`;
    window.open(`https://wa.me/${intl}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  const finished = ["completed", "cancelled", "no_show"].includes(status);
  const canWork = !["cancelled", "no_show", "completed"].includes(status) && !["quote_pending", "quote_sent", "quote_rejected"].includes(status);
  const showDraftEditor = editing || (invoice?.status === "draft" && editing);
  const setLine = (i: number, patch: Partial<Line>) => setDraft((d) => ({ ...d, lines: d.lines.map((l, j) => (j === i ? { ...l, ...patch } : l)) }));

  return (
    <Card id="billing" className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          <FileText className="h-5 w-5" /> Job &amp; billing
          <Badge variant="secondary">{STATUS_TEXT[status] ?? status}</Badge>
        </CardTitle>
        <CardDescription>Move the work along, invoice what was done, and take payment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* ------------------------------------------------ 1. the work */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">1 · The work</h3>
          <div className="flex flex-wrap gap-2">
            {canWork && status !== "in_progress" && (
              <Button size="sm" variant="outline" disabled={!!busy} onClick={() => moveTo("in_progress")}>
                <Play className="mr-1 h-4 w-4" /> Start work
              </Button>
            )}
            {canWork && serviceType !== "onsite" && status !== "awaiting_collection" && (
              <Button size="sm" variant="outline" disabled={!!busy} onClick={() => moveTo("awaiting_collection")}>
                Ready for collection
              </Button>
            )}
            {canWork && (
              <Button size="sm" disabled={!!busy} onClick={() => moveTo("completed")}>
                <CheckCircle2 className="mr-1 h-4 w-4" /> Work done
              </Button>
            )}
            {!finished && (
              <>
                <Button size="sm" variant="ghost" disabled={!!busy} onClick={() => moveTo("no_show", "Mark that the customer was not there?")}>
                  No show
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  disabled={!!busy}
                  onClick={() => moveTo("cancelled", "Cancel this job? The customer is told by email if they have one.")}
                >
                  <XCircle className="mr-1 h-4 w-4" /> Cancel job
                </Button>
              </>
            )}
            {status === "completed" && isAdmin && (
              <Button size="sm" variant="ghost" disabled={!!busy} onClick={() => moveTo("in_progress", "Reopen this job (it was marked done by mistake)?")}>
                Reopen
              </Button>
            )}
          </div>
          {["quote_pending", "quote_sent"].includes(status) && (
            <p className="text-sm text-muted-foreground">
              This job is waiting on a quote. You can still invoice directly if the price was agreed in person.
            </p>
          )}
        </section>

        {/* ------------------------------------------------ 2. the invoice */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">2 · Invoice</h3>
          {loading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </p>
          ) : status === "cancelled" && !invoice ? (
            <p className="text-sm text-muted-foreground">Cancelled jobs are not invoiced.</p>
          ) : invoice?.status === "issued" ? (
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="font-mono text-lg font-semibold">{invoice.number}</div>
                  <div className="text-xs text-muted-foreground">
                    Issued {invoice.issuedAt ? new Date(invoice.issuedAt).toLocaleDateString("en-GB") : ""}
                    {invoice.sentAt ? ` · emailed ${new Date(invoice.sentAt).toLocaleDateString("en-GB")}` : " · not emailed"}
                  </div>
                </div>
                {invoice.summary && invoice.summary.balance === 0 ? (
                  <Badge className="bg-emerald-600">Paid</Badge>
                ) : (
                  <Badge variant="outline">Balance {fcfa(invoice.summary?.balance ?? 0)}</Badge>
                )}
              </div>
              <dl className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Total</dt>
                  <dd className="font-semibold">{fcfa(invoice.total)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Paid</dt>
                  <dd className="font-semibold">{fcfa(invoice.summary?.paid ?? 0)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Due</dt>
                  <dd className="font-semibold">{fcfa(invoice.summary?.balance ?? 0)}</dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" asChild>
                  <a href={`/invoices/${invoice.id}`} target="_blank" rel="noopener">
                    <ExternalLink className="mr-1 h-4 w-4" /> Open / print
                  </a>
                </Button>
                <Button size="sm" variant="outline" onClick={copyLink}>
                  <Copy className="mr-1 h-4 w-4" /> Copy link
                </Button>
                {invoice.customerPhone && (
                  <Button size="sm" variant="outline" onClick={whatsapp}>
                    <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp
                  </Button>
                )}
                {invoice.customerEmail && (
                  <Button size="sm" variant="outline" disabled={!!busy} onClick={resend}>
                    <Mail className="mr-1 h-4 w-4" /> Email again
                  </Button>
                )}
                {isAdmin && (
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setShowVoid((v) => !v)}>
                    Void…
                  </Button>
                )}
              </div>
              {showVoid && (
                <div className="space-y-2 rounded-md bg-destructive/5 p-3">
                  <Label htmlFor="void-reason">Why is this invoice wrong?</Label>
                  <Input id="void-reason" value={voidReason} onChange={(e) => setVoidReason(e.target.value)} placeholder="e.g. Second lock was not replaced" />
                  <p className="text-xs text-muted-foreground">
                    The number {invoice.number} stays used (invoice numbers never get reused). Payments stay on the job and count towards the corrected invoice.
                  </p>
                  <Button size="sm" variant="destructive" disabled={!!busy || voidReason.trim().length < 3} onClick={voidIt}>
                    Void invoice
                  </Button>
                </div>
              )}
            </div>
          ) : invoice?.status === "draft" && !editing ? (
            <div className="space-y-3 rounded-lg border border-dashed p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="font-medium">Draft invoice · {fcfa(invoice.total)}</div>
                  <div className="text-xs text-muted-foreground">{invoice.lines.length} line(s). Not visible to the customer until issued.</div>
                </div>
                <Badge variant="outline">Draft</Badge>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
                Email it to the customer {invoice.customerEmail ? `(${invoice.customerEmail})` : "(no email on file)"}
              </label>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" disabled={!!busy} onClick={issue}>
                  {busy === "issue" ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-1 h-4 w-4" />} Issue invoice
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                  Edit
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={`/invoices/${invoice.id}`} target="_blank" rel="noopener">
                    Preview
                  </a>
                </Button>
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    disabled={!!busy}
                    onClick={() => {
                      if (window.confirm("Discard this draft?")) {
                        setVoidReason("draft discarded");
                        run("void", async () => {
                          await call(`/api/bookings/${bookingId}/invoice/void`, { method: "POST", body: JSON.stringify({ reason: "draft discarded" }) });
                          toast.success("Draft discarded");
                          await load();
                        });
                      }
                    }}
                  >
                    Discard
                  </Button>
                )}
              </div>
            </div>
          ) : !showDraftEditor ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed p-4">
              <p className="text-sm text-muted-foreground">
                {status === "completed" ? "The work is done. Write the invoice: labour, parts, travel…" : "No invoice yet. You can prepare it now or when the work is done."}
              </p>
              <Button size="sm" onClick={() => setEditing(true)}>
                <Plus className="mr-1 h-4 w-4" /> Prepare invoice
              </Button>
            </div>
          ) : null}

          {showDraftEditor && (
            <div className="space-y-4 rounded-lg border p-4">
              <div className="space-y-2">
                {draft.lines.map((line, i) => {
                  const amount = amountOf(line);
                  return (
                    <div key={i} className="grid grid-cols-12 items-end gap-2">
                      <div className="col-span-12 sm:col-span-2">
                        {i === 0 && <Label className="text-xs">Type</Label>}
                        <Select value={line.kind} onValueChange={(v) => setLine(i, { kind: v as LineKind })}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {KINDS.map((k) => (
                              <SelectItem key={k.value} value={k.value}>
                                {k.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-12 sm:col-span-4">
                        {i === 0 && <Label className="text-xs">Description</Label>}
                        <Input className="h-9" value={line.description} placeholder="e.g. Wardrobe lock replaced" onChange={(e) => setLine(i, { description: e.target.value })} />
                      </div>
                      <div className="col-span-3 sm:col-span-1">
                        {i === 0 && <Label className="text-xs">Qty</Label>}
                        <Input className="h-9" inputMode="decimal" value={line.quantity} onChange={(e) => setLine(i, { quantity: e.target.value.replace(/[^\d.]/g, "") })} />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        {i === 0 && <Label className="text-xs">Unit (FCFA)</Label>}
                        <Input className="h-9" inputMode="numeric" value={line.unitPrice} onChange={(e) => setLine(i, { unitPrice: e.target.value.replace(/[^\d]/g, "") })} />
                      </div>
                      <div className="col-span-4 sm:col-span-2 pb-2 text-right text-sm tabular-nums">{amount === null ? "—" : fcfa(amount)}</div>
                      <div className="col-span-1 flex justify-end">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          aria-label="Remove line"
                          onClick={() => setDraft((d) => ({ ...d, lines: d.lines.filter((_, j) => j !== i) }))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                <div className="flex flex-wrap gap-2">
                  {(["labour", "part", "travel"] as LineKind[]).map((k) => (
                    <Button
                      key={k}
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setDraft((d) => ({ ...d, lines: [...d.lines, { kind: k, description: k === "travel" ? "Travel to customer" : "", quantity: "1", unitPrice: "" }] }))}
                    >
                      <Plus className="mr-1 h-3 w-3" /> {KINDS.find((x) => x.value === k)?.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label className="text-xs">Discount (FCFA)</Label>
                  <Input inputMode="numeric" value={draft.discount} onChange={(e) => setDraft((d) => ({ ...d, discount: e.target.value.replace(/[^\d]/g, "") }))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Due date (empty = on receipt)</Label>
                  <Input type="date" value={draft.dueDate} onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))} />
                </div>
                <div className="space-y-1 rounded-md bg-muted p-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{fcfa(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="tabular-nums">− {fcfa(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="tabular-nums">{fcfa(total)}</span>
                  </div>
                </div>
              </div>

              <details className="rounded-md border p-3 text-sm">
                <summary className="cursor-pointer font-medium">Billed to (defaults to the booking's customer)</summary>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Input placeholder="Name" value={draft.customerName} onChange={(e) => setDraft((d) => ({ ...d, customerName: e.target.value }))} />
                  <Input placeholder="Phone" value={draft.customerPhone} onChange={(e) => setDraft((d) => ({ ...d, customerPhone: e.target.value }))} />
                  <Input placeholder="Email" value={draft.customerEmail} onChange={(e) => setDraft((d) => ({ ...d, customerEmail: e.target.value }))} />
                  <Input placeholder="Address" value={draft.customerAddress} onChange={(e) => setDraft((d) => ({ ...d, customerAddress: e.target.value }))} />
                </div>
              </details>

              <div className="space-y-1">
                <Label className="text-xs">Note on the invoice (optional)</Label>
                <Textarea
                  rows={2}
                  placeholder="e.g. Locks guaranteed 3 months. Old locks returned to the customer."
                  value={draft.notes}
                  onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                />
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setEditing(false); load(); }}>
                  Cancel
                </Button>
                <Button type="button" disabled={!!busy || draft.lines.length === 0} onClick={saveDraft}>
                  {busy === "save" && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Save draft
                </Button>
              </div>
            </div>
          )}

          {voided.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Voided: {voided.map((v) => `${v.number} (${v.voidReason})`).join(" · ")}
            </p>
          )}
        </section>

        {/* ------------------------------------------------ 3. payment */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">3 · Payment</h3>
          <dl className="grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Price</dt>
              <dd className="font-semibold">{fcfa(balance.total)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Received</dt>
              <dd className="font-semibold">{fcfa(balance.paid)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Still due</dt>
              <dd className="font-semibold">{fcfa(balance.remaining)}</dd>
            </div>
          </dl>
          {invoice?.status !== "issued" && balance.remaining > 0 && (
            <p className="text-xs text-muted-foreground">Tip: issue the invoice first, so the amount due matches what you billed.</p>
          )}

          {balance.remaining > 0 && status !== "cancelled" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-lg border p-3">
                <Label htmlFor="cash-amount" className="flex items-center gap-2">
                  <Banknote className="h-4 w-4" /> Cash received
                </Label>
                <div className="flex gap-2">
                  <Input id="cash-amount" inputMode="numeric" value={cash} onChange={(e) => setCash(e.target.value.replace(/[^\d]/g, ""))} />
                  <Button disabled={!!busy} onClick={takeCash}>
                    Record
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Goes into your cash account in the books. Part payments are fine.</p>
              </div>
              <div className="space-y-2 rounded-lg border p-3">
                <Label htmlFor="momo-phone" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" /> Mobile Money prompt
                </Label>
                <div className="flex gap-2">
                  <Input id="momo-phone" type="tel" placeholder="6XX XXX XXX" value={momoPhone} onChange={(e) => setMomoPhone(e.target.value)} />
                  <Button variant="outline" disabled={!!busy || !!momoRef} onClick={askMomo}>
                    {momoRef ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {momoRef ? "Waiting for the customer to approve on their phone…" : `Asks the customer's phone for ${fcfa(balance.remaining)} (MTN or Orange).`}
                </p>
              </div>
            </div>
          )}

          {payments.length > 0 && (
            <ul className="divide-y rounded-lg border text-sm">
              {payments.map((p) => (
                <li key={p.id} className="flex flex-wrap justify-between gap-2 px-3 py-2">
                  <span>
                    {new Date(p.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} ·{" "}
                    {p.paymentMethod === "mobile_money" ? "Mobile Money" : p.paymentMethod === "cash" ? "Cash" : p.paymentMethod} ·{" "}
                    {p.paymentType.replace(/_/g, " ")}
                    {p.status !== "completed" && <span className="text-muted-foreground"> ({p.status})</span>}
                  </span>
                  <span className="font-medium tabular-nums">{fcfa(p.amount)}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-muted-foreground">Job {bookingNumber}</p>
        </section>
      </CardContent>
    </Card>
  );
}
