import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, UserCheck, Mail, Globe } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | SuberCraftex",
  description:
    "Learn how SuberCraftex collects, uses, and protects your personal information",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we
            collect, use, and protect your information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 27, 2025
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Data Protection</h3>
              <p className="text-sm text-muted-foreground">
                Your data is encrypted and securely stored
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Transparency</h3>
              <p className="text-sm text-muted-foreground">
                We clearly explain how we use your information
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <UserCheck className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Your Control</h3>
              <p className="text-sm text-muted-foreground">
                You have control over your personal data
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Policy Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground mb-4">
                Welcome to SuberCraftex. SuberCraftex is a brand and service
                operated and incubated by{" "}
                <strong>Camsol Technologies Ltd</strong>, a registered company.
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our mobile application,
                website, and services.
              </p>
              <p className="text-muted-foreground">
                By using SuberCraftex, you agree to the collection and use of
                information in accordance with this policy. If you do not agree
                with the terms of this privacy policy, please do not access the
                application or website.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-semibold mb-3">
                2.1 Personal Information
              </h3>
              <p className="text-muted-foreground mb-4">
                We may collect personally identifiable information that you
                voluntarily provide when registering, making purchases, or using
                our services, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                <li>Name and contact information (email, phone number)</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely by payment providers)</li>
                <li>Account credentials</li>
                <li>Body measurements (for tailoring services)</li>
                <li>Profile photos and preferences</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3">
                2.2 Automatically Collected Information
              </h3>
              <p className="text-muted-foreground mb-4">
                When you access our services, we may automatically collect:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                <li>Device information (device type, operating system, unique device identifiers)</li>
                <li>Log data (IP address, browser type, pages visited, time spent)</li>
                <li>Location data (with your consent, for delivery services)</li>
                <li>Usage patterns and preferences</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3">
                2.3 Information from Third Parties
              </h3>
              <p className="text-muted-foreground">
                We may receive information about you from third-party services
                if you choose to link your account or authenticate using social
                media platforms.
              </p>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We use the collected information for various purposes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>To process and fulfill your orders and service bookings</li>
                <li>To create and manage your account</li>
                <li>To provide customer support and respond to inquiries</li>
                <li>To send order confirmations, updates, and delivery notifications</li>
                <li>To process payments securely</li>
                <li>To personalize your shopping experience</li>
                <li>To send promotional communications (with your consent)</li>
                <li>To improve our products, services, and user experience</li>
                <li>To detect and prevent fraud or unauthorized activities</li>
                <li>To comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-muted-foreground mb-4">
                We do not sell your personal information. We may share your
                information in the following circumstances:
              </p>

              <h3 className="text-lg font-semibold mb-3">Service Providers</h3>
              <p className="text-muted-foreground mb-4">
                We may share information with third-party vendors who perform
                services on our behalf, such as payment processing, delivery
                services, and customer support.
              </p>

              <h3 className="text-lg font-semibold mb-3">Business Partners</h3>
              <p className="text-muted-foreground mb-4">
                For tailoring services, relevant information may be shared with
                our partner tailors to fulfill your service requests.
              </p>

              <h3 className="text-lg font-semibold mb-3">Legal Requirements</h3>
              <p className="text-muted-foreground">
                We may disclose information if required by law, court order, or
                government regulation, or if we believe disclosure is necessary
                to protect our rights, your safety, or the safety of others.
              </p>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational security
                measures to protect your personal information, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication mechanisms</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and employee training</li>
                <li>Secure payment processing through trusted providers</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                However, no method of transmission over the Internet or
                electronic storage is 100% secure. While we strive to protect
                your information, we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information for as long as necessary to
                fulfill the purposes outlined in this policy, unless a longer
                retention period is required or permitted by law. When your
                information is no longer needed, we will securely delete or
                anonymize it.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate
                  data
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  data
                </li>
                <li>
                  <strong>Portability:</strong> Request transfer of your data to
                  another service
                </li>
                <li>
                  <strong>Opt-out:</strong> Unsubscribe from marketing
                  communications
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Withdraw previously given
                  consent
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, please contact us using the
                information provided below.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our services are not intended for children under the age of 13.
                We do not knowingly collect personal information from children
                under 13. If you are a parent or guardian and believe your child
                has provided us with personal information, please contact us
                immediately, and we will take steps to delete such information.
              </p>
            </CardContent>
          </Card>

          {/* Third-Party Links */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">9. Third-Party Links</h2>
              <p className="text-muted-foreground">
                Our services may contain links to third-party websites or
                services. We are not responsible for the privacy practices of
                these third parties. We encourage you to review the privacy
                policies of any third-party sites you visit.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                10. Changes to This Policy
              </h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the "Last updated" date. We encourage you to review
                this policy periodically for any changes.
              </p>
            </CardContent>
          </Card>

          {/* Contact Us */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Camsol Technologies Ltd</p>
                    <p className="text-sm text-muted-foreground">
                      (Operating SuberCraftex)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <a
                    href="mailto:support@subercraftex.com"
                    className="text-primary hover:underline"
                  >
                    support@subercraftex.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-primary" />
                  <a
                    href="https://camsoltechnology.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    camsoltechnology.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
