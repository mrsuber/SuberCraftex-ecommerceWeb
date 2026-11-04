import { redirect } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  HandCoins,
  Landmark,
  Plus,
  ShieldCheck,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/session";
import { formatCurrency } from "@/lib/currency";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { IncomeChart } from "@/components/dashboard/IncomeChart";
import { JobList } from "@/components/dashboard/jobs/JobList";
import {
  actionItems,
  cashPosition,
  dailyIncome,
  HealthCheck,
  incomeComparison,
  serviceSnapshot,
  STREAMS,
  systemHealth,
} from "@/lib/admin/overview";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard - SuberCraftex Admin",
  description: "What needs doing today, and where the money is",
};

function greeting(now: Date) {
  const hour = (now.getUTCHours() + 1) % 24; // shop time
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

function Tile({ title, value, sub, icon: Icon, href }: { title: string; value: string; sub: React.ReactNode; icon: React.ElementType; href?: string }) {
  const body = (
    <Card className={href ? "h-full transition-colors hover:bg-muted/40" : "h-full"}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
      </CardContent>
    </Card>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

const HEALTH_ICON = { ok: CheckCircle2, warn: AlertTriangle, bad: XCircle };
const HEALTH_COLOR = { ok: "text-emerald-600", warn: "text-amber-600", bad: "text-red-600" };
const HEALTH_WORD = { ok: "OK", warn: "Check", bad: "Fix" };

function HealthCard({ checks }: { checks: HealthCheck[] }) {
  const problems = checks.filter((c) => c.state !== "ok").length;
  return (
    <Card className={checks.some((c) => c.state === "bad") ? "border-red-300" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" /> System health
        </CardTitle>
        <CardDescription>
          Super admins only. {problems === 0 ? "Everything is set up." : `${problems} thing(s) to look at before the business can rely on the system.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y rounded-lg border text-sm">
          {checks.map((c) => {
            const Icon = HEALTH_ICON[c.state];
            const row = (
              <span className="flex items-start gap-3 px-3 py-2">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${HEALTH_COLOR[c.state]}`} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="font-medium">{c.label}</span>
                  <span className={`ml-2 text-xs font-semibold ${HEALTH_COLOR[c.state]}`}>{HEALTH_WORD[c.state]}</span>
                  <span className="block break-words text-xs text-muted-foreground">{c.detail}</span>
                </span>
              </span>
            );
            return <li key={c.key}>{c.href && c.state !== "ok" ? <Link href={c.href} className="block hover:bg-muted/50">{row}</Link> : row}</li>;
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const user = await getSession();
  // Each role has its own home; the business figures below are for admins only
  if (user?.role === "driver") redirect("/dashboard/orders");
  if (user?.role === "tailor") redirect("/dashboard/tailor");
  if (user?.role === "technician") redirect("/dashboard/technician");
  if (user?.role === "cashier") redirect("/dashboard/pos");
  if (user?.role !== "admin") redirect("/login");

  const now = new Date();
  const superAdmin = isSuperAdmin(user);
  const [income, daily, cash, services, actions, health] = await Promise.all([
    incomeComparison(now),
    dailyIncome(14, now),
    cashPosition(),
    serviceSnapshot(now),
    actionItems(),
    superAdmin ? systemHealth() : Promise.resolve(null),
  ]);

  const attention = [
    { label: "New online bookings to confirm", count: services.newOnline, href: "/dashboard/bookings" },
    { label: "Quotes to prepare", count: services.quotesToPrepare, href: "/dashboard/bookings" },
    { label: "Jobs today with nobody assigned", count: services.unassignedToday, href: "/dashboard/jobs?who=unassigned" },
    { label: "Jobs done but not invoiced", count: services.toInvoice.length, href: "/dashboard/jobs" },
    { label: "Visits past their date, not marked done", count: services.overdueOpen.length, href: "/dashboard/jobs" },
    { label: "Invoices paid late", count: services.late.length, href: "/dashboard/jobs" },
    ...actions,
  ].filter((a) => a.count > 0);

  const healthHasBlockers = !!health?.some((c) => c.state === "bad");
  const today = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Douala" });
  const ChangeIcon = (income.change ?? 0) >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">
            {greeting(now)}
            {user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}
          </h1>
          <p className="text-muted-foreground">{today}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/pos">
              <CreditCard className="mr-2 h-4 w-4" /> New sale
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/bookings/new">
              <Plus className="mr-2 h-4 w-4" /> Record a job
            </Link>
          </Button>
        </div>
      </div>

      {health && healthHasBlockers && <HealthCard checks={health} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Tile
          title="Income this month"
          value={formatCurrency(income.current.total)}
          icon={TrendingUp}
          href="/dashboard/finance"
          sub={
            income.change === null ? (
              "Nothing to compare with last month yet"
            ) : (
              <span className="flex items-center gap-1">
                <ChangeIcon className="h-3.5 w-3.5" aria-hidden />
                {income.change >= 0 ? "+" : ""}
                {income.change}% vs the same days last month ({formatCurrency(income.previous.total)})
              </span>
            )
          }
        />
        <Tile
          title="Owed by customers"
          value={formatCurrency(services.owed)}
          icon={HandCoins}
          href="/dashboard/jobs"
          sub={`${services.unpaid.length} invoice(s) not fully paid${services.late.length ? `, ${services.late.length} late` : ""}`}
        />
        <Tile title="Money held" value={formatCurrency(cash.total)} icon={Landmark} href="/dashboard/finance" sub="Safe, bank, Mobile Money, drawers and drivers" />
        <Tile
          title="Jobs today"
          value={String(services.today.length)}
          icon={ClipboardList}
          href="/dashboard/jobs"
          sub={services.unassignedToday ? `${services.unassignedToday} with nobody assigned` : "All assigned"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Needs attention</CardTitle>
            <CardDescription>Things waiting on someone.</CardDescription>
          </CardHeader>
          <CardContent>
            {attention.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> All clear.
              </p>
            ) : (
              <ul className="divide-y rounded-lg border text-sm">
                {attention.map((a) => (
                  <li key={a.label}>
                    <Link href={a.href} className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-muted/50">
                      <span>{a.label}</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums">{a.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Today&apos;s jobs</CardTitle>
              <CardDescription>Visits and workshop work booked for today.</CardDescription>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/jobs">All jobs</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <JobList jobs={services.today} empty="No jobs booked for today." showDate={false} showWho />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Income, last 14 days</CardTitle>
            <CardDescription>Money earned per day, as recorded in the books, by where it came from.</CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeChart data={daily} streams={STREAMS.map((s) => ({ key: s.key, label: s.label }))} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>This month by source</CardTitle>
            <CardDescription>Compared with the same days of last month.</CardDescription>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Source</th>
                  <th className="pb-2 text-right font-medium">This month</th>
                  <th className="pb-2 text-right font-medium">Last month</th>
                </tr>
              </thead>
              <tbody>
                {STREAMS.map((s) => (
                  <tr key={s.key} className="border-t">
                    <td className="py-1.5">{s.label}</td>
                    <td className="py-1.5 text-right tabular-nums">{formatCurrency(income.current.byStream[s.key])}</td>
                    <td className="py-1.5 text-right tabular-nums text-muted-foreground">{formatCurrency(income.previous.byStream[s.key])}</td>
                  </tr>
                ))}
                <tr className="border-t-2 font-semibold">
                  <td className="py-1.5">Total</td>
                  <td className="py-1.5 text-right tabular-nums">{formatCurrency(income.current.total)}</td>
                  <td className="py-1.5 text-right tabular-nums text-muted-foreground">{formatCurrency(income.previous.total)}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Where the money is</CardTitle>
            <CardDescription>Balances in the books right now.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm">
              {cash.places.map((p) => (
                <li key={p.label} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{p.label}</span>
                  <span className="tabular-nums">{formatCurrency(p.amount)}</span>
                </li>
              ))}
              <li className="flex justify-between gap-3 border-t pt-1.5 font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(cash.total)}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoices to collect</CardTitle>
            <CardDescription>Oldest first.</CardDescription>
          </CardHeader>
          <CardContent>
            {services.unpaid.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing owed.</p>
            ) : (
              <ul className="divide-y text-sm">
                {services.unpaid.slice(0, 6).map((u) => (
                  <li key={u.id}>
                    <Link href={`/dashboard/bookings/${u.bookingId}#billing`} className="flex justify-between gap-3 py-1.5 hover:underline">
                      <span className="min-w-0 truncate">
                        {u.customer}
                        {u.daysLate > 0 && <span className="ml-1 text-xs text-red-600">{u.daysLate}d late</span>}
                      </span>
                      <span className="shrink-0 tabular-nums">{formatCurrency(u.due)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>Latest shop and online orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentOrders />
          </CardContent>
        </Card>
      </div>

      {health && !healthHasBlockers && <HealthCard checks={health} />}
    </div>
  );
}
