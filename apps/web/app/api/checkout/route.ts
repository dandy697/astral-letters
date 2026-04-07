import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, stripePriceMap } from "@/lib/stripe";
import { env } from "@/lib/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offer = searchParams.get("offer") ?? "plus";
  const reportId = searchParams.get("report");
  const email = searchParams.get("email");
  const priceId = stripePriceMap[offer];

  // Logic pour le développement ou si Stripe n'est pas configuré
  if (!stripe || !priceId) {
    if (process.env.NODE_ENV === "development" || !process.env.STRIPE_SECRET_KEY) {
      console.warn(`[CHECKOUT] Stripe not configured. Simulating success for offer: ${offer}`);
      
      // 1. Simuler handleCheckoutCompleted (normalement fait par le webhook)
      if (process.env.DATABASE_URL && email) {
        const { handleCheckoutCompleted } = await import("@/lib/stripe-sync");
        await handleCheckoutCompleted({
          id: `mock_session_${Date.now()}`,
          customer_details: { email },
          payment_status: "paid",
          amount_total: 700, // mock
          currency: "eur",
          metadata: { offerSlug: offer, reportId: reportId ?? "", firstName: "Ami" },
          mode: offer === "rapport-natal" ? "payment" : "subscription",
          subscription: offer !== "rapport-natal" ? `mock_sub_${Date.now()}` : null,
        } as any);
      }

      const mockSessionId = `mock_session_${Date.now()}`;
      const successUrl = `${env.NEXT_PUBLIC_APP_URL}/merci?status=success&offer=${offer}&session_id=${mockSessionId}${reportId ? `&report=${reportId}` : ""}`;
      
      return NextResponse.redirect(successUrl);
    }
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/#tarifs`);
  }

  // À ce stade, stripe est garanti d'être non-null par le check ci-dessus
  const isSubscription = offer !== "rapport-natal";
  const report = process.env.DATABASE_URL && reportId
    ? await prisma.generatedReport.findUnique({ where: { id: reportId }, include: { user: true } })
    : null;
  const customerEmail = report?.user.email ?? email ?? undefined;
  const firstName = report?.user.firstName;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: customerEmail,
      success_url: `${env.NEXT_PUBLIC_APP_URL}/merci?status=success&offer=${offer}&session_id={CHECKOUT_SESSION_ID}${reportId ? `&report=${reportId}` : ""}`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/merci?status=cancelled&offer=${offer}${reportId ? `&report=${reportId}` : ""}`,
      allow_promotion_codes: true,
      metadata: {
        offerSlug: offer,
        reportId: reportId ?? "",
        email: customerEmail ?? "",
        firstName: firstName ?? "",
        source: reportId ? "teaser" : "landing"
      },
      subscription_data: isSubscription
        ? {
            metadata: {
              offerSlug: offer,
              reportId: reportId ?? "",
              email: customerEmail ?? "",
              firstName: firstName ?? ""
            },
            trial_period_days: 7
          }
        : undefined
    });

    return NextResponse.redirect(session.url ?? `${env.NEXT_PUBLIC_APP_URL}/#tarifs`);
  } catch (error) {
    console.error("[CHECKOUT] Stripe error:", error);
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/#tarifs`);
  }
}
