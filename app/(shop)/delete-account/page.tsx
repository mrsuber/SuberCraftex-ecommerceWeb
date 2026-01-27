import { Card, CardContent } from "@/components/ui/card";
import { Trash2, AlertTriangle, Mail, Clock, Shield, FileX } from "lucide-react";

export const metadata = {
  title: "Delete Data & Account | SuberCraftex",
  description:
    "Request deletion of your data or SuberCraftex account",
};

export default function DeleteAccountPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Data{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Deletion
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Request deletion of specific data or your entire account
          </p>
        </div>

        {/* Two Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="border-primary/50">
            <CardContent className="p-6 text-center">
              <FileX className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Delete Specific Data</h3>
              <p className="text-sm text-muted-foreground">
                Remove specific data while keeping your account active
              </p>
            </CardContent>
          </Card>
          <Card className="border-red-500/50">
            <CardContent className="p-6 text-center">
              <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Delete Entire Account</h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Partial Data Deletion Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileX className="h-5 w-5 text-primary" />
              Delete Specific Data
            </h2>
            <p className="text-muted-foreground mb-4">
              You can request deletion of specific data while keeping your
              account active. This includes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Saved addresses</li>
              <li>Body measurements</li>
              <li>Order history</li>
              <li>Reviews you have submitted</li>
              <li>Wishlist items</li>
              <li>Profile photos</li>
              <li>Browsing preferences</li>
            </ul>
            <a
              href="mailto:support@subercraftex.com?subject=Data%20Deletion%20Request&body=I%20would%20like%20to%20request%20deletion%20of%20the%20following%20data%20from%20my%20SuberCraftex%20account%3A%0A%0ARegistered%20Email%3A%20%0A%0AData%20to%20delete%20(check%20all%20that%20apply)%3A%0A%5B%20%5D%20Saved%20addresses%0A%5B%20%5D%20Body%20measurements%0A%5B%20%5D%20Order%20history%0A%5B%20%5D%20Reviews%0A%5B%20%5D%20Wishlist%20items%0A%5B%20%5D%20Profile%20photos%0A%5B%20%5D%20Other%3A%20"
              className="inline-flex items-center justify-center w-full px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              Request Data Deletion
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

        {/* Full Account Deletion Section */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Trash2 className="h-6 w-6 text-red-500" />
          Delete Entire Account
        </h2>

        {/* Warning */}
        <Card className="mb-8 border-amber-500/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Before You Continue</h3>
                <p className="text-muted-foreground text-sm">
                  Deleting your account is permanent and cannot be undone. You
                  will lose access to:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                  <li>Your order history and receipts</li>
                  <li>Saved addresses and preferences</li>
                  <li>Wishlist and saved items</li>
                  <li>Service booking history</li>
                  <li>Reviews you have submitted</li>
                  <li>Any pending orders or bookings</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Gets Deleted */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Data That Will Be Deleted</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-3">
                <Trash2 className="h-4 w-4 text-primary" />
                Personal information (name, email, phone number)
              </li>
              <li className="flex items-center gap-3">
                <Trash2 className="h-4 w-4 text-primary" />
                Saved addresses
              </li>
              <li className="flex items-center gap-3">
                <Trash2 className="h-4 w-4 text-primary" />
                Body measurements (for tailoring services)
              </li>
              <li className="flex items-center gap-3">
                <Trash2 className="h-4 w-4 text-primary" />
                Profile photos
              </li>
              <li className="flex items-center gap-3">
                <Trash2 className="h-4 w-4 text-primary" />
                Wishlist and cart items
              </li>
              <li className="flex items-center gap-3">
                <Trash2 className="h-4 w-4 text-primary" />
                Account credentials
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Retention Notice */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-semibold mb-2">Data Retention Notice</h2>
                <p className="text-muted-foreground text-sm">
                  Some information may be retained for legal and business
                  purposes:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                  <li>
                    Transaction records (required for tax and accounting
                    purposes)
                  </li>
                  <li>
                    Order history may be anonymized and retained for business
                    records
                  </li>
                  <li>
                    Legal compliance data as required by applicable laws
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Time */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-semibold mb-2">Processing Time</h2>
                <p className="text-muted-foreground text-sm">
                  Account deletion requests are processed within 30 days. You
                  will receive a confirmation email once your account has been
                  deleted. During this period, you can contact us to cancel the
                  deletion request.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Form */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-4">Request Account Deletion</h2>
            <p className="text-muted-foreground mb-6">
              To request deletion of your account and associated data, please
              send an email to our support team with the subject line "Account
              Deletion Request" and include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Your registered email address</li>
              <li>Your full name as registered on the account</li>
              <li>Reason for deletion (optional)</li>
            </ul>

            <a
              href="mailto:support@subercraftex.com?subject=Account%20Deletion%20Request&body=I%20would%20like%20to%20request%20the%20deletion%20of%20my%20SuberCraftex%20account.%0A%0ARegistered%20Email%3A%20%0AFull%20Name%3A%20%0AReason%20(optional)%3A%20"
              className="inline-flex items-center justify-center w-full px-6 py-4 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              Request Account Deletion
            </a>

            <p className="text-xs text-muted-foreground text-center mt-4">
              By submitting this request, you confirm that you understand the
              deletion is permanent and irreversible.
            </p>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            For questions about data deletion, contact us at{" "}
            <a
              href="mailto:support@subercraftex.com"
              className="text-primary hover:underline"
            >
              support@subercraftex.com
            </a>
          </p>
          <p className="mt-2">
            SuberCraftex is operated by Camsol Technologies Ltd
          </p>
        </div>
      </div>
    </div>
  );
}
