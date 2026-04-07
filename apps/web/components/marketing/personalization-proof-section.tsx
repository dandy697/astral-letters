import { Fingerprint, MapPinned, MoonStar, UserRoundSearch } from "lucide-react";
import { personalizationProof } from "@/lib/demo-content";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";

const icons = [UserRoundSearch, MapPinned, MoonStar, Fingerprint];

export function PersonalizationProofSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Preuve de personnalisation"
          title="Ce n’est pas un horoscope générique."
          description="Votre date, votre heure et votre lieu de naissance servent à calculer une base réelle, ensuite traduite en une lecture claire et personnelle."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {personalizationProof.map((item, index) => {
            const Icon = icons[index];
            return (
              <Card variant="glass" className="p-6" key={item.title}>
                <div className="inline-flex rounded-2xl bg-[var(--accent-soft)] p-3">
                  <Icon className="h-5 w-5 text-[var(--accent-strong)]" />
                </div>
                <h3 className="mt-5 text-2xl leading-tight">{item.title}</h3>
                <p className="font-sans mt-3 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
