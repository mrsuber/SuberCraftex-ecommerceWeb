"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";

export function CTA() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />

      <div className="container relative z-10">
        <AnimateOnScroll
          variant="scaleIn"
          className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm border"
        >
          <AnimateOnScroll delay={0.1}>
            <h2 className="text-4xl md:text-6xl font-bold">
              Ready to Start Shopping?
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers. Experience premium quality,
              secure payments, and fast delivery today.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group" asChild>
                <Link href="/catalog">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.4} variant="fadeIn">
            <div className="text-sm text-muted-foreground">
              No credit card required • Free shipping on first order • 30-day returns
            </div>
          </AnimateOnScroll>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
