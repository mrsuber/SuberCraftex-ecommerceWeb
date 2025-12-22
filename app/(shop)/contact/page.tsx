import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | SuberCraftex",
  description: "Get in touch with SuberCraftex customer support",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to our customer
            support team.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Send us an email anytime
                  </p>
                  <a
                    href="mailto:support@subercraftex.com"
                    className="text-primary hover:underline"
                  >
                    support@subercraftex.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Mon-Fri from 8am to 6pm
                  </p>
                  <a
                    href="tel:+237653255547"
                    className="text-primary hover:underline"
                  >
                    +237 653 255 547
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Office</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Visit our headquarters
                  </p>
                  <p className="text-sm">
                    Clerks-Quarters, Buea
                    <br />
                    Southwest, Cameroon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Business Hours</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    We're available during
                  </p>
                  <p className="text-sm">
                    Monday - Friday: 8am - 6pm EST
                    <br />
                    Saturday: 9am - 4pm EST
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">
                How long does shipping take?
              </h3>
              <p className="text-muted-foreground text-sm">
                Standard shipping typically takes 3-5 business days. Express
                shipping is available for delivery within 1-2 business days.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What is your return policy?</h3>
              <p className="text-muted-foreground text-sm">
                We offer a 30-day return policy on most items. Products must be
                in their original condition with all tags attached.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Do you ship internationally?
              </h3>
              <p className="text-muted-foreground text-sm">
                Yes, we ship to most countries worldwide. International shipping
                rates and delivery times vary by location.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How can I track my order?</h3>
              <p className="text-muted-foreground text-sm">
                Once your order ships, you'll receive a tracking number via
                email. You can use this to track your package in real-time with
                GPS tracking.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
