import Link from "next/link";
import { Gift, MailCheck, ShieldCheck } from "lucide-react";
import { ctas } from "@/lib/demo-content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/marketing/section-heading";

export function FreeOfferSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-shell">
        <Card variant="tinted" className="p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Offre gratuite"
                title="Commencez par un premier aperçu personnalisé."
                description="Recevez votre profil de base, une lecture du moment et un premier aperçu de ce que vos analyses peuvent vous apporter."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Gift, title: "Mini profil personnalisé", body: "Votre signature Soleil, Lune, Ascendant et une première lecture du moment." },
                { icon: MailCheck, title: "Accès immédiat", body: "Votre première analyse arrive rapidement, avec un format clair et agréable à lire." },
                { icon: ShieldCheck, title: "Email de bienvenue", body: "Un récapitulatif simple, rassurant et facile à retrouver dans votre boîte mail." },
                { icon: Gift, title: "Aperçu du rapport", body: "Un extrait de vos analyses pour découvrir le style, la profondeur et l’utilité du service." }
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-[26px] bg-white/80 p-5 shadow-[var(--shadow-soft)]">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[var(--accent-soft)] p-3">
                      <Icon className="h-5 w-5 text-[var(--accent-strong)]" />
                    </div>
                    <Badge variant="soft">Inclus</Badge>
                  </div>
                  <h3 className="mt-5 text-2xl leading-tight">{title}</h3>
                  <p className="font-sans mt-3 text-sm leading-7 text-[var(--muted)]">{body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="#capture">{ctas.freePrimary}</Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
