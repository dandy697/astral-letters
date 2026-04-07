import type Stripe from "stripe";
import { SubscriptionStatus } from "@prisma/client";
import type { AstroChart } from "@/lib/astro";
import { prisma } from "@/lib/prisma";
import { createPremiumReportFromChart } from "@/lib/reports";

function mapStripeSubscriptionStatus(status: string | null | undefined): SubscriptionStatus {
  switch (status) {
    case "active":
      return SubscriptionStatus.ACTIVE;
    case "trialing":
      return SubscriptionStatus.TRIALING;
    case "past_due":
      return SubscriptionStatus.PAST_DUE;
    case "canceled":
    case "unpaid":
      return SubscriptionStatus.CANCELED;
    default:
      return SubscriptionStatus.INCOMPLETE;
  }
}

async function getOfferFromMetadata(metadata: Stripe.Metadata | null | undefined) {
  const offerSlug = metadata?.offerSlug;
  if (!offerSlug) {
    return null;
  }

  return prisma.offer.findUnique({ where: { slug: offerSlug } });
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!session.customer_details?.email) {
    return;
  }

  const offer = await getOfferFromMetadata(session.metadata);
  const email = session.customer_details.email;
  const firstName = session.metadata?.firstName ?? session.customer_details.name?.split(" ")[0] ?? "Client";

  const user = await prisma.user.upsert({
    where: { email },
    update: { firstName },
    create: { email, firstName }
  });

  if (offer) {
    await prisma.payment.upsert({
      where: {
        stripeCheckoutId: session.id
      },
      update: {
        offerId: offer.id,
        userId: user.id,
        amountCents: session.amount_total ?? offer.priceMonthlyCents ?? offer.oneShotPriceCents ?? 0,
        currency: session.currency ?? "eur",
        status: session.payment_status ?? "completed"
      },
      create: {
        userId: user.id,
        offerId: offer.id,
        stripeCheckoutId: session.id,
        stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
        amountCents: session.amount_total ?? offer.priceMonthlyCents ?? offer.oneShotPriceCents ?? 0,
        currency: session.currency ?? "eur",
        status: session.payment_status ?? "completed"
      }
    });
  }

  if (offer && session.mode === "subscription" && typeof session.subscription === "string") {
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: session.subscription },
      update: {
        userId: user.id,
        offerId: offer.id,
        stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
        status: SubscriptionStatus.TRIALING
      },
      create: {
        userId: user.id,
        offerId: offer.id,
        stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
        stripeSubscriptionId: session.subscription,
        status: SubscriptionStatus.TRIALING
      }
    });
  }

  await prisma.lead.updateMany({
    where: { email, convertedAt: null },
    data: { convertedAt: new Date() }
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "stripe.checkout.completed",
      entityType: "checkout_session",
      entityId: session.id,
      payload: session as unknown as object
    }
  });

  if (offer && ["premium", "rapport-natal"].includes(offer.slug)) {
    const natalChart = await prisma.natalChart.findUnique({ where: { userId: user.id } });
    if (natalChart) {
      await createPremiumReportFromChart({
        userId: user.id,
        firstName: user.firstName,
        chart: natalChart.chartJson as AstroChart
      });
    }
  }
}

export async function handleSubscriptionChanged(subscription: Stripe.Subscription) {
  const offer = await getOfferFromMetadata(subscription.metadata);

  if (!offer) {
    return;
  }

  const customerId = typeof subscription.customer === "string" ? subscription.customer : null;

  if (!customerId) {
    return;
  }

  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
    include: { user: true }
  });

  const email =
    subscription.metadata.email ||
    existing?.user.email;

  if (!email) {
    return;
  }

  const user = existing?.user ?? (await prisma.user.findUnique({ where: { email } }));
  if (!user) {
    return;
  }

  const periodEnd = "current_period_end" in subscription && typeof subscription.current_period_end === "number"
    ? subscription.current_period_end
    : null;

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    update: {
      offerId: offer.id,
      userId: user.id,
      stripeCustomerId: customerId,
      status: mapStripeSubscriptionStatus(subscription.status),
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    },
    create: {
      offerId: offer.id,
      userId: user.id,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      status: mapStripeSubscriptionStatus(subscription.status),
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    }
  });
}

export async function handleInvoiceStatus(invoice: Stripe.Invoice) {
  const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : null;

  if (!subscriptionId) {
    return;
  }

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: invoice.status === "paid" ? SubscriptionStatus.ACTIVE : SubscriptionStatus.PAST_DUE
    }
  });
}
