import { db } from "@/lib/db";
import { CustomersTable } from "@/components/dashboard/CustomersTable";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Customers - Admin Dashboard",
  description: "Manage customers",
};

export default async function CustomersPage() {
  const [users, count] = await Promise.all([
    db.user.findMany({
      orderBy: { createdAt: "desc" },
    }),
    db.user.count(),
  ]);

  // Get order counts and total spent for each customer
  const customersWithOrders = await Promise.all(
    users.map(async (user) => {
      const [orderCount, paidOrders] = await Promise.all([
        db.order.count({
          where: { userId: user.id },
        }),
        db.order.findMany({
          where: {
            userId: user.id,
            paymentStatus: "paid",
          },
          select: { totalAmount: true },
        }),
      ]);

      const totalSpent = paidOrders.reduce(
        (sum, order) => sum + Number(order.totalAmount),
        0
      );

      return {
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        phone: user.phone,
        role: user.role,
        created_at: user.createdAt.toISOString(),
        orderCount,
        totalSpent,
      };
    })
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">
          Manage all users and their roles ({count || 0} total)
        </p>
      </div>

      {/* Customers Table */}
      <CustomersTable customers={customersWithOrders} />
    </div>
  );
}
