"use client";

import { Plus, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DAY_NAMES, MAX_WINDOWS_PER_DAY, WeekHours } from "@/lib/services/week-hours";

/** Monday first, the way people read a week */
const ORDER = [1, 2, 3, 4, 5, 6, 0];

interface Props {
  value: WeekHours;
  onChange: (week: WeekHours) => void;
  disabled?: boolean;
}

/**
 * Edit opening hours day by day. Each day can have several periods (a lunch break splits
 * the day in two). A day switched off is closed.
 */
export function WeekHoursEditor({ value, onChange, disabled }: Props) {
  const setDay = (d: number, windows: WeekHours[number]) => onChange(value.map((day, i) => (i === d ? windows : day)));

  const toggle = (d: number, open: boolean) => {
    if (!open) return setDay(d, []);
    // Reopen with the hours of the nearest open day, or a normal day
    const like = ORDER.map((i) => value[i]).find((day) => day.length > 0);
    setDay(d, like ? like.map((w) => ({ ...w })) : [{ start: "08:00", end: "17:00" }]);
  };

  const addPeriod = (d: number) => {
    const day = value[d];
    const last = day[day.length - 1];
    if (!last) return setDay(d, [{ start: "08:00", end: "12:00" }]);
    // A typical split day: morning until 12:00, afternoon from 14:00
    if (day.length === 1 && last.start < "12:00" && last.end > "14:00") {
      return setDay(d, [{ start: last.start, end: "12:00" }, { start: "14:00", end: last.end }]);
    }
    const [h, m] = last.end.split(":").map(Number);
    const startH = Math.min(h + 1, 22);
    const start = `${String(startH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const end = `${String(Math.min(startH + 2, 23)).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    setDay(d, [...day, { start, end }]);
  };

  const copyToWeekdays = (d: number) => {
    onChange(value.map((day, i) => (i >= 1 && i <= 5 ? value[d].map((w) => ({ ...w })) : day)));
  };

  return (
    <div className="divide-y rounded-lg border">
      {ORDER.map((d) => {
        const day = value[d];
        const open = day.length > 0;
        return (
          <div key={d} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-start">
            <div className="flex w-full items-center gap-3 sm:w-40 sm:pt-1.5">
              <Switch
                checked={open}
                onCheckedChange={(v) => toggle(d, v)}
                disabled={disabled}
                aria-label={`${DAY_NAMES[d]} open`}
              />
              <span className={`font-medium ${open ? "" : "text-muted-foreground"}`}>{DAY_NAMES[d]}</span>
            </div>
            <div className="flex-1 space-y-2">
              {!open && <p className="pt-1.5 text-sm text-muted-foreground">Closed</p>}
              {day.map((w, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2">
                  <Input
                    type="time"
                    step={900}
                    className="h-9 w-[7.5rem]"
                    value={w.start}
                    disabled={disabled}
                    aria-label={`${DAY_NAMES[d]} period ${i + 1} opens`}
                    onChange={(e) => setDay(d, day.map((x, j) => (j === i ? { ...x, start: e.target.value } : x)))}
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    step={900}
                    className="h-9 w-[7.5rem]"
                    value={w.end}
                    disabled={disabled}
                    aria-label={`${DAY_NAMES[d]} period ${i + 1} closes`}
                    onChange={(e) => setDay(d, day.map((x, j) => (j === i ? { ...x, end: e.target.value } : x)))}
                  />
                  {day.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={disabled}
                      aria-label="Remove this period"
                      onClick={() => setDay(d, day.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {open && (
              <div className="flex gap-1 sm:pt-0.5">
                {day.length < MAX_WINDOWS_PER_DAY && (
                  <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={() => addPeriod(d)}>
                    <Plus className="mr-1 h-3.5 w-3.5" /> {day.length === 1 ? "Add break" : "Add period"}
                  </Button>
                )}
                {d >= 1 && d <= 5 && (
                  <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={() => copyToWeekdays(d)} title="Use these hours Monday to Friday">
                    <Copy className="mr-1 h-3.5 w-3.5" /> Mon–Fri
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
