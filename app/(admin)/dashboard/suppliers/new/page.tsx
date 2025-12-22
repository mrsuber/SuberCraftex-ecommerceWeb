import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { SupplierForm } from "@/components/suppliers/SupplierForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewSupplierPage() {
  const user = await getSession();

  if (!user || user.role !== 'admin') {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/suppliers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Supplier</h1>
          <p className="text-gray-600 mt-1">
            Create a new supplier record
          </p>
        </div>
      </div>

      <SupplierForm />
    </div>
  );
}
