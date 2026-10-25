import { requireAdmin, isSuperAdmin } from "@/lib/auth/session";
import { FinanceClient } from "@/components/admin/finance/FinanceClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Finance - Admin Dashboard",
  description: "Money held, money owed, Mobile Money payments and driver cash",
};

export default async function FinancePage() {
  const user = await requireAdmin();
  return <FinanceClient superAdmin={isSuperAdmin(user)} />;
}
