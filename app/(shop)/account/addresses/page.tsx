import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { AddressList } from "@/components/account/address-list";

export const dynamic = 'force-dynamic';

export default async function AddressesPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  const addresses = await db.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Saved Addresses</h1>
          <p className="text-muted-foreground">
            Manage your shipping and billing addresses
          </p>
        </div>

        <AddressList initialAddresses={addresses} />
      </div>
    </div>
  );
}
