import Link from "next/link";
import { pricingPlans, oneShotOffer } from "@/lib/demo-content";
import { PricingCard } from "@/components/marketing/pricing-card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PricingSection() {
  return (
    <section id="tarifs" className="py-16 md:py-24">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Tarifs"
          title="Choisissez la formule qui vous correspond."
          description="Que vous vouliez un repère mensuel simple ou un accompagnement plus complet, chaque formule vous apporte un niveau de lecture supplémentaire."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.slug} {...plan} />
          ))}
        </div>
        <Card variant="premium" className="mt-6 p-7 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Achat one-shot</p>
              <h3 className="mt-3 text-4xl leading-tight">{oneShotOffer.name} — {oneShotOffer.price}</h3>
              <p className="section-copy mt-4 text-base">{oneShotOffer.description}</p>
            </div>
            <Button asChild size="lg" variant="secondary">
              <Link href={`/api/checkout?offer=${oneShotOffer.slug}`}>{oneShotOffer.cta}</Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
