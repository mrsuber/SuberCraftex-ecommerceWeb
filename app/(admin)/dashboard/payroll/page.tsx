import { isSuperAdmin, requireAdmin } from "@/lib/auth/session";
import { getSetting } from "@/lib/settings";
import { PayrollClient } from "@/components/admin/payroll/PayrollClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payroll - Admin Dashboard",
};

export default async function PayrollPage() {
  const user = await requireAdmin();
  const accountant = await getSetting("company.accountant");
  return <PayrollClient superAdmin={isSuperAdmin(user)} accountant={{ name: accountant.name, email: accountant.email, phone: accountant.phone }} />;
}
