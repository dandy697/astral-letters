import { Text } from "@react-email/components";
import { EmailTemplateWrapper } from "@/components/emails/email-template-wrapper";

export function CartReminderEmail({ firstName }: { firstName: string }) {
  return (
    <EmailTemplateWrapper
      preview="Finalisez votre accès à vos prévisions personnalisées"
      title={`${firstName}, votre lecture complète vous attend`}
      subtitle="Vos jours clés, votre guidance détaillée et votre PDF premium sont prêts à être débloqués."
      ctaLabel="Finaliser mon accès"
      ctaHref="https://astralletters.app/#tarifs"
    >
      <Text style={{ fontSize: "16px", lineHeight: "28px", color: "#6d6884", margin: 0 }}>
        Si vous hésitez encore, retenez ceci: Astral Letters transforme votre thème natal en contenu clair, premium et immédiatement utile. Sans jargon inutile, sans engagement long terme.
      </Text>
    </EmailTemplateWrapper>
  );
}
