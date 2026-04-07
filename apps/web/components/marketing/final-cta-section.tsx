import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ctas } from "@/lib/demo-content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FinalCTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-shell">
        <Card variant="premium" className="overflow-hidden p-8 md:p-12">
          <div className="max-w-3xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Dernier appel</p>
            <h2 className="section-title mt-5">
              Recevez des prévisions qui prennent vraiment votre thème en compte.
            </h2>
            <p className="section-copy mt-5">
              Commencez par votre premier aperçu, puis choisissez si vous souhaitez recevoir vos lectures chaque mois, chaque semaine, ou dans un rapport plus détaillé.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="#capture">
                  {ctas.finalPrimary}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="font-sans mt-4 text-sm text-[var(--muted)]">Sans engagement long terme. Désabonnement simple. Confidentialité respectée.</p>
          </div>
        </Card>
      </div>
    </section>
  );
}
