import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileMoneySettings } from "@/components/admin/MobileMoneySettings";
import { PaymentKeysSettings } from "@/components/admin/settings/PaymentKeysSettings";
import { AccountantSettings, BusinessSettings } from "@/components/admin/settings/BusinessSettings";
import { isSuperAdmin, requireAdmin } from "@/lib/auth/session";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Settings - Admin Dashboard",
  description: "Manage store settings",
};

export default async function SettingsPage() {
  const user = await requireAdmin();
  const superAdmin = isSuperAdmin(user);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Payments, money rules, delivery prices and contacts. Every change is recorded in the audit log.
        </p>
      </div>

      <Tabs defaultValue="payments" className="space-y-6">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="rules">Money rules</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="accountant">Accountant</TabsTrigger>
          <TabsTrigger value="manual">Manual Mobile Money</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          <PaymentKeysSettings canEdit={superAdmin} />
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <BusinessSettings only={["checkout.", "payouts.", "investors.", "tax.", "payroll.", "apprentices."]} />
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          <BusinessSettings only={["shipping."]} />
        </TabsContent>

        <TabsContent value="accountant" className="space-y-6">
          <AccountantSettings />
        </TabsContent>

        {/* The number customers and investors can still send money to by hand, if needed */}
        <TabsContent value="manual" className="space-y-6">
          <MobileMoneySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
