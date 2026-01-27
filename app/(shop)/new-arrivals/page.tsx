import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "New Arrivals | SuberCraftex",
  description: "Discover the latest products and collections at SuberCraftex",
};

export default function NewArrivalsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            New{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Arrivals
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Be the first to discover our latest products and exclusive
            collections. Fresh styles added regularly.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Fresh Styles</h3>
              <p className="text-sm text-muted-foreground">
                New products added weekly to keep your wardrobe updated
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Early Access</h3>
              <p className="text-sm text-muted-foreground">
                Members get first access to new arrivals before anyone else
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Trending Now</h3>
              <p className="text-sm text-muted-foreground">
                Curated selection of the hottest trends in fashion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Message */}
        <Card>
          <CardContent className="p-12 text-center">
            <Sparkles className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">
              Exciting New Products Coming Soon!
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              We're constantly adding new products to our collection. Browse our
              current catalog to see what's available, or check back soon for
              the latest arrivals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/catalog">Browse All Products</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/categories">Shop by Category</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
