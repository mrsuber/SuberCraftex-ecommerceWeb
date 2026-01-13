"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center gap-2">
            <Image
              src="/logos/subercraftex_goldfullLogo.svg"
              alt="SuberCraftex"
              width={180}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </div>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/catalog" className="text-sm font-medium transition-colors hover:text-primary">Catalog</Link>
          <Link href="/services" className="text-sm font-medium transition-colors hover:text-primary">Services</Link>
          <Link href="/bookings" className="text-sm font-medium transition-colors hover:text-primary">Bookings</Link>
          <Link href="/categories" className="text-sm font-medium transition-colors hover:text-primary">Categories</Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">About</Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">Contact</Link>
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/account">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Link>
          </Button>
          <CartButton />
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container flex flex-col space-y-4 py-4">
            <Link href="/catalog" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Catalog</Link>
            <Link href="/services" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Services</Link>
            <Link href="/bookings" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Bookings</Link>
            <Link href="/categories" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function CartButton() {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            suppressHydrationWarning
          >
            {itemCount}
          </Badge>
        )}
        <span className="sr-only">Shopping cart</span>
      </Link>
    </Button>
  );
}
