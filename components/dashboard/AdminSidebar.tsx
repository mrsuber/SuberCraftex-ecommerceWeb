"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  Truck,
  Building2,
  FileText,
  FolderTree,
  Star,
  Wrench,
  Calendar,
  Tags,
  Image,
  Boxes,
  CreditCard,
  Scissors,
  Ruler,
  ClipboardCheck,
  UserPlus,
  TrendingUp,
  Clock,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Point of Sale",
    href: "/dashboard/pos",
    icon: CreditCard,
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
    icon: FolderTree,
  },
  {
    name: "Services",
    href: "/dashboard/services",
    icon: Wrench,
  },
  {
    name: "Service Categories",
    href: "/dashboard/service-categories",
    icon: Tags,
  },
  {
    name: "Materials",
    href: "/dashboard/materials",
    icon: Boxes,
  },
  {
    name: "Bookings",
    href: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    name: "Hero Banners",
    href: "/dashboard/hero-banners",
    icon: Image,
  },
  {
    name: "Upcoming Services",
    href: "/dashboard/upcoming-services",
    icon: Clock,
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    name: "Reviews",
    href: "/dashboard/reviews",
    icon: Star,
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    name: "Investors",
    href: "/dashboard/investors",
    icon: TrendingUp,
  },
  {
    name: "Pending Deposits",
    href: "/dashboard/pending-deposits",
    icon: Wallet,
  },
  {
    name: "Suppliers",
    href: "/dashboard/suppliers",
    icon: Building2,
  },
  {
    name: "Purchase Orders",
    href: "/dashboard/purchase-orders",
    icon: FileText,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Shipping",
    href: "/dashboard/shipping",
    icon: Truck,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const driverNavigation = [
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
];

const cashierNavigation = [
  {
    name: "Point of Sale",
    href: "/dashboard/pos",
    icon: CreditCard,
  },
];

const tailorNavigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Walk-In Order",
    href: "/dashboard/tailor/walk-in",
    icon: UserPlus,
  },
  {
    name: "Bookings",
    href: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    name: "Measurements",
    href: "/dashboard/tailor/measurements",
    icon: Ruler,
  },
  {
    name: "Fittings",
    href: "/dashboard/tailor/fittings",
    icon: Scissors,
  },
  {
    name: "Materials",
    href: "/dashboard/materials",
    icon: Boxes,
  },
];

interface AdminSidebarProps {
  userRole: string;
}

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname();
  const navigation =
    userRole === 'driver' ? driverNavigation :
    userRole === 'cashier' ? cashierNavigation :
    userRole === 'tailor' ? tailorNavigation :
    adminNavigation;
  const dashboardTitle =
    userRole === 'driver' ? 'Driver Dashboard' :
    userRole === 'cashier' ? 'Cashier Dashboard' :
    userRole === 'tailor' ? 'Tailor Dashboard' :
    'Admin Dashboard';

  return (
    <aside className="w-64 bg-background border-r min-h-screen sticky top-0">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SuberCraftex
          </span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">{dashboardTitle}</p>
      </div>

      <nav className="px-3 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
