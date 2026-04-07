import Stripe from "stripe";
import { env } from "@/lib/env";

export const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" }) : null;

export const stripePriceMap: Record<string, string | undefined> = {
  essentiel: env.STRIPE_PRICE_ESSENTIEL,
  plus: env.STRIPE_PRICE_PLUS,
  premium: env.STRIPE_PRICE_PREMIUM,
  "rapport-natal": env.STRIPE_PRICE_NATAL
};
