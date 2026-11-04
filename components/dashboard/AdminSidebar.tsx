"use client";

import { useEffect, useState } from "react";
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
  UserPlus,
  TrendingUp,
  Clock,
  Wallet,
  MessageSquare,
  GraduationCap,
  Newspaper,
  Smartphone,
  HardDrive,
  CalendarDays,
  Banknote,
  Receipt,
  ClipboardList,
  CalendarClock,
  Landmark,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}
interface NavSection {
  title?: string;
  items: NavItem[];
}

/** The admin menu, grouped the way the business runs */
const adminNavigation: NavSection[] = [
  {
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Jobs", href: "/dashboard/jobs", icon: ClipboardList },
      { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
      { name: "Staff schedule", href: "/dashboard/schedule", icon: CalendarDays },
    ],
  },
  {
    title: "Services",
    items: [
      { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
      { name: "Services", href: "/dashboard/services", icon: Wrench },
      { name: "Working hours", href: "/dashboard/services/hours", icon: CalendarClock },
      { name: "Service categories", href: "/dashboard/service-categories", icon: Tags },
      { name: "Materials", href: "/dashboard/materials", icon: Boxes },
      { name: "Upcoming services", href: "/dashboard/upcoming-services", icon: Clock },
      { name: "Device repairs", href: "/dashboard/repair-requests", icon: Smartphone },
      { name: "Technicians", href: "/dashboard/technicians", icon: HardDrive },
    ],
  },
  {
    title: "Shop",
    items: [
      { name: "Point of Sale", href: "/dashboard/pos", icon: CreditCard },
      { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
      { name: "Products", href: "/dashboard/products", icon: Package },
      { name: "Categories", href: "/dashboard/categories", icon: FolderTree },
      { name: "Customers", href: "/dashboard/customers", icon: Users },
      { name: "Reviews", href: "/dashboard/reviews", icon: Star },
      { name: "Shipping", href: "/dashboard/shipping", icon: Truck },
    ],
  },
  {
    title: "Money",
    items: [
      { name: "Finance", href: "/dashboard/finance", icon: Landmark },
      { name: "Payroll", href: "/dashboard/payroll", icon: Banknote },
      { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { name: "Suppliers", href: "/dashboard/suppliers", icon: Building2 },
      { name: "Purchase orders", href: "/dashboard/purchase-orders", icon: FileText },
    ],
  },
  {
    title: "Investors",
    items: [
      { name: "Investors", href: "/dashboard/investors", icon: TrendingUp },
      { name: "Investor engine", href: "/dashboard/investor-engine", icon: HardDrive },
      { name: "Pending deposits", href: "/dashboard/pending-deposits", icon: Wallet },
      { name: "Investor feedback", href: "/dashboard/feedback", icon: MessageSquare },
    ],
  },
  {
    title: "Training",
    items: [
      { name: "Apprentices", href: "/dashboard/apprentices", icon: GraduationCap },
      { name: "Apprentice fees", href: "/dashboard/apprentice-fees", icon: Receipt },
    ],
  },
  {
    title: "Website",
    items: [
      { name: "Hero banners", href: "/dashboard/hero-banners", icon: Image },
      { name: "Blog posts", href: "/dashboard/blog", icon: Newspaper },
    ],
  },
  { title: "System", items: [{ name: "Settings", href: "/dashboard/settings", icon: Settings }] },
];

const driverNavigation: NavSection[] = [{ items: [{ name: "Orders", href: "/dashboard/orders", icon: ShoppingCart }] }];

const cashierNavigation: NavSection[] = [{ items: [{ name: "Point of Sale", href: "/dashboard/pos", icon: CreditCard }] }];

const tailorNavigation: NavSection[] = [
  {
    items: [
      { name: "Overview", href: "/dashboard/tailor", icon: LayoutDashboard },
      { name: "My jobs", href: "/dashboard/jobs", icon: ClipboardList },
      { name: "Walk-in order", href: "/dashboard/tailor/walk-in", icon: UserPlus },
      { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
      { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
      { name: "Measurements", href: "/dashboard/tailor/measurements", icon: Ruler },
      { name: "Fittings", href: "/dashboard/tailor/fittings", icon: Scissors },
      { name: "Materials", href: "/dashboard/materials", icon: Boxes },
    ],
  },
];

const technicianNavigation: NavSection[] = [
  {
    items: [
      { name: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
      { name: "My jobs", href: "/dashboard/jobs", icon: ClipboardList },
      { name: "Record a job", href: "/dashboard/bookings/new", icon: UserPlus },
      { name: "My device repairs", href: "/dashboard/technician/repairs", icon: Smartphone },
      { name: "My apprentices", href: "/dashboard/technician/apprentices", icon: GraduationCap },
      { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
    ],
  },
];

interface AdminSidebarProps {
  userRole: string;
}

/** The menu entry the current page belongs to: the longest matching link, so only one is lit */
function activeHref(sections: NavSection[], pathname: string | null) {
  if (!pathname) return null;
  let best: string | null = null;
  for (const s of sections)
    for (const item of s.items) {
      const match = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
      if (match && (!best || item.href.length > best.length)) best = item.href;
    }
  return best;
}

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const sections =
    userRole === "driver" ? driverNavigation :
    userRole === "cashier" ? cashierNavigation :
    userRole === "tailor" ? tailorNavigation :
    userRole === "technician" ? technicianNavigation :
    adminNavigation;
  const dashboardTitle =
    userRole === "driver" ? "Driver Dashboard" :
    userRole === "cashier" ? "Cashier Dashboard" :
    userRole === "tailor" ? "Tailor Dashboard" :
    userRole === "technician" ? "Technician Dashboard" :
    "Admin Dashboard";
  const active = activeHref(sections, pathname);

  // Close the phone menu after moving to another page
  useEffect(() => setOpen(false), [pathname]);

  const nav = (
    <nav className="space-y-4 px-3 pb-8" aria-label="Dashboard">
      {sections.map((section, i) => (
        <div key={section.title ?? i} className="space-y-1">
          {section.title && <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">{section.title}</p>}
          {section.items.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === active;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  const brand = (
    <div className="p-6 pb-4">
      <Link href="/dashboard" className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-[#B8924F]">SuberCraftex</span>
      </Link>
      <p className="mt-1 text-xs text-muted-foreground">{dashboardTitle}</p>
    </div>
  );

  return (
    <>
      {/* Wide screens: a fixed column */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r bg-white lg:block dark:bg-neutral-950">
        {brand}
        {nav}
      </aside>

      {/* Phones and tablets: a menu button and a drawer */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-3 text-sm font-medium text-white shadow-lg lg:hidden"
        aria-label="Open the menu"
      >
        <Menu className="h-4 w-4" /> Menu
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-white shadow-xl dark:bg-neutral-950">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-md p-2 hover:bg-muted"
              aria-label="Close the menu"
            >
              <X className="h-5 w-5" />
            </button>
            {brand}
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
