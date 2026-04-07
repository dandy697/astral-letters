import { Section, Text } from "@react-email/components";
import { EmailTemplateWrapper } from "@/components/emails/email-template-wrapper";

export function FreePdfEmail({ firstName, downloadHref }: { firstName: string; downloadHref: string }) {
  return (
    <EmailTemplateWrapper
      preview="Voici votre premier rapport personnalisé"
      title={`${firstName}, votre PDF découverte est disponible`}
      subtitle="Un premier aperçu premium, pensé pour être lu facilement et donner envie d’aller plus loin."
      ctaLabel="Télécharger le PDF"
      ctaHref={downloadHref}
    >
      <Section style={{ border: "1px solid rgba(63,45,98,0.12)", borderRadius: "22px", padding: "18px 20px" }}>
        <Text style={{ margin: 0, fontSize: "16px", lineHeight: "28px", color: "#17142a" }}>
          À l’intérieur: votre profil astral de base, un aperçu du mois et un avant-goût du niveau de personnalisation Astral Letters.
        </Text>
      </Section>
      <Text style={{ fontSize: "16px", lineHeight: "28px", color: "#6d6884", margin: "18px 0 0" }}>
        Si vous souhaitez débloquer la lecture complète, vos jours clés et votre PDF mensuel haut de gamme, les abonnements sont juste après.
      </Text>
    </EmailTemplateWrapper>
  );
}
