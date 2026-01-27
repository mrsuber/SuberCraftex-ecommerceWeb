import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Scale,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Globe,
} from "lucide-react";

export const metadata = {
  title: "Terms of Service | SuberCraftex",
  description:
    "Read the terms and conditions for using SuberCraftex services",
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Service
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully before using our services.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 27, 2025
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Clear Terms</h3>
              <p className="text-sm text-muted-foreground">
                Straightforward terms for using our platform
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Scale className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Fair Practices</h3>
              <p className="text-sm text-muted-foreground">
                We believe in fair and transparent business
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Your Protection</h3>
              <p className="text-sm text-muted-foreground">
                Terms designed to protect both parties
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Terms Content */}
        <div className="space-y-8">
          {/* Agreement */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                1. Agreement to Terms
              </h2>
              <p className="text-muted-foreground mb-4">
                Welcome to SuberCraftex. SuberCraftex is a brand and service
                operated and incubated by{" "}
                <strong>Camsol Technologies Ltd</strong>, a duly registered
                company. These Terms of Service ("Terms") govern your access to
                and use of the SuberCraftex mobile application, website, and
                related services (collectively, the "Services").
              </p>
              <p className="text-muted-foreground mb-4">
                By accessing or using our Services, you agree to be bound by
                these Terms. If you do not agree to these Terms, you may not
                access or use the Services.
              </p>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. Changes
                will be effective immediately upon posting. Your continued use
                of the Services after any changes constitutes acceptance of the
                modified Terms.
              </p>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">2. Eligibility</h2>
              <p className="text-muted-foreground mb-4">
                To use our Services, you must:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Be at least 18 years old, or the age of majority in your jurisdiction</li>
                <li>Have the legal capacity to enter into a binding agreement</li>
                <li>Not be prohibited from using the Services under applicable laws</li>
                <li>Provide accurate and complete registration information</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                If you are using the Services on behalf of an organization, you
                represent that you have authority to bind that organization to
                these Terms.
              </p>
            </CardContent>
          </Card>

          {/* Account Registration */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                3. Account Registration
              </h2>
              <p className="text-muted-foreground mb-4">
                To access certain features, you may need to create an account.
                When creating an account, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information as needed</li>
                <li>Keep your login credentials secure and confidential</li>
                <li>Notify us immediately of any unauthorized account access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We reserve the right to suspend or terminate accounts that
                violate these Terms or engage in fraudulent activity.
              </p>
            </CardContent>
          </Card>

          {/* Products and Services */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                4. Products and Services
              </h2>

              <h3 className="text-lg font-semibold mb-3">4.1 Product Sales</h3>
              <p className="text-muted-foreground mb-4">
                We offer various products for purchase through our platform.
                Product descriptions, images, and prices are provided for
                informational purposes. While we strive for accuracy, we do not
                warrant that product descriptions or other content is accurate,
                complete, or error-free.
              </p>

              <h3 className="text-lg font-semibold mb-3">
                4.2 Tailoring Services
              </h3>
              <p className="text-muted-foreground mb-4">
                We provide custom tailoring services including onsite tailoring,
                custom production, and collect-and-repair services. Service
                bookings are subject to availability and may require additional
                terms specific to the service type.
              </p>

              <h3 className="text-lg font-semibold mb-3">4.3 Pricing</h3>
              <p className="text-muted-foreground">
                All prices are displayed in the applicable currency and are
                subject to change without notice. We reserve the right to refuse
                or cancel orders if pricing errors occur.
              </p>
            </CardContent>
          </Card>

          {/* Orders and Payments */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                5. Orders and Payments
              </h2>

              <h3 className="text-lg font-semibold mb-3">5.1 Order Placement</h3>
              <p className="text-muted-foreground mb-4">
                When you place an order, you are making an offer to purchase.
                All orders are subject to acceptance and availability. We
                reserve the right to refuse or cancel any order for any reason.
              </p>

              <h3 className="text-lg font-semibold mb-3">5.2 Payment</h3>
              <p className="text-muted-foreground mb-4">
                Payment must be made at the time of purchase using the available
                payment methods. You represent that you have the legal right to
                use any payment method provided. All payments are processed
                securely through third-party payment providers.
              </p>

              <h3 className="text-lg font-semibold mb-3">
                5.3 Service Deposits
              </h3>
              <p className="text-muted-foreground">
                Certain tailoring services may require deposits or partial
                payments. Deposit requirements and payment schedules will be
                clearly communicated during the booking process.
              </p>
            </CardContent>
          </Card>

          {/* Shipping and Delivery */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                6. Shipping and Delivery
              </h2>
              <p className="text-muted-foreground mb-4">
                We offer delivery services for products and completed service
                items. Delivery times are estimates and may vary based on
                location and other factors.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Risk of loss passes to you upon delivery</li>
                <li>You are responsible for providing accurate delivery information</li>
                <li>Additional charges may apply for certain delivery locations</li>
                <li>We are not liable for delays caused by shipping carriers or circumstances beyond our control</li>
              </ul>
            </CardContent>
          </Card>

          {/* Returns and Refunds */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">7. Returns and Refunds</h2>
              <p className="text-muted-foreground mb-4">
                Our return and refund policies vary by product type and service:
              </p>

              <h3 className="text-lg font-semibold mb-3">7.1 Product Returns</h3>
              <p className="text-muted-foreground mb-4">
                Eligible products may be returned within the specified return
                period. Items must be unused, in original packaging, and
                accompanied by proof of purchase. Certain items may be
                non-returnable.
              </p>

              <h3 className="text-lg font-semibold mb-3">
                7.2 Custom Services
              </h3>
              <p className="text-muted-foreground">
                Custom-made items and tailoring services are generally
                non-refundable once production has begun. Cancellation policies
                and any applicable refunds will be communicated during the
                booking process.
              </p>
            </CardContent>
          </Card>

          {/* User Conduct */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">8. User Conduct</h2>
              <p className="text-muted-foreground mb-4">
                When using our Services, you agree not to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Submit false or misleading information</li>
                <li>Engage in fraudulent activities</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the Services</li>
                <li>Use the Services to distribute malware or harmful content</li>
                <li>Harass, abuse, or harm other users or our staff</li>
                <li>Use automated systems to access the Services without permission</li>
              </ul>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                9. Intellectual Property
              </h2>
              <p className="text-muted-foreground mb-4">
                The Services and all content, features, and functionality
                (including but not limited to text, graphics, logos, images, and
                software) are owned by Camsol Technologies Ltd or its licensors
                and are protected by intellectual property laws.
              </p>
              <p className="text-muted-foreground">
                You may not copy, modify, distribute, sell, or lease any part of
                our Services or content without explicit written permission.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimer of Warranties */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                <h2 className="text-2xl font-bold">
                  10. Disclaimer of Warranties
                </h2>
              </div>
              <p className="text-muted-foreground mb-4">
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT
                NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
                FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-muted-foreground">
                We do not warrant that the Services will be uninterrupted,
                error-free, or free of viruses or other harmful components.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                11. Limitation of Liability
              </h2>
              <p className="text-muted-foreground mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CAMSOL TECHNOLOGIES LTD
                AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE
                LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICES.
              </p>
              <p className="text-muted-foreground">
                Our total liability for any claims arising from these Terms or
                the Services shall not exceed the amount you paid to us in the
                twelve (12) months preceding the claim.
              </p>
            </CardContent>
          </Card>

          {/* Indemnification */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">12. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless Camsol Technologies
                Ltd, its affiliates, officers, directors, employees, and agents
                from any claims, damages, losses, liabilities, and expenses
                (including attorney's fees) arising from your use of the
                Services, violation of these Terms, or infringement of any
                third-party rights.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance
                with the laws of the jurisdiction in which Camsol Technologies
                Ltd is registered, without regard to conflict of law principles.
                Any disputes arising from these Terms shall be resolved in the
                courts of that jurisdiction.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">14. Termination</h2>
              <p className="text-muted-foreground mb-4">
                We may terminate or suspend your access to the Services
                immediately, without prior notice or liability, for any reason,
                including if you breach these Terms.
              </p>
              <p className="text-muted-foreground">
                Upon termination, your right to use the Services will cease
                immediately. Provisions that by their nature should survive
                termination shall survive, including ownership provisions,
                warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </CardContent>
          </Card>

          {/* Severability */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">15. Severability</h2>
              <p className="text-muted-foreground">
                If any provision of these Terms is found to be unenforceable or
                invalid, that provision shall be modified to the minimum extent
                necessary to make it enforceable, or if modification is not
                possible, severed from these Terms. The remaining provisions
                shall continue in full force and effect.
              </p>
            </CardContent>
          </Card>

          {/* Contact Us */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">16. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please
                contact us:
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
                  <FileText className="h-5 w-5 text-primary" />
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
