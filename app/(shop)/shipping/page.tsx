import { Card, CardContent } from "@/components/ui/card";
import {
  Truck,
  Clock,
  MapPin,
  Package,
  Globe,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export const metadata = {
  title: "Shipping Information | SuberCraftex",
  description:
    "Learn about SuberCraftex shipping options, delivery times, and policies",
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shipping{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Information
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fast, reliable delivery to your doorstep. Learn about our shipping
            options and policies.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Fast Delivery</h3>
              <p className="text-xs text-muted-foreground">Quick processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Order Tracking</h3>
              <p className="text-xs text-muted-foreground">Real-time updates</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Secure Packaging</h3>
              <p className="text-xs text-muted-foreground">Safe arrival</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Insured Shipping</h3>
              <p className="text-xs text-muted-foreground">Full protection</p>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Delivery Options */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Delivery Options</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Truck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Standard Delivery</h3>
                    <p className="text-muted-foreground mb-2">
                      Our standard shipping option delivers your order within
                      5-7 business days. This is available for all products and
                      locations within our delivery zones.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Shipping fees calculated at checkout based on location and
                      order weight.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Express Delivery</h3>
                    <p className="text-muted-foreground mb-2">
                      Need it faster? Express delivery gets your order to you
                      within 2-3 business days. Available for select locations.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Additional fees apply for express shipping.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Globe className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">
                      Custom Tailoring Delivery
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      For custom-made items from our tailoring services,
                      delivery times vary based on the complexity of your order.
                      Estimated delivery will be provided when your order is
                      ready.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing Times */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Processing Times</h2>
              <p className="text-muted-foreground mb-4">
                Orders are processed within 1-2 business days after payment
                confirmation. Processing times do not include weekends or public
                holidays.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Processing Schedule</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    <strong>Monday - Friday:</strong> Orders placed before 2 PM
                    are processed the same day
                  </li>
                  <li>
                    <strong>Saturday - Sunday:</strong> Orders processed on the
                    next business day
                  </li>
                  <li>
                    <strong>Public Holidays:</strong> Orders processed on the
                    next business day
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Order Tracking */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>
              <p className="text-muted-foreground mb-4">
                Stay informed about your order every step of the way:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  You'll receive an email confirmation once your order is placed
                </li>
                <li>
                  A shipping confirmation with tracking details is sent when
                  your order ships
                </li>
                <li>
                  Track your package in real-time through the SuberCraftex app
                  or website
                </li>
                <li>Receive notifications for delivery updates and arrival</li>
              </ul>
            </CardContent>
          </Card>

          {/* Delivery Areas */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Delivery Areas</h2>
              <p className="text-muted-foreground mb-4">
                We currently deliver to locations within our service areas.
                Delivery availability and shipping costs are determined at
                checkout based on your delivery address.
              </p>
              <p className="text-muted-foreground">
                If your area is not currently covered, please contact our
                customer support team to discuss alternative arrangements.
              </p>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                <h2 className="text-2xl font-bold">Important Information</h2>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  Please ensure your delivery address is accurate and complete
                </li>
                <li>
                  Someone should be available to receive the package at the
                  delivery address
                </li>
                <li>
                  Additional charges may apply for re-delivery attempts or
                  address changes
                </li>
                <li>
                  Delivery times may be affected by weather conditions, public
                  holidays, or other unforeseen circumstances
                </li>
                <li>
                  For high-value orders, signature confirmation may be required
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact for Shipping Issues */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about shipping or need assistance with
                your delivery, our customer support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Contact Support
                </a>
                <a
                  href="/faq"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  View FAQ
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
