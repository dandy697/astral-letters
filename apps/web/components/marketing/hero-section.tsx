import Link from "next/link";
import { ArrowRight, ShieldCheck, Stars, WandSparkles } from "lucide-react";
import { ctas } from "@/lib/demo-content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NewsletterMockup } from "@/components/marketing/newsletter-mockup";
import { PDFMockup } from "@/components/marketing/pdf-mockup";
import { MotionFade } from "@/components/marketing/motion-fade";

export function HeroSection() {
  return (
    <section className="container-shell grid gap-10 py-10 md:grid-cols-[1.06fr_0.94fr] md:py-14">
      <MotionFade className="flex flex-col justify-center">
        <div className="flex flex-wrap gap-3">
          <Badge variant="soft">Thème astral réel</Badge>
          <Badge variant="gold">Amour • Travail • Énergie</Badge>
        </div>
        <h1 className="mt-6 text-[clamp(3.2rem,8vw,6.8rem)] leading-[0.92] tracking-[-0.06em]">
          Recevez vos prévisions astrologiques <span className="text-gradient">vraiment personnalisées.</span>
        </h1>
        <p className="section-copy mt-6 max-w-2xl text-lg">
          À partir de votre vraie date, heure et lieu de naissance, recevez des prévisions personnelles en amour, travail et énergie, avec des jours clés et des conseils concrets.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="#capture">
              {ctas.heroPrimary}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="#tarifs">{ctas.heroSecondary}</Link>
          </Button>
        </div>
        <div className="mt-8 flex flex-col gap-3 font-sans text-sm text-[var(--muted)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[var(--success)]" />
            Vos données servent uniquement à personnaliser votre analyse.
          </div>
          <div className="flex items-center gap-2">
            <Stars className="h-4 w-4 text-[var(--accent-strong)]" />
            Soleil, Lune, Ascendant, transits et thèmes du moment.
          </div>
          <div className="flex items-center gap-2">
            <WandSparkles className="h-4 w-4 text-[var(--gold)]" />
            Un premier aperçu offert, puis des analyses plus complètes si vous souhaitez aller plus loin.
          </div>
        </div>
      </MotionFade>

      <MotionFade delay={0.08} className="grid gap-5 self-start">
        <NewsletterMockup />
        <PDFMockup />
      </MotionFade>
    </section>
  );
}
