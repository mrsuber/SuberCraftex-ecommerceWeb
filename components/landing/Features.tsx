"use client";

import { Truck, Shield, Clock, CreditCard, MapPin, Headphones } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on all orders over 25,000 FCFA. Fast and reliable delivery.",
    delay: 0.1,
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "PCI-compliant payment processing with Stripe. Your data is safe.",
    delay: 0.2,
  },
  {
    icon: MapPin,
    title: "GPS Tracking",
    description: "Track your order in real-time with live GPS updates.",
    delay: 0.3,
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Express shipping available. Get your order within 24 hours.",
    delay: 0.4,
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    description: "Pay with card or cash on delivery. Multiple payment options.",
    delay: 0.5,
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our customer support team is always here to help you.",
    delay: 0.6,
  },
];

export function Features() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <AnimateOnScroll className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SuberCraftex
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide the best shopping experience with premium features designed for your convenience.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimateOnScroll
              key={feature.title}
              delay={feature.delay}
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-l-primary/50">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
