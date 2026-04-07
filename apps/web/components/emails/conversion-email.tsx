import { Section, Text } from "@react-email/components";
import { EmailTemplateWrapper } from "@/components/emails/email-template-wrapper";

export function ConversionEmail({ firstName }: { firstName: string }) {
  return (
    <EmailTemplateWrapper
      preview="Débloquez vos lectures complètes et vos jours clés"
      title={`${firstName}, allez plus loin avec vos prévisions personnalisées`}
      subtitle="Le gratuit vous montre la promesse. Le payant vous donne le rythme, la profondeur et le vrai confort de lecture."
      ctaLabel="Voir les offres"
      ctaHref="https://astralletters.app/#tarifs"
    >
      <Section style={{ backgroundColor: "#f7f2ff", borderRadius: "22px", padding: "18px 20px" }}>
        <Text style={{ margin: 0, fontSize: "16px", lineHeight: "28px", color: "#17142a" }}>
          Plus de jours clés, plus de contexte, plus de précision en amour, travail et énergie, et un PDF premium pour conserver votre lecture.
        </Text>
      </Section>
      <Text style={{ fontSize: "16px", lineHeight: "28px", color: "#6d6884", margin: "18px 0 0" }}>
        Essentiel pour la clarté mensuelle, Plus pour le rythme hebdomadaire, Premium pour l’expérience éditoriale complète.
      </Text>
    </EmailTemplateWrapper>
  );
}
