import { Section, Text } from "@react-email/components";
import { EmailTemplateWrapper } from "@/components/emails/email-template-wrapper";

export function WeeklyEmail({
  firstName,
  intro,
  keyDays
}: {
  firstName: string;
  intro: string;
  keyDays: string[];
}) {
  return (
    <EmailTemplateWrapper
      preview="Les jours à retenir et votre guidance personnalisée"
      title={`${firstName}, vos énergies de la semaine`}
      subtitle="Un format court pour ajuster vos priorités avec plus de netteté."
      ctaLabel="Voir ma lecture complète"
      ctaHref="https://astralletters.app/resultat"
    >
      <Text style={{ fontSize: "16px", lineHeight: "28px", color: "#6d6884", margin: 0 }}>{intro}</Text>
      <Section style={{ backgroundColor: "#f7f2ff", borderRadius: "22px", padding: "18px 20px", marginTop: "18px" }}>
        <Text style={{ margin: 0, fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", color: "#6d4ed3" }}>Jours clés</Text>
        <Text style={{ margin: "10px 0 0", fontSize: "16px", lineHeight: "28px", color: "#17142a" }}>{keyDays.join(" • ")}</Text>
      </Section>
    </EmailTemplateWrapper>
  );
}
