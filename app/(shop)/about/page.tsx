import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Users, Award, TrendingUp } from "lucide-react";

export const metadata = {
  title: "About Us | SuberCraftex",
  description: "Learn more about SuberCraftex and our mission",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SuberCraftex
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your trusted destination for premium e-commerce excellence
          </p>
        </div>

        {/* Story Section */}
        <div className="prose dark:prose-invert max-w-none mb-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                SuberCraftex was founded with a simple mission: to provide
                customers with access to premium products through a seamless,
                secure, and enjoyable shopping experience.
              </p>
              <p className="text-muted-foreground mb-4">
                We believe that online shopping should be more than just
                transactions. It should be an experience that delights,
                inspires, and builds trust. That's why we've invested in
                cutting-edge technology, secure payment systems, and real-time
                tracking to ensure every order is handled with care.
              </p>
              <p className="text-muted-foreground">
                Today, we serve thousands of customers worldwide, offering a
                curated selection of products that meet our high standards for
                quality and value.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Customers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">99%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">5 Years</div>
              <div className="text-sm text-muted-foreground">Experience</div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Quality First</h3>
                <p className="text-muted-foreground">
                  We carefully curate every product to ensure it meets our high
                  standards for quality and value.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Customer Focused
                </h3>
                <p className="text-muted-foreground">
                  Your satisfaction is our priority. We're here 24/7 to support
                  you throughout your shopping journey.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Innovation Driven
                </h3>
                <p className="text-muted-foreground">
                  We continuously improve our platform with the latest
                  technology to enhance your experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
