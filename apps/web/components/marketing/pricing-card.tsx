"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buildCheckoutLink } from "@/lib/checkout";

type PricingCardProps = {
  slug: string;
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: readonly string[];
  cta: string;
  badge?: string;
  highlight?: boolean;
  reportId?: string;
};

export function PricingCard({
  slug,
  name,
  price,
  cadence,
  description,
  features,
  cta,
  badge,
  highlight = false,
  reportId,
}: PricingCardProps) {
  const checkoutHref = reportId 
    ? buildCheckoutLink({ offer: slug, reportId })
    : "#capture";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative rounded-2xl p-8 md:p-10 flex flex-col transition-all duration-300 ${
        highlight
          ? "bg-[#3A1F3D] shadow-xl shadow-[var(--primary-glow)] scale-[1.02] border-2 border-[#3A1F3D]"
          : "bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:shadow-md"
      }`}
      style={highlight ? { color: "#FFFFFF" } : undefined}
    >
      {badge && (
        <Badge
          variant={highlight ? "gold" : "soft"}
          className="absolute -top-3 left-6"
        >
          {badge}
        </Badge>
      )}

      <div className="mb-6">
        <h3
          className={`text-xl font-bold mb-2 ${
            highlight ? "text-white" : "text-[var(--foreground)]"
          }`}
        >
          {name}
        </h3>
        <p
          className={`text-sm leading-relaxed ${
            highlight ? "text-white/70" : "text-[var(--muted)]"
          }`}
        >
          {description}
        </p>
      </div>

      <div className="mb-8">
        <span
          className={`text-5xl font-extrabold tracking-tight ${
            highlight ? "text-white" : "text-[var(--foreground)]"
          }`}
        >
          {price}
        </span>
        <span
          className={`text-base ml-1 ${
            highlight ? "text-white/60" : "text-[var(--muted)]"
          }`}
        >
          {cadence}
        </span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              className={`h-4 w-4 mt-0.5 shrink-0 ${
                highlight ? "text-[var(--accent)]" : "text-[var(--success)]"
              }`}
            />
            <span
              className={`text-sm ${
                highlight ? "text-white/90" : "text-[var(--foreground)]"
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        variant={highlight ? "gold" : "default"}
        size="lg"
        className="w-full"
      >
        <Link href={checkoutHref}>{cta}</Link>
      </Button>
    </motion.div>
  );
}
