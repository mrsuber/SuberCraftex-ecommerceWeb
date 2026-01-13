import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { AdminHeader } from "@/components/dashboard/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  // Allow admins, drivers, cashiers, and tailors to access dashboard
  if (!user || (user.role !== 'admin' && user.role !== 'driver' && user.role !== 'cashier' && user.role !== 'tailor')) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar userRole={user.role} />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
