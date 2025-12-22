import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { PurchaseOrdersTable } from "@/components/purchase-orders/PurchaseOrdersTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function PurchaseOrdersPage() {
  const user = await getSession();

  if (!user || user.role !== 'admin') {
    redirect("/login");
  }

  const purchaseOrders = await db.purchaseOrder.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      supplier: true,
      items: {
        include: {
          product: true,
        },
      },
      createdBy: {
        select: {
          fullName: true,
          email: true,
        },
      },
      _count: {
        select: {
          goodsReceipts: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage purchase orders from suppliers
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/purchase-orders/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Purchase Order
          </Link>
        </Button>
      </div>

      <PurchaseOrdersTable purchaseOrders={purchaseOrders} />
    </div>
  );
}
