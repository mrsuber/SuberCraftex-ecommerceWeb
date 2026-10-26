import { db } from "@/lib/db";
import { isSuperAdmin, requireAdmin } from "@/lib/auth/session";
import { ApprenticeFeesAdmin } from "@/components/admin/apprentices/ApprenticeFeesAdmin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Apprentice fees - Admin Dashboard",
};

export default async function ApprenticeFeesPage() {
  const user = await requireAdmin();
  const apprentices = await db.apprentice.findMany({ select: { id: true, fullName: true, apprenticeNumber: true }, orderBy: { fullName: "asc" } });
  return <ApprenticeFeesAdmin apprentices={apprentices} superAdmin={isSuperAdmin(user)} />;
}
