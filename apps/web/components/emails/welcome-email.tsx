import { Section, Text } from "@react-email/components";
import { EmailTemplateWrapper } from "@/components/emails/email-template-wrapper";

export function WelcomeEmail({
  firstName,
  sun,
  moon,
  ascendant,
  summary
}: {
  firstName: string;
  sun: string;
  moon: string;
  ascendant: string;
  summary: string;
}) {
  return (
    <EmailTemplateWrapper
      preview="Découvrez votre premier aperçu personnalisé"
      title={`${firstName}, votre analyse astrologique personnalisée est prête`}
      subtitle="Une première lecture élégante, construite à partir de votre thème natal réel."
      ctaLabel="Voir mon analyse"
      ctaHref="https://astralletters.app/resultat"
    >
      <Section style={{ backgroundColor: "#f7f2ff", borderRadius: "22px", padding: "18px 20px", marginBottom: "20px" }}>
        <Text style={{ margin: 0, fontSize: "13px", textTransform: "uppercase", letterSpacing: "2px", color: "#6d4ed3" }}>
          Signature astrale
        </Text>
        <Text style={{ margin: "10px 0 0", fontSize: "16px", lineHeight: "28px", color: "#17142a" }}>
          Soleil {sun} • Lune {moon} • Ascendant {ascendant}
        </Text>
      </Section>
      <Text style={{ fontSize: "16px", lineHeight: "28px", color: "#6d6884", margin: 0 }}>{summary}</Text>
      <Text style={{ fontSize: "16px", lineHeight: "28px", color: "#6d6884", margin: "18px 0 0" }}>
        La version premium ajoute vos jours clés, votre lecture complète amour / travail / énergie et votre PDF personnel du mois.
      </Text>
    </EmailTemplateWrapper>
  );
}
