import { faqItems } from "@/lib/demo-content";
import { Accordion } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/marketing/section-heading";

export function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="container-shell">
        <SectionHeading
          eyebrow="FAQ"
          title="Les réponses qui rassurent avant l’achat."
          description="Retrouvez ici les réponses aux questions les plus fréquentes sur la personnalisation, l’abonnement et la confidentialité."
        />
        <div className="mt-10">
          <Accordion items={faqItems} />
        </div>
      </div>
    </section>
  );
}
