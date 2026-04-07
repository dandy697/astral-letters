import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";

export function DifferentiationSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Différenciation"
          title="Pourquoi Astral Letters est différent"
          description="Ici, vos analyses ne partent pas d’un signe général, mais d’un thème astral calculé à partir de vos propres données de naissance."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card variant="glass" className="p-7 md:p-8">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Horoscope générique</p>
            <ul className="font-sans mt-6 space-y-3 text-sm leading-7 text-[var(--muted)]">
              <li>Un signe pour tout le monde.</li>
              <li>Peu de nuance, peu de contexte.</li>
              <li>Conseils vagues ou interchangeables.</li>
              <li>Valeur perçue faible, fidélisation fragile.</li>
            </ul>
          </Card>
          <Card variant="premium" className="p-7 md:p-8">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--accent-strong)]">Astral Letters</p>
            <ul className="font-sans mt-6 space-y-3 text-sm leading-7 text-[var(--foreground)]">
              <li>Lecture fondée sur votre thème natal réel.</li>
              <li>Soleil, Lune, Ascendant, maisons et transits visibles.</li>
              <li>Guidance claire en amour, travail et énergie.</li>
              <li>Objet éditorial premium pensé pour être relu et conservé.</li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}
