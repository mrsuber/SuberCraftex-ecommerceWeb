"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-20 md:py-32">
      {/* Background decoration with gold glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <AnimateOnScroll delay={0.1}>
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/30 gold-glow">
                Premium Collection 2025
              </span>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.2}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Discover Luxury{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Redefined
                </span>
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.3}>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Experience premium quality products with seamless shopping, secure
                payments, and real-time delivery tracking. Your journey to
                excellence starts here.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="group gold-glow hover:shadow-lg hover:shadow-primary/30 transition-all" asChild>
                  <Link href="/catalog">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary/60 hover:bg-primary/5" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </AnimateOnScroll>

            {/* Stats */}
            <AnimateOnScroll delay={0.5}>
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-primary/20">
                <div>
                  <div className="text-3xl font-bold gold-text">10K+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold gold-text">50K+</div>
                  <div className="text-sm text-muted-foreground">Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold gold-text">99%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction</div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right: Image/Visual */}
          <AnimateOnScroll delay={0.3} variant="scaleIn" className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted/50">
              {/* Product Grid */}
              <div className="grid grid-cols-2 gap-4 p-6 h-full">
                <div className="space-y-4">
                  <div className="aspect-square rounded-xl overflow-hidden relative">
                    <Image
                      src="/images/products/smartwatch-1.jpg"
                      alt="Premium Smartwatch"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-[3/2] rounded-xl overflow-hidden relative">
                    <Image
                      src="/images/products/tshirt-1.jpg"
                      alt="Designer T-Shirt"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-[3/2] rounded-xl overflow-hidden relative">
                    <Image
                      src="/images/products/lamp-1.jpg"
                      alt="Modern Lamp"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden relative">
                    <Image
                      src="/images/products/book-1.jpg"
                      alt="Classic Book"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Overlay text */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent flex items-end justify-center pb-8">
                <div className="text-center space-y-2">
                  <p className="text-xl font-semibold">Premium Collection</p>
                  <p className="text-sm text-muted-foreground">Curated with excellence</p>
                </div>
              </div>
            </div>

            {/* Floating elements with gold glow */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-4 -right-4 gold-gradient text-primary-foreground px-4 py-2 rounded-lg shadow-lg gold-glow border border-primary/40"
            >
              <div className="text-sm font-semibold">Free Shipping</div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg shadow-lg gold-glow border border-secondary/40"
            >
              <div className="text-sm font-semibold">24/7 Support</div>
            </motion.div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
