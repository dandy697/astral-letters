import { Body, Button, Container, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";

export function EmailTemplateWrapper({
  preview,
  eyebrow = "Astral Letters",
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  children,
  footerNote = "Vous recevez cet email car vous avez demandé une analyse personnalisée sur Astral Letters."
}: {
  preview: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  children: React.ReactNode;
  footerNote?: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#fbf7f2", color: "#17142a", margin: 0, fontFamily: "Georgia, serif" }}>
        <Container style={{ maxWidth: "620px", margin: "0 auto", padding: "28px 18px 40px" }}>
          <Section
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid rgba(63,45,98,0.12)",
              borderRadius: "28px",
              padding: "34px 30px",
              boxShadow: "0 18px 48px rgba(31,20,59,0.08)"
            }}
          >
            <Text style={{ color: "#6d6884", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>{eyebrow}</Text>
            <Text style={{ fontSize: "34px", lineHeight: "40px", margin: "18px 0 10px", color: "#17142a" }}>{title}</Text>
            {subtitle ? <Text style={{ fontSize: "16px", lineHeight: "28px", color: "#6d6884", margin: "0 0 24px" }}>{subtitle}</Text> : null}
            {children}
            {ctaLabel && ctaHref ? (
              <Section style={{ marginTop: "28px", marginBottom: "8px" }}>
                <Button
                  href={ctaHref}
                  style={{
                    background: "linear-gradient(135deg, #3f2d62 0%, #6d4ed3 100%)",
                    backgroundColor: "#3f2d62",
                    color: "#fdf8ff",
                    textDecoration: "none",
                    fontWeight: 700,
                    borderRadius: "999px",
                    padding: "14px 22px"
                  }}
                >
                  {ctaLabel}
                </Button>
              </Section>
            ) : null}
            <Hr style={{ borderColor: "rgba(63,45,98,0.12)", margin: "28px 0" }} />
            <Text style={{ fontSize: "13px", lineHeight: "22px", color: "#6d6884", margin: 0 }}>{footerNote}</Text>
            <Text style={{ fontSize: "13px", lineHeight: "22px", color: "#6d6884", margin: "8px 0 0" }}>
              Se désinscrire • Gérer mes préférences
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
