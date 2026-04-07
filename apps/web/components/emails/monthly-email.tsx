import { Section, Text } from "@react-email/components";
import { EmailTemplateWrapper } from "@/components/emails/email-template-wrapper";

export function MonthlyEmail({
  firstName,
  sections,
  subject
}: {
  firstName: string;
  sections: Record<string, string>;
  subject?: string;
}) {
  return (
    <EmailTemplateWrapper
      preview="Votre guidance mensuelle vous attend"
      title={subject ?? `${firstName}, votre guidance mensuelle`}
      subtitle="Une lecture claire, premium et directement utile."
      ctaLabel="Accéder à mon espace"
      ctaHref="https://astralletters.app/resultat"
    >
      {Object.entries(sections).map(([title, content]) => (
        <Section key={title} style={{ borderTop: "1px solid rgba(63,45,98,0.12)", paddingTop: "18px", marginTop: "18px" }}>
          <Text style={{ margin: 0, fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", color: "#6d4ed3" }}>{title}</Text>
          <Text style={{ margin: "10px 0 0", fontSize: "16px", lineHeight: "28px", color: "#6d6884" }}>{content}</Text>
        </Section>
      ))}
    </EmailTemplateWrapper>
  );
}
