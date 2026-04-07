import { HeartHandshake, MailOpen, Sparkles, WalletCards } from "lucide-react";
import { benefits } from "@/lib/demo-content";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";

const icons = [MailOpen, Sparkles, WalletCards, HeartHandshake];

export function BenefitsSection() {
  return (
    <section id="benefices" className="py-16 md:py-24">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Ce que vous recevez"
          title="Tout ce qu’il faut pour mieux lire votre période."
          description="Chaque envoi vous aide à comprendre vos cycles, anticiper les moments importants et avancer avec plus de clarté."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Card variant="premium" className="p-6" key={benefit.title}>
                <div className="inline-flex rounded-2xl bg-[var(--background-soft)] p-3">
                  <Icon className="h-5 w-5 text-[var(--accent-strong)]" />
                </div>
                <h3 className="mt-5 text-2xl leading-tight">{benefit.title}</h3>
                <p className="font-sans mt-3 text-sm leading-7 text-[var(--muted)]">{benefit.body}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
