import { NewsletterMockup } from "@/components/marketing/newsletter-mockup";
import { PDFMockup } from "@/components/marketing/pdf-mockup";
import { SectionHeading } from "@/components/marketing/section-heading";

export function PreviewSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Aperçu visuel"
          title="Découvrez le format de vos futures analyses."
          description="Une newsletter élégante à lire en quelques minutes, et un rapport PDF détaillé pour garder vos repères du mois."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <NewsletterMockup />
          <PDFMockup />
        </div>
      </div>
    </section>
  );
}
