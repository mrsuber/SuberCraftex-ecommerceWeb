import { requireAuth } from "@/lib/auth/session";
import { SalaryWallet } from "@/components/staff/SalaryWallet";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Salary - SuberCraftex",
};

export default async function SalaryPage() {
  await requireAuth("/login?redirect=/account/salary");
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <SalaryWallet />
    </div>
  );
}
