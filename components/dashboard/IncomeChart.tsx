"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/currency";

export interface IncomeStream {
  key: string;
  label: string;
}

/**
 * Income per day for the last two weeks, stacked by stream. Colours follow the stream (never
 * its rank), in a fixed order validated for colour-blind readers in light and dark mode.
 * The same figures are shown as a table beside it.
 */
const SLOT_VARS = ["--series-1", "--series-2", "--series-3", "--series-4", "--series-5", "--series-6"];

const VIZ_STYLE = `
.income-viz {
  --viz-surface: #ffffff; --viz-grid: #e7e5e4; --viz-text: #52514e;
  --series-1: #2a78d6; --series-2: #eb6834; --series-3: #1baf7a;
  --series-4: #eda100; --series-5: #e87ba4; --series-6: #008300;
}
.dark .income-viz {
  --viz-surface: #0a0a0a; --viz-grid: #2a2a28; --viz-text: #c3c2b7;
  --series-1: #3987e5; --series-2: #d95926; --series-3: #199e70;
  --series-4: #c98500; --series-5: #d55181; --series-6: #008300;
}`;

/** 7500 → "7.5k", 30000 → "30k", 1250000 → "1.25M" */
const short = (n: number) => {
  const trim = (v: number) => String(Number(v.toFixed(2)))
  return n >= 1_000_000 ? `${trim(n / 1_000_000)}M` : n >= 1000 ? `${trim(n / 1000)}k` : String(n)
};
const dayLabel = (ymd: string) =>
  new Date(`${ymd}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export function IncomeChart({ data, streams }: { data: Record<string, number | string>[]; streams: IncomeStream[] }) {
  const colorOf = (key: string) => `var(${SLOT_VARS[streams.findIndex((s) => s.key === key)] ?? "--series-6"})`;
  // Show only streams that earned something in the period; colours stay with their stream
  const shown = streams.filter((s) => data.some((d) => Number(d[s.key]) > 0));
  const total = data.reduce((sum, d) => sum + streams.reduce((s, x) => s + Number(d[x.key] ?? 0), 0), 0);

  return (
    <div className="income-viz">
      <style>{VIZ_STYLE}</style>
      {total === 0 ? (
        <p className="flex h-[260px] items-center justify-center text-center text-sm text-muted-foreground">
          No income recorded in the books in the last 14 days.
        </p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--viz-grid)" />
              <XAxis
                dataKey="date"
                tickFormatter={dayLabel}
                tick={{ fill: "var(--viz-text)", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "var(--viz-grid)" }}
                interval="preserveStartEnd"
                minTickGap={16}
              />
              <YAxis allowDecimals={false} tickFormatter={short} tick={{ fill: "var(--viz-text)", fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
              <Tooltip
                cursor={{ fill: "var(--viz-grid)", opacity: 0.5 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const rows = payload.filter((p) => Number(p.value) > 0);
                  const sum = rows.reduce((s, p) => s + Number(p.value), 0);
                  return (
                    <div className="rounded-md border bg-white px-3 py-2 text-xs shadow-md dark:bg-neutral-900">
                      <div className="mb-1 font-medium">{dayLabel(String(label))}</div>
                      {rows.length === 0 && <div className="text-muted-foreground">Nothing recorded</div>}
                      {rows.map((p) => (
                        <div key={String(p.dataKey)} className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: colorOf(String(p.dataKey)) }} />
                            {streams.find((s) => s.key === p.dataKey)?.label}
                          </span>
                          <span className="tabular-nums">{formatCurrency(Number(p.value))}</span>
                        </div>
                      ))}
                      {rows.length > 1 && (
                        <div className="mt-1 flex justify-between gap-4 border-t pt-1 font-medium">
                          <span>Total</span>
                          <span className="tabular-nums">{formatCurrency(sum)}</span>
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              {shown.map((s) => (
                <Bar key={s.key} dataKey={s.key} stackId="income" fill={colorOf(s.key)} stroke="var(--viz-surface)" strokeWidth={2} maxBarSize={28} />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label="Legend">
            {shown.map((s) => (
              <li key={s.key} className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: colorOf(s.key) }} />
                {s.label}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
