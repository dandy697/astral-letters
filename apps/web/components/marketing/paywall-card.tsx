import Link from "next/link";
import { LockKeyhole, Sparkles } from "lucide-react";
import { pricingPlans } from "@/lib/demo-content";
import { buildCheckoutLink } from "@/lib/checkout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PaywallCard({ reportId, email }: { reportId?: string | null; email?: string | null }) {
  return (
    <Card variant="tinted" className="relative overflow-hidden p-6 md:p-8">
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute inset-x-0 top-24 h-40 bg-gradient-to-b from-white/30 via-white/80 to-[rgba(248,245,241,0.98)] backdrop-blur-[6px]" />
      <div className="relative z-[1]">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="soft">Lecture complète verrouillée</Badge>
          <Badge variant="gold">Accès premium</Badge>
        </div>
        <h2 className="mt-5 text-4xl leading-tight tracking-[-0.04em]">
          Débloquez votre lecture complète.
        </h2>
        <p className="section-copy mt-4">
          Retrouvez la suite de votre lecture, vos jours clés, vos conseils concrets et, selon votre formule, vos prochaines analyses chaque semaine ou chaque mois.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan) => {
            const isHighlighted = "highlight" in plan && Boolean(plan.highlight);
            const badge = "badge" in plan ? plan.badge : undefined;

            return (
              <div
                key={plan.slug}
                className={`rounded-[24px] border p-5 shadow-[var(--shadow-soft)] ${
                  isHighlighted
                    ? "border-[rgba(58,31,61,0.18)] bg-white shadow-[0_22px_54px_rgba(58,31,61,0.12)]"
                    : "border-[rgba(58,31,61,0.1)] bg-white/92"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-2xl">{plan.name}</p>
                  {badge ? <Badge variant="gold">{badge}</Badge> : null}
                </div>
                <p className="mt-3 text-4xl tracking-[-0.05em]">
                  {plan.price}
                  <span className="font-sans ml-2 text-sm text-[var(--muted)]">{plan.cadence}</span>
                </p>
                <p className="font-sans mt-3 text-sm leading-7 text-[var(--muted)]">{plan.description}</p>
                <Button asChild className="mt-5 w-full" variant={isHighlighted ? "default" : "secondary"}>
                  <Link href={buildCheckoutLink({ offer: plan.slug, reportId, email })}>
                    {isHighlighted ? <Sparkles className="mr-2 h-4 w-4" /> : <LockKeyhole className="mr-2 h-4 w-4" />}
                    Débloquer ma lecture complète
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
