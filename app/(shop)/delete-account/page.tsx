import { Card, CardContent } from "@/components/ui/card";
import {
  Trash2,
  AlertTriangle,
  Mail,
  Clock,
  Shield,
  FileX,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const metadata = {
  title: "Delete Data & Account | SuberCraftex",
  description:
    "Request deletion of your data or SuberCraftex account",
};

export default function DeleteAccountPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header with App/Developer Name */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SuberCraftex
            </span>{" "}
            Data Deletion
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Request deletion of your personal data or entire account
          </p>
          <p className="text-sm text-muted-foreground">
            Operated by <strong>Camsol Technologies Ltd</strong>
          </p>
        </div>

        {/* Two Options Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="border-primary/50">
            <CardContent className="p-6 text-center">
              <FileX className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Delete Specific Data</h3>
              <p className="text-sm text-muted-foreground">
                Keep your account, remove specific data
              </p>
            </CardContent>
          </Card>
          <Card className="border-red-500/50">
            <CardContent className="p-6 text-center">
              <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Delete Entire Account</h3>
              <p className="text-sm text-muted-foreground">
                Remove account and all associated data
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ============================================ */}
        {/* SECTION 1: Delete Specific Data */}
        {/* ============================================ */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileX className="h-6 w-6 text-primary" />
              Option 1: Delete Specific Data
            </h2>

            {/* Steps */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4 text-lg">
                How to Request Data Deletion
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Send an email request</p>
                    <p className="text-sm text-muted-foreground">
                      Email{" "}
                      <a
                        href="mailto:support@subercraftex.com"
                        className="text-primary hover:underline"
                      >
                        support@subercraftex.com
                      </a>{" "}
                      with subject "Data Deletion Request"
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Include required information</p>
                    <p className="text-sm text-muted-foreground">
                      Your registered email address and which data types you
                      want deleted
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Receive confirmation</p>
                    <p className="text-sm text-muted-foreground">
                      We'll process your request within 30 days and send
                      confirmation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data types that can be deleted */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Data You Can Request to Delete</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Saved delivery addresses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Body measurements (tailoring data)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Product reviews you submitted
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Wishlist and saved items
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Profile photos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Browsing preferences
                </li>
              </ul>
            </div>

            <a
              href="mailto:support@subercraftex.com?subject=Data%20Deletion%20Request%20-%20SuberCraftex&body=Hello%20SuberCraftex%20Support%2C%0A%0AI%20would%20like%20to%20request%20deletion%20of%20specific%20data%20from%20my%20account.%0A%0AMy%20registered%20email%3A%20%5BEnter%20your%20email%5D%0A%0APlease%20delete%20the%20following%20data%20(mark%20with%20X)%3A%0A%5B%20%5D%20Saved%20addresses%0A%5B%20%5D%20Body%20measurements%0A%5B%20%5D%20Product%20reviews%0A%5B%20%5D%20Wishlist%20items%0A%5B%20%5D%20Profile%20photos%0A%5B%20%5D%20Browsing%20preferences%0A%5B%20%5D%20Other%3A%20%0A%0AThank%20you."
              className="inline-flex items-center justify-center w-full px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              Request Specific Data Deletion
            </a>
          </CardContent>
        </Card>

        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or delete everything
            </span>
          </div>
        </div>

        {/* ============================================ */}
        {/* SECTION 2: Delete Entire Account */}
        {/* ============================================ */}
        <Card className="mb-8 border-red-500/30">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Trash2 className="h-6 w-6 text-red-500" />
              Option 2: Delete Entire Account
            </h2>

            {/* Warning */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong>Warning:</strong> Account deletion is permanent and
                  cannot be undone. You will lose access to your order history,
                  service bookings, and all saved data.
                </p>
              </div>
            </div>

            {/* Steps */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4 text-lg">
                How to Request Account Deletion
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Send an email request</p>
                    <p className="text-sm text-muted-foreground">
                      Email{" "}
                      <a
                        href="mailto:support@subercraftex.com"
                        className="text-primary hover:underline"
                      >
                        support@subercraftex.com
                      </a>{" "}
                      with subject "Account Deletion Request"
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Verify your identity</p>
                    <p className="text-sm text-muted-foreground">
                      Include your registered email address and full name as
                      shown on your account
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Wait for processing</p>
                    <p className="text-sm text-muted-foreground">
                      Your request will be processed within 30 days. You can
                      cancel during this period.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Receive confirmation</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive an email confirming your account and data
                      have been deleted
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="mailto:support@subercraftex.com?subject=Account%20Deletion%20Request%20-%20SuberCraftex&body=Hello%20SuberCraftex%20Support%2C%0A%0AI%20would%20like%20to%20request%20complete%20deletion%20of%20my%20SuberCraftex%20account%20and%20all%20associated%20data.%0A%0AMy%20registered%20email%3A%20%5BEnter%20your%20email%5D%0AFull%20name%20on%20account%3A%20%5BEnter%20your%20name%5D%0A%0AI%20understand%20that%3A%0A-%20This%20action%20is%20permanent%20and%20cannot%20be%20undone%0A-%20I%20will%20lose%20access%20to%20my%20order%20history%20and%20service%20bookings%0A-%20Some%20transaction%20records%20may%20be%20retained%20for%20legal%20purposes%0A%0APlease%20proceed%20with%20deleting%20my%20account.%0A%0AThank%20you."
              className="inline-flex items-center justify-center w-full px-6 py-4 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              Request Complete Account Deletion
            </a>
          </CardContent>
        </Card>

        {/* ============================================ */}
        {/* Data Types: Deleted vs Retained */}
        {/* ============================================ */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-6">
              Data Deletion Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Data That Will Be Deleted */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Data That Will Be Deleted
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Personal information (name, email, phone)</li>
                  <li>• Account credentials and login data</li>
                  <li>• Saved delivery addresses</li>
                  <li>• Body measurements for tailoring</li>
                  <li>• Profile photos and images</li>
                  <li>• Wishlist and cart items</li>
                  <li>• Product reviews</li>
                  <li>• App preferences and settings</li>
                  <li>• Service booking details</li>
                  <li>• Communication preferences</li>
                </ul>
              </div>

              {/* Data That May Be Retained */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-amber-600">
                  <Shield className="h-5 w-5" />
                  Data That May Be Retained
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <strong>Transaction records</strong>
                    <br />
                    <span className="text-xs">
                      Retained for 7 years (tax/legal compliance)
                    </span>
                  </li>
                  <li>
                    • <strong>Payment history</strong>
                    <br />
                    <span className="text-xs">
                      Retained for 7 years (financial regulations)
                    </span>
                  </li>
                  <li>
                    • <strong>Anonymized order data</strong>
                    <br />
                    <span className="text-xs">
                      May be kept for business analytics (not linked to you)
                    </span>
                  </li>
                  <li>
                    • <strong>Legal compliance records</strong>
                    <br />
                    <span className="text-xs">
                      As required by applicable laws
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ============================================ */}
        {/* Processing Timeline */}
        {/* ============================================ */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-semibold mb-2">Processing Timeline</h2>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>
                    <strong>Request acknowledgment:</strong> Within 48 hours
                  </li>
                  <li>
                    <strong>Data/Account deletion:</strong> Within 30 days
                  </li>
                  <li>
                    <strong>Confirmation email:</strong> Sent upon completion
                  </li>
                  <li>
                    <strong>Cancellation window:</strong> You may cancel your
                    request within the 30-day processing period
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ============================================ */}
        {/* Contact Information */}
        {/* ============================================ */}
        <div className="text-center text-sm text-muted-foreground border-t pt-8">
          <p className="font-medium text-foreground mb-2">
            SuberCraftex Data Deletion Support
          </p>
          <p className="mb-1">
            Email:{" "}
            <a
              href="mailto:support@subercraftex.com"
              className="text-primary hover:underline"
            >
              support@subercraftex.com
            </a>
          </p>
          <p className="mb-4">
            Website:{" "}
            <a
              href="https://subercraftex.com"
              className="text-primary hover:underline"
            >
              subercraftex.com
            </a>
          </p>
          <p>
            SuberCraftex is a service operated by{" "}
            <strong>Camsol Technologies Ltd</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
