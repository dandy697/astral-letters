import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { Header } from "@/components/marketing/header";
import { PricingCard } from "@/components/marketing/pricing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { pricingPlans, oneShotOffer, trustPoints } from "@/lib/demo-content";
import { buildCheckoutLink } from "@/lib/checkout";

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="py-12 md:py-20 bg-[var(--background)]">
        <div className="container-shell">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="eyebrow mb-4">Nos offres</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Choisissez votre niveau de lecture.
            </h1>
            <p className="text-lg text-[var(--muted)] leading-relaxed">
              Trois formules pour accompagner vos décisions au quotidien, basées
              sur votre thème natal réel. Sans engagement.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.slug} {...plan} />
            ))}
          </div>

          {/* One-shot */}
          <Card variant="dark" className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 max-w-5xl mx-auto relative overflow-hidden mb-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] blur-[100px] opacity-10 -mr-20 -mt-20" />
            <div className="relative z-10">
              <Badge variant="gold" className="mb-4">Paiement unique</Badge>
              <h3 className="text-3xl font-bold tracking-tight text-white mb-3">
                {oneShotOffer.name} — {oneShotOffer.price}
              </h3>
              <p className="text-white/70 text-sm max-w-md leading-relaxed">
                {oneShotOffer.description}
              </p>
            </div>
            <Button asChild variant="gold" size="lg" className="shrink-0 relative z-10">
              <Link href={buildCheckoutLink({ offer: oneShotOffer.slug })}>
                {oneShotOffer.cta}
              </Link>
            </Button>
          </Card>

          {/* Trust */}
          <div className="text-center space-y-6">
            <div className="flex flex-wrap justify-center gap-8">
              {trustPoints.map((point) => (
                <span key={point} className="text-sm text-[var(--muted)] flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                  {point}
                </span>
              ))}
            </div>
            <Button asChild variant="outline">
              <Link href="/#capture">
                Essayer gratuitement d&apos;abord
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
