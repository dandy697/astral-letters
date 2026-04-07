import { Heart, Sparkles, TrendingUp } from "lucide-react";
import { demoUser } from "@/lib/demo-content";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ResultPreviewCard({
  firstName = demoUser.firstName,
  sun = demoUser.sun,
  moon = demoUser.moon,
  ascendant = demoUser.ascendant,
  love = demoUser.love,
  work = demoUser.work,
  wellbeing = demoUser.energy,
  keyDays = demoUser.keyDays
}: {
  firstName?: string;
  sun?: string;
  moon?: string;
  ascendant?: string;
  love?: string;
  work?: string;
  wellbeing?: string;
  keyDays?: readonly string[];
}) {
  return (
    <Card variant="premium" className="p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="soft">Aperçu gratuit</Badge>
        <Badge variant="gold">Calculé à partir de vos données</Badge>
      </div>
      <h1 className="mt-6 text-[clamp(2.6rem,6vw,4.4rem)] leading-[0.96] tracking-[-0.05em]">
        {firstName}, voici votre première lecture.
      </h1>
      <p className="section-copy mt-5">
        Soleil {sun}, Lune {moon}, Ascendant {ascendant}. Voici votre base de lecture : une combinaison qui éclaire vos élans, votre sensibilité et votre façon d’entrer dans le monde.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { icon: Heart, title: "Amour", body: love },
          { icon: TrendingUp, title: "Travail", body: work },
          { icon: Sparkles, title: "Énergie", body: wellbeing }
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-[26px] border border-[var(--border)] bg-white/80 p-5">
            <Icon className="h-5 w-5 text-[var(--accent-strong)]" />
            <p className="mt-4 text-2xl">{title}</p>
            <p className="font-sans mt-3 text-sm leading-7 text-[var(--muted)]">{body}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-[26px] bg-[var(--primary)] px-6 py-5 text-[var(--primary-foreground)]">
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-white/70">Jours à retenir</p>
        <p className="mt-2 text-2xl">{keyDays.join(" • ")}</p>
      </div>
    </Card>
  );
}
