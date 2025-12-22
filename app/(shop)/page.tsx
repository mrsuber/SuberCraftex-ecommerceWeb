import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { CTA } from "@/components/landing/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <Features />
      <CTA />
    </main>
  );
}
