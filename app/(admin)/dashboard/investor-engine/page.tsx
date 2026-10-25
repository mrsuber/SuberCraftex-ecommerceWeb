import { db } from "@/lib/db";
import { isSuperAdmin, requireAdmin } from "@/lib/auth/session";
import { InvestorEngineClient } from "@/components/admin/investors/InvestorEngineClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Investor engine - Admin Dashboard",
};

export default async function InvestorEnginePage() {
  const user = await requireAdmin();
  const equipment = await db.equipment.findMany({ where: { status: { not: "retired" } }, orderBy: { name: "asc" } });
  return (
    <InvestorEngineClient
      superAdmin={isSuperAdmin(user)}
      equipment={equipment.map((e) => ({
        id: e.id,
        name: e.name,
        purchasePrice: Number(e.purchasePrice),
        usefulLifeMonths: e.usefulLifeMonths,
        residualValue: e.residualValue ? Number(e.residualValue) : null,
        depreciationStart: e.depreciationStart ? e.depreciationStart.toISOString().slice(0, 10) : null,
        powerKw: e.powerKw ? Number(e.powerKw) : null,
        floorAreaM2: e.floorAreaM2 ? Number(e.floorAreaM2) : null,
        carriedLoss: Number(e.carriedLoss),
      }))}
    />
  );
}
