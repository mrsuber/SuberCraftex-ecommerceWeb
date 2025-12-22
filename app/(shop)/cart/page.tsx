import { CartItems } from "@/components/cart/CartItems";
import { CartSummary } from "@/components/cart/CartSummary";

export const metadata = {
  title: "Shopping Cart - SuberCraftex",
  description: "Review your cart and proceed to checkout",
};

export default function CartPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="container">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <CartItems />
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </main>
  );
}
