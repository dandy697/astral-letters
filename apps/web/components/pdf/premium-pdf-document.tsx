import { demoUser } from "@/lib/demo-content";
import { PdfSectionBlock } from "@/components/pdf/pdf-section-block";

/**
 * Premium PDF Template
 * ====================
 * A high-end Astro-Magazine style layout designed for printed reports.
 * Uses the Prune/Gold/Neutral-Warm palette for an editorial feel.
 */
export function PremiumPdfTemplate({
  firstName = demoUser.firstName,
  generatedAt = "12 avril 2026",
}: {
  firstName?: string;
  generatedAt?: string;
}) {
  return (
    <div style={{ 
      background: "#FAF8F6", 
      padding: "0", 
      color: "#0F0F0F", 
      fontFamily: "'Times New Roman', Times, serif", 
      minHeight: "1122px", // A4 Ratio
      width: "794px", 
      margin: "0 auto",
      boxShadow: "0 0 40px rgba(0,0,0,0.1)",
      overflow: "hidden"
    }}>
      {/* ✧ Hero Header ✧ */}
      <section style={{ 
        position: "relative",
        height: "440px", 
        background: "#3A1F3D", 
        padding: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        color: "#FFFFFF"
      }}>
        {/* Architectural Grid Background Overlay */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.15,
          backgroundImage: "radial-gradient(#C8A96A 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px"
        }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ 
            fontSize: "12px", 
            textTransform: "uppercase", 
            letterSpacing: "4px", 
            color: "#C8A96A",
            fontWeight: "700",
            marginBottom: "20px"
          }}>
            ✧ Astral Letters • Édition Personnel ✧
          </div>
          <h1 style={{ 
            fontSize: "64px", 
            lineHeight: 0.95, 
            margin: "0 0 20px", 
            fontFamily: "inherit",
            fontWeight: "400",
            maxWidth: "500px"
          }}>
            {firstName}, <br/>
            votre guidance du mois.
          </h1>
          <div style={{ 
            height: "1px", 
            width: "80px", 
            background: "#C8A96A", 
            margin: "20px 0" 
          }} />
          <p style={{ 
            fontSize: "16px", 
            lineHeight: 1.6, 
            color: "rgba(255,255,255,0.7)", 
            maxWidth: "400px",
            fontFamily: "sans-serif",
            letterSpacing: "0.2px"
          }}>
            Une analyse astrologique précise calculée à partir de vos coordonnées de naissance réelles pour éclairer votre trajectoire.
          </p>
        </div>

        {/* Natal Profile Floating Badge */}
        <div style={{
          position: "absolute",
          top: "60px",
          right: "60px",
          textAlign: "right"
        }}>
          <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>Thème de référence :</div>
          <div style={{ fontSize: "18px", fontWeight: "600", color: "#C8A96A" }}>
            {demoUser.sun} • {demoUser.moon} • {demoUser.ascendant}
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>Généré le {generatedAt}</div>
        </div>
      </section>

      {/* ✧ Main Content Body ✧ */}
      <div style={{ padding: "40px 60px", display: "grid", gap: "24px" }}>
        
        {/* Quote / Highlight Section */}
        <div style={{ 
          display: "grid", 
          gap: "24px", 
          gridTemplateColumns: "1.2fr 0.8fr" 
        }}>
          <div style={{ 
            padding: "32px", 
            border: "1px solid #EAE3DC", 
            borderRadius: "32px", 
            background: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}>
            <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#C8A96A", marginBottom: "16px" }}>L&apos;Axe de ce mois</div>
            <p style={{ fontSize: "21px", lineHeight: "1.5", color: "#3A1F3D", margin: 0 }}>
              &quot;Ce mois-ci, votre intuition demande une application concrète. La clarté ne viendra pas de la réflexion, mais de l&apos;action ciblée sur vos priorités essentielles.&quot;
            </p>
          </div>
          <div style={{ 
            background: "#C8A96A", 
            padding: "32px", 
            borderRadius: "32px", 
            color: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "42px", fontWeight: "400", lineHeight: 1 }}>24</div>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.8, marginTop: "4px" }}>Jours de Pleine Énergie</div>
          </div>
        </div>

        {/* Detailed Sections Grid */}
        <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "1fr 1fr" }}>
          <PdfSectionBlock 
            title="Lecture du mois" 
            body={demoUser.summary} 
            aside="Un cycle de transition constructive qui demande de la patience sur les retours immédiats." 
          />
          <PdfSectionBlock 
            title="Amour & Relations" 
            body={demoUser.love} 
            aside="Ouvrez le dialogue sans chercher à avoir raison à tout prix." 
          />
        </div>

        <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "1fr 1fr" }}>
          <PdfSectionBlock 
            title="Carrière & Décisions" 
            body={demoUser.work} 
            aside="Excellent moment pour structurer vos projets de long terme." 
          />
          <PdfSectionBlock 
            title="Vitalité & Harmonie" 
            body={demoUser.energy} 
            aside="Votre corps réclame de la régularité plus que de l'intensité." 
          />
        </div>

        {/* Key Days / Recommendations */}
        <div style={{ 
          background: "#FFFFFF", 
          border: "1px solid #EAE3DC", 
          borderRadius: "32px", 
          padding: "32px"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#C8A96A", marginBottom: "16px" }}>Dates de Vigilance</div>
              <div style={{ fontSize: "14px", lineHeight: "2", color: "#3A1F3D" }}>
                {demoUser.keyDays.map(date => (
                  <div key={date} style={{ borderBottom: "1px solid #F3EFED", paddingBottom: "4px", marginBottom: "8px" }}>✧ {date}</div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#C8A96A", marginBottom: "16px" }}>Vos Conseils Actionnables</div>
              <ul style={{ padding: 0, margin: 0, listStyle: "none", fontSize: "14px", color: "#555" }}>
                <li style={{ marginBottom: "12px", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#C8A96A" }}>•</span> Déléguez les tâches à faible valeur ajoutée dès le 12.
                </li>
                <li style={{ marginBottom: "12px", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#C8A96A" }}>•</span> Privilégiez les signatures officielles avant la fin de semaine.
                </li>
                <li style={{ marginBottom: "12px", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#C8A96A" }}>•</span> Ne négligez pas votre temps de sommeil en milieu de cycle.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Brand */}
        <div style={{ 
          textAlign: "center", 
          marginTop: "20px", 
          fontSize: "10px", 
          color: "#999", 
          textTransform: "uppercase",
          letterSpacing: "2px"
        }}>
          Astral Letters — Guidance Astrologique &amp; Thème Natal © 2026
        </div>
      </div>
    </div>
  );
}
