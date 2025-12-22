import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { SuppliersTable } from "@/components/suppliers/SuppliersTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function SuppliersPage() {
  const user = await getSession();

  if (!user || user.role !== 'admin') {
    redirect("/login");
  }

  const suppliers = await db.supplier.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          purchaseOrders: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-gray-600 mt-1">
            Manage your suppliers and vendor relationships
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/suppliers/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Link>
        </Button>
      </div>

      <SuppliersTable suppliers={suppliers} />
    </div>
  );
}
