import { demoUser } from "@/lib/demo-content";
import { PdfSectionBlock } from "@/components/pdf/pdf-section-block";

export function FreeTeaserPdfTemplate({
  firstName = demoUser.firstName,
  summary = demoUser.summary
}: {
  firstName?: string;
  summary?: string;
}) {
  return (
    <div style={{ background: "#fbf7f2", padding: "32px", color: "#17142a", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto", display: "grid", gap: "22px" }}>
        <section
          style={{
            minHeight: "320px",
            borderRadius: "34px",
            padding: "34px",
            background: "linear-gradient(180deg, #ffffff 0%, #f6f1ff 100%)",
            border: "1px solid rgba(63,45,98,0.12)"
          }}
        >
          <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", color: "#6d6884" }}>Astral Letters • PDF teaser gratuit</div>
          <h1 style={{ fontSize: "46px", lineHeight: 1.05, margin: "22px 0 10px" }}>{firstName}, votre aperçu personnalisé</h1>
          <p style={{ fontSize: "18px", lineHeight: 1.8, color: "#6d6884", maxWidth: "620px" }}>
            Une première lecture premium pour découvrir votre profil astral et le climat du moment.
          </p>
        </section>
        <div style={{ display: "grid", gap: "22px", gridTemplateColumns: "1.2fr 0.8fr" }}>
          <PdfSectionBlock
            title="Résumé rapide du profil astral"
            body={`Soleil ${demoUser.sun}, Lune ${demoUser.moon}, Ascendant ${demoUser.ascendant}. ${demoUser.profileLine}`}
          />
          <PdfSectionBlock title="Aperçu du mois" body={summary} />
        </div>
        <PdfSectionBlock title="Focus relationnel" body={demoUser.love} />
        <section style={{ borderRadius: "28px", padding: "26px", background: "#3f2d62", color: "#fdf8ff" }}>
          <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", color: "rgba(255,255,255,0.7)" }}>Aller plus loin</div>
          <p style={{ fontSize: "28px", lineHeight: 1.3, margin: "16px 0 0" }}>
            Débloquez vos prévisions complètes, vos jours clés et votre PDF premium mensuel.
          </p>
        </section>
      </div>
    </div>
  );
}
