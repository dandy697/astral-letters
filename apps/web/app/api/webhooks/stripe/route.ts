import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { handleCheckoutCompleted, handleInvoiceStatus, handleSubscriptionChanged } from "@/lib/stripe-sync";

export async function POST(request: Request) {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const signature = (await headers()).get("stripe-signature");
  const payload = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ received: true, skipped: true });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await handleSubscriptionChanged(event.data.object);
      break;
    case "invoice.paid":
    case "invoice.payment_failed":
      await handleInvoiceStatus(event.data.object);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
