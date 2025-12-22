import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { SettingsForms } from "@/components/account/settings-forms";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and security
          </p>
        </div>

        <SettingsForms user={user} />
      </div>
    </div>
  );
}
