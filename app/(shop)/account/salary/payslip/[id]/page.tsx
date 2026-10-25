import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatXaf } from "@/lib/money";
import { PrintButton } from "./PrintButton";

export const dynamic = "force-dynamic";

interface Item {
  code: string;
  label: string;
  amount: number;
}

export default async function PayslipPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth();
  const { id } = await params;
  const line = await db.payrollLine.findUnique({ where: { id }, include: { run: true } });
  if (!line || (line.userId !== user.id && user.role !== "admin")) notFound();
  if (line.run.status !== "approved" && user.role !== "admin") notFound();

  const deductions = line.deductions as unknown as Item[];
  const employer = line.employerCharges as unknown as Item[];
  const month = line.run.periodStart.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  const row = (label: string, amount: bigint | number, strong = false) => (
    <tr className={strong ? "font-semibold border-t" : ""}>
      <td className="py-1">{label}</td>
      <td className="py-1 text-right">{formatXaf(typeof amount === "number" ? BigInt(amount) : amount)}</td>
    </tr>
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 print:py-0">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payslip · {month}</h1>
          <p className="text-sm text-muted-foreground">SuberCraftex{line.run.status !== "approved" && " · DRAFT, not paid yet"}</p>
        </div>
        <PrintButton />
      </div>
      <div className="mb-6 grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Employee:</span> {line.fullName}</div>
        <div><span className="text-muted-foreground">Job:</span> {line.jobTitle}</div>
        <div><span className="text-muted-foreground">Monthly salary:</span> {formatXaf(line.baseSalary)}</div>
        <div><span className="text-muted-foreground">Unpaid days:</span> {line.unpaidDays}</div>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {row("Salary for the month", line.gross - line.bonus)}
          {line.bonus > 0n && row(`Bonus${line.bonusNote ? `: ${line.bonusNote}` : ""}`, line.bonus)}
          {row("Gross", line.gross, true)}
          {deductions.map((d) => row(d.label, -d.amount))}
          {line.advanceRecovered > 0n && row("Salary advance repaid", -line.advanceRecovered)}
          {line.chargesRecovered > 0n && row("Charges you accepted", -line.chargesRecovered)}
          {row("Net paid into your salary wallet", line.net, true)}
        </tbody>
      </table>
      {employer.length > 0 && (
        <>
          <h2 className="mt-8 mb-2 font-semibold">Paid by SuberCraftex on top of your salary</h2>
          <table className="w-full text-sm">
            <tbody>
              {employer.map((d) => row(d.label, d.amount))}
            </tbody>
          </table>
        </>
      )}
      <p className="mt-8 text-xs text-muted-foreground">Reference {line.id}. Questions about this payslip: ask your manager or the accountant.</p>
    </div>
  );
}
