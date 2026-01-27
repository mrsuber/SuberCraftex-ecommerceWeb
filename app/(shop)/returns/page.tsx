import { Card, CardContent } from "@/components/ui/card";
import {
  RotateCcw,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  AlertCircle,
} from "lucide-react";

export const metadata = {
  title: "Returns & Exchanges | SuberCraftex",
  description:
    "Learn about SuberCraftex return and exchange policies for products and services",
};

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Returns &{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Exchanges
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We want you to be completely satisfied with your purchase. Learn
            about our hassle-free return and exchange policy.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">14-Day Returns</h3>
              <p className="text-sm text-muted-foreground">
                Return eligible items within 14 days of delivery
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <RefreshCw className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Easy Exchanges</h3>
              <p className="text-sm text-muted-foreground">
                Swap for a different size, color, or product
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <RotateCcw className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Full Refunds</h3>
              <p className="text-sm text-muted-foreground">
                Get your money back for qualifying returns
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Return Policy */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Return Policy</h2>
              <p className="text-muted-foreground mb-4">
                We accept returns within 14 days of delivery for most products.
                To be eligible for a return, items must meet the following
                conditions:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Item must be unused and in the same condition you received it</li>
                <li>Item must be in its original packaging with all tags attached</li>
                <li>You must have proof of purchase (order confirmation or receipt)</li>
                <li>Item must not be a non-returnable product (see below)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Eligible vs Non-Eligible */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <h3 className="text-lg font-semibold">Eligible for Return</h3>
                </div>
                <ul className="text-muted-foreground space-y-2">
                  <li>Unworn clothing with tags attached</li>
                  <li>Accessories in original condition</li>
                  <li>Defective or damaged items</li>
                  <li>Items that don't match the description</li>
                  <li>Wrong items received</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="h-6 w-6 text-red-500" />
                  <h3 className="text-lg font-semibold">Non-Returnable Items</h3>
                </div>
                <ul className="text-muted-foreground space-y-2">
                  <li>Custom-made or altered items</li>
                  <li>Items marked as final sale</li>
                  <li>Intimate apparel and swimwear</li>
                  <li>Items without original tags</li>
                  <li>Used or worn items</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* How to Return */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">How to Return an Item</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Initiate Your Return</h3>
                    <p className="text-muted-foreground">
                      Log into your account and go to your order history. Select
                      the item you wish to return and click "Request Return."
                      You can also contact our customer support team.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Receive Return Instructions
                    </h3>
                    <p className="text-muted-foreground">
                      Once your return request is approved, you'll receive
                      detailed instructions on how to return your item,
                      including the return address and any necessary labels.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Package Your Item</h3>
                    <p className="text-muted-foreground">
                      Pack the item securely in its original packaging. Include
                      all original tags, accessories, and documentation.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Ship Your Return</h3>
                    <p className="text-muted-foreground">
                      Drop off your package at the designated shipping location.
                      Keep your tracking receipt until your refund is processed.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Receive Your Refund</h3>
                    <p className="text-muted-foreground">
                      Once we receive and inspect your return, we'll process
                      your refund within 5-7 business days. Refunds are issued
                      to the original payment method.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchanges */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Exchanges</h2>
              <p className="text-muted-foreground mb-4">
                Want a different size or color? We're happy to help with
                exchanges:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  Exchanges follow the same eligibility requirements as returns
                </li>
                <li>
                  If the new item costs more, you'll pay the difference
                </li>
                <li>
                  If the new item costs less, we'll refund the difference
                </li>
                <li>
                  Exchange requests are subject to availability
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Custom/Tailoring Services */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                <h2 className="text-2xl font-bold">
                  Custom & Tailoring Services
                </h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Due to the personalized nature of our custom tailoring services,
                the following policies apply:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Custom-made items</strong> are non-refundable once
                  production has begun
                </li>
                <li>
                  <strong>Alterations and repairs</strong> cannot be refunded
                  once completed
                </li>
                <li>
                  If there are defects or issues with workmanship, we will make
                  corrections at no additional cost
                </li>
                <li>
                  Cancellation before production begins may be subject to a
                  cancellation fee
                </li>
                <li>
                  Please review all measurements and specifications carefully
                  before confirming your order
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Refund Information */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Refund Information</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Package className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Processing Time</h3>
                    <p className="text-muted-foreground">
                      Refunds are processed within 5-7 business days after we
                      receive and inspect your return.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <RotateCcw className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Refund Method</h3>
                    <p className="text-muted-foreground">
                      Refunds are credited to the original payment method. Bank
                      processing times may vary.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Shipping Costs</h3>
                    <p className="text-muted-foreground">
                      Original shipping costs are non-refundable unless the
                      return is due to our error (defective item, wrong item
                      sent, etc.).
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Need Assistance?</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about returns or exchanges, our customer
                support team is ready to help.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
