import { Suspense } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { PayOrderClient } from "./PayOrderClient";

export const metadata = {
  title: "Pay for your order - SuberCraftex",
  description: "Pay with MTN Mobile Money or Orange Money",
};

export default function PayOrderPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="container max-w-xl px-4">
          <Suspense fallback={null}>
            <PayOrderClient />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
