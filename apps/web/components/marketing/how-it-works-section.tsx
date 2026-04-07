import { calculationSteps } from "@/lib/demo-content";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";

export function HowItWorksSection() {
  return (
    <section id="comment-ca-marche" className="py-16 md:py-24">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Comment ça marche"
          title="Recevez des analyses personnelles en quelques étapes."
          description="Tout commence par vos données de naissance, puis votre profil est calculé pour vous envoyer une lecture qui vous ressemble vraiment."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {calculationSteps.map((step, index) => (
            <Card variant={index === 2 ? "tinted" : "glass"} className="p-6" key={step.title}>
              <p className="font-sans text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Étape {index + 1}</p>
              <h3 className="mt-5 text-2xl leading-tight font-normal">{step.title.split('. ')[1] || step.title}</h3>
              <p className="mt-3 text-[var(--muted)] text-sm leading-relaxed">{step.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
