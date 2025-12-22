import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SuberCraftex - Premium E-Commerce",
  description:
    "Discover premium products with SuberCraftex - Your trusted luxury shopping destination",
  keywords: [
    "e-commerce",
    "luxury",
    "premium products",
    "online shopping",
    "SuberCraftex",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider defaultTheme="system" storageKey="subercraftex-theme">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
