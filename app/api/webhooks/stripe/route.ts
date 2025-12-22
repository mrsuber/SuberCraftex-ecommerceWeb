import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Update order status
        const { error } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            status: "processing",
            paid_at: new Date().toISOString(),
            stripe_charge_id: paymentIntent.latest_charge as string,
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        if (error) {
          console.error("Error updating order:", error);
        } else {
          console.log("Order updated successfully for payment intent:", paymentIntent.id);
        }

        // TODO: Send order confirmation email
        // TODO: Update inventory

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Update order status
        await supabase
          .from("orders")
          .update({
            payment_status: "failed",
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        console.log("Payment failed for:", paymentIntent.id);

        // TODO: Send payment failed email

        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;

        // Update order status
        await supabase
          .from("orders")
          .update({
            payment_status: "refunded",
            status: "refunded",
          })
          .eq("stripe_charge_id", charge.id);

        console.log("Refund processed for charge:", charge.id);

        // TODO: Send refund confirmation email
        // TODO: Restore inventory

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook handler failed" },
      { status: 500 }
    );
  }
}
