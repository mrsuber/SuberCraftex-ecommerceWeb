import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Settings - Admin Dashboard",
  description: "Manage store settings",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your store configuration and preferences
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Basic information about your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  defaultValue="SuberCraftex"
                  placeholder="Your store name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeDescription">Store Description</Label>
                <Input
                  id="storeDescription"
                  defaultValue="Premium e-commerce platform"
                  placeholder="Brief description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeEmail">Contact Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  defaultValue="support@subercraftex.com"
                  placeholder="contact@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storePhone">Phone Number</Label>
                <Input
                  id="storePhone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Currency & Locale</CardTitle>
              <CardDescription>
                Set your store&apos;s currency and regional settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" defaultValue="USD" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="America/New_York" />
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure payment processors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stripeKey">Stripe Publishable Key</Label>
                <Input
                  id="stripeKey"
                  type="password"
                  placeholder="pk_test_..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripeSecret">Stripe Secret Key</Label>
                <Input
                  id="stripeSecret"
                  type="password"
                  placeholder="sk_test_..."
                />
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  🔒 Payment keys are stored securely and encrypted. Never share
                  your secret keys.
                </p>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Rates</CardTitle>
              <CardDescription>
                Configure shipping options and rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="standardShipping">Standard Shipping</Label>
                <Input
                  id="standardShipping"
                  type="number"
                  defaultValue="0"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expressShipping">Express Shipping</Label>
                <Input
                  id="expressShipping"
                  type="number"
                  defaultValue="10"
                  placeholder="10.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="overnightShipping">Overnight Shipping</Label>
                <Input
                  id="overnightShipping"
                  type="number"
                  defaultValue="25"
                  placeholder="25.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold">
                  Free Shipping Threshold
                </Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  defaultValue="50"
                  placeholder="50.00"
                />
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure email settings and templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  defaultValue="noreply@subercraftex.com"
                  placeholder="noreply@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  defaultValue="SuberCraftex"
                  placeholder="Your Store Name"
                />
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Email notifications are sent via Resend. Configure your API key
                  in environment variables.
                </p>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
