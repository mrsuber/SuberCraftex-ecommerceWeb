import { Card, CardContent } from "@/components/ui/card";
import { Percent, Tag, Bell, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Sale | SuberCraftex",
  description:
    "Shop amazing deals and discounts on premium products at SuberCraftex",
};

export default function SalePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Sale
            </span>{" "}
            & Offers
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing deals on premium products. Quality at unbeatable
            prices.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <Percent className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Big Discounts</h3>
              <p className="text-xs text-muted-foreground">
                Up to 50% off select items
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Tag className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Flash Sales</h3>
              <p className="text-xs text-muted-foreground">
                Limited time offers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Bell className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Sale Alerts</h3>
              <p className="text-xs text-muted-foreground">
                Get notified of deals
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <ShoppingBag className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Bundle Deals</h3>
              <p className="text-xs text-muted-foreground">
                Save more when you buy more
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Sales Message */}
        <Card>
          <CardContent className="p-12 text-center">
            <Percent className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Sales Coming Soon!</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              We're preparing some amazing deals for you. In the meantime,
              browse our catalog for great products at competitive prices.
              Subscribe to our newsletter to be the first to know about upcoming
              sales!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/catalog">Shop Now</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/new-arrivals">View New Arrivals</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Why Shop With Us */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Why Shop Our Sales?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Quality Assured</h3>
                <p className="text-muted-foreground">
                  All sale items maintain our high quality standards. Discounted
                  price, not discounted quality.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">
                  Same Great Service
                </h3>
                <p className="text-muted-foreground">
                  Sale items come with the same warranty, returns policy, and
                  customer support as full-price items.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">
                  Genuine Discounts
                </h3>
                <p className="text-muted-foreground">
                  Our sales offer real savings. We never inflate prices before a
                  sale to make discounts look bigger.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
