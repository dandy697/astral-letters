/**
 * Astral Letters - PDF Report Templates
 * =====================================
 * This file contains the HTML generators used by Puppeteer to create 
 * the high-end PDF reports.
 */

function wrapDocument(markup: string) {
  return `<!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Astral Letters • Votre Guidance</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;700&display=swap');
        
        * { box-sizing: border-box; }
        body { 
          margin: 0; 
          padding: 0;
          background: #FAF8F6; 
          color: #0F0F0F; 
          font-family: 'Inter', sans-serif; 
          -webkit-print-color-adjust: exact;
        }
        
        .page-container {
          width: 794px; 
          min-height: 1122px;
          margin: 0 auto;
          background: #FAF8F6;
          overflow: hidden;
        }

        .font-serif { font-family: 'Playfair Display', 'Times New Roman', serif; }
        
        .hero {
          position: relative;
          height: 440px;
          background: #3A1F3D;
          color: #FFFFFF;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        
        .hero-pattern {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          opacity: 0.15;
          background-image: radial-gradient(#C8A96A 0.5px, transparent 0.5px);
          background-size: 24px 24px;
        }

        .eyebrow {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 4px;
          color: #C8A96A;
          font-weight: 700;
          margin-bottom: 20px;
        }

        h1 {
          font-size: 58px;
          line-height: 0.95;
          margin: 0 0 20px;
          font-weight: 400;
          max-width: 500px;
        }

        .divider {
          height: 1px;
          width: 80px;
          background: #C8A96A;
          margin: 20px 0;
        }

        .hero-lead {
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
          max-width: 380px;
        }

        .hero-meta {
          position: absolute;
          top: 60px;
          right: 60px;
          text-align: right;
        }

        .content { padding: 40px 60px; }
        .grid-main { display: grid; gap: 24px; }
        .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .row-highlight { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px; }

        .card {
          background: #FFFFFF;
          border: 1px solid #EAE3DC;
          border-radius: 32px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(58, 31, 61, 0.02);
        }

        .card-gold {
          background: #C8A96A;
          color: #FFFFFF;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .card-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #C8A96A;
          margin-bottom: 14px;
        }

        .card-body {
          font-size: 15px;
          line-height: 1.7;
          color: #1A1A1A;
        }

        .quote-text {
          font-size: 20px;
          line-height: 1.5;
          color: #3A1F3D;
          margin: 0;
        }

        .aside-text {
          margin-top: 16px;
          font-size: 13px;
          line-height: 1.6;
          color: #6B5A6B;
          border-top: 1px solid #F3EFED;
          padding-top: 14px;
          font-style: italic;
        }

        .key-dates { list-style: none; padding: 0; margin: 0; }
        .key-date-item {
          font-size: 14px;
          color: #3A1F3D;
          padding: 8px 0;
          border-bottom: 1px solid #F3EFED;
        }

        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 10px;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
      </style>
    </head>
    <body>
      <div class="page-container">
        ${markup}
      </div>
    </body>
  </html>`;
}

function sectionBlock(title: string, body: string, aside?: string) {
  return `
    <div class="card">
      <div class="card-title">${title}</div>
      <div class="card-body">${body}</div>
      ${aside ? `<div class="aside-text">${aside}</div>` : ""}
    </div>
  `;
}

export function renderFreeTeaserHtml({
  firstName,
  summary,
  sun,
  moon,
  ascendant,
  profileLine,
  love
}: {
  firstName: string;
  summary: string;
  sun: string;
  moon: string;
  ascendant: string;
  profileLine: string;
  love: string;
}) {
  return wrapDocument(`
    <header class="hero">
      <div class="hero-pattern"></div>
      <div class="eyebrow">✧ Astral Letters • Aperçu ✧</div>
      <h1 class="font-serif">${firstName}, votre cycle commence.</h1>
      <div class="divider"></div>
      <p class="hero-lead">Un premier aperçu de vos énergies astrales pour découvrir la puissance de votre thème natal.</p>
      <div class="hero-meta">
        <div style="font-size: 18px; font-weight: 600; color: #C8A96A">${sun} • ${moon} • ${ascendant}</div>
      </div>
    </header>
    <main class="content grid-main">
      <div class="row-2">
        ${sectionBlock("Votre portrait rapide", profileLine)}
        ${sectionBlock("L'énergie du mois", summary)}
      </div>
      ${sectionBlock("Focus Relationnel", love, "Découvrez comment vos astres influencent vos liens ce mois-ci.")}
      <div class="card card-gold" style="padding: 40px">
        <div class="eyebrow" style="color: rgba(255,255,255,0.8); margin-bottom: 10px">Aller plus loin</div>
        <div class="font-serif" style="font-size: 28px; line-height: 1.2">Débloquez votre rapport complet et vos jours clés.</div>
      </div>
    </main>
  `);
}

export function renderPremiumReportHtml({
  firstName,
  generatedAt,
  sun,
  moon,
  ascendant,
  profileLine,
  summary,
  love,
  work,
  wellbeing,
  keyDays
}: {
  firstName: string;
  generatedAt: string;
  sun: string;
  moon: string;
  ascendant: string;
  profileLine: string;
  summary: string;
  love: string;
  work: string;
  wellbeing: string;
  keyDays: string[];
}) {
  return wrapDocument(`
    <header class="hero">
      <div class="hero-pattern"></div>
      <div class="eyebrow">✧ Astral Letters • Édition Premium ✧</div>
      <h1 class="font-serif">${firstName}, <br/>votre guidance du mois.</h1>
      <div class="divider"></div>
      <p class="hero-lead">Analyse haute-fidélité calculée à partir de vos coordonnées de naissance réelles.</p>
      <div class="hero-meta">
        <div style="font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 4px">Thème de référence :</div>
        <div style="font-size: 18px; font-weight: 600; color: #C8A96A">${sun} • ${moon} • ${ascendant}</div>
        <div style="font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 8px">Généré le ${generatedAt}</div>
      </div>
    </header>
    
    <main class="content grid-main">
      <div class="row-highlight">
        <div class="card" style="display: flex; flex-direction: column; justify-content: center">
          <div class="card-title">L'Axe de ce mois</div>
          <p class="quote-text font-serif">"Votre intuition demande une application concrète. La clarté ne viendra pas de la réflexion, mais de l'action ciblée."</p>
        </div>
        <div class="card card-gold">
          <div style="font-size: 42px; line-height: 1">24</div>
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; margin-top: 4px">Jours de Haute Énergie</div>
        </div>
      </div>

      <div class="row-2">
        ${sectionBlock("Lecture du mois", summary, "Un cycle de transition constructive qui demande de la patience.")}
        ${sectionBlock("Amour & Relations", love, "Ouvrez le dialogue sans chercher à avoir raison.")}
      </div>

      <div class="row-2">
        ${sectionBlock("Carrière & Décisions", work, "Excellent moment pour structurer vos projets long terme.")}
        ${sectionBlock("Vitalité & Harmonie", wellbeing, "Votre corps réclame de la régularité plus que de l'intensité.")}
      </div>

      <div class="card">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px">
          <div>
            <div class="card-title">Dates de Vigilance</div>
            <ul class="key-dates">
              ${keyDays.map(date => `<li class="key-date-item">✧ ${date}</li>`).join('')}
            </ul>
          </div>
          <div>
            <div class="card-title">Conseils Actionnables</div>
            <div style="font-size: 14px; line-height: 1.8; color: #555">
              • Déléguez les tâches à faible valeur ajoutée dès le 12.<br/>
              • Privilégiez les signatures officielles avant la fin de semaine.<br/>
              • Protégez votre temps de sommeil en milieu de cycle.
            </div>
          </div>
        </div>
      </div>

      <div class="footer">
        Astral Letters — Guidance Astrologique & Thème Natal © 2026
      </div>
    </main>
  `);
}

export function renderNatalReportHtml({
  firstName,
  generatedAt,
  sun,
  moon,
  ascendant,
  profileLine,
}: {
  firstName: string;
  generatedAt: string;
  sun: string;
  moon: string;
  ascendant: string;
  profileLine: string;
}) {
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);
  const planets = ["Mercure", "Vénus", "Mars", "Jupiter", "Saturne", "Uranus", "Neptune", "Pluton", " Chiron", "Lune Noire"];

  return wrapDocument(`
    <style>
      .page { page-break-after: always; min-height: 1000px; padding: 60px; }
      .toc-item { display: flex; justify-content: space-between; border-bottom: 1px dotted #CCC; padding: 10px 0; font-size: 14px; }
      .chapter-title { font-size: 42px; margin-bottom: 40px; color: #3A1F3D; }
      .section-num { color: #C8A96A; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
    </style>

    <!-- Page 1: Couverture Statutaire -->
    <header class="page hero" style="justify-content: center; text-align: center;">
      <div class="hero-pattern"></div>
      <div class="eyebrow" style="margin-bottom: 40px">✧ Astral Letters • Manuel de Soi ✧</div>
      <div style="font-size: 84px; line-height: 0.9" class="font-serif">${firstName}</div>
      <div class="divider" style="margin: 40px auto; width: 120px"></div>
      <h1 class="font-serif" style="font-size: 32px">Votre Rapport Natal Premium</h1>
      <p class="hero-lead" style="margin: 20px auto; max-width: 450px">L'empreinte du ciel au moment précis de votre premier souffle.</p>
      
      <div style="margin-top: 100px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 600px; margin-left: auto; margin-right: auto;">
        <div class="card" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(200,169,106,0.3); color: #FFF">
          <div style="font-size: 10px; text-transform: uppercase; color: #C8A96A">Soleil</div>
          <div style="font-size: 18px">${sun}</div>
        </div>
        <div class="card" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(200,169,106,0.3); color: #FFF">
          <div style="font-size: 10px; text-transform: uppercase; color: #C8A96A">Lune</div>
          <div style="font-size: 18px">${moon}</div>
        </div>
        <div class="card" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(200,169,106,0.3); color: #FFF">
          <div style="font-size: 10px; text-transform: uppercase; color: #C8A96A">Ascendant</div>
          <div style="font-size: 18px">${ascendant}</div>
        </div>
      </div>
      <div style="margin-top: 80px; font-size: 11px; color: rgba(255,255,255,0.4)">Généré le ${generatedAt} • Édition Unique 0029-AL</div>
    </header>

    <!-- Page 2: Sommaire -->
    <main class="page content">
      <h2 class="font-serif" style="font-size: 32px; margin-bottom: 40px">Sommaire du Manuel</h2>
      <div style="max-width: 500px">
        <div class="toc-item"><span>Introduction : L'ADN Stellaire</span> <span>03</span></div>
        <div class="toc-item"><span>Les Luminaires (Soleil & Lune)</span> <span>04</span></div>
        <div class="toc-item"><span>Le Voyage des 12 Maisons</span> <span>06</span></div>
        <div class="toc-item"><span>Architecture des 10 Planètes</span> <span>18</span></div>
        <div class="toc-item"><span>Synthèse & Prochaines Étapes</span> <span>26</span></div>
      </div>
      
      <div class="card" style="margin-top: 80px; background: #F3EFED; border: none">
        <p class="font-serif" style="font-size: 16px; font-style: italic">"Ce rapport retrace la position des astres au moment précis de votre naissance. Il n'est pas un destin immuable, mais la lecture de vos forces latentes."</p>
      </div>
    </main>

    <!-- Page 3: Fondations -->
    <main class="page content grid-main">
      <div class="card" style="padding: 50px; border: 2px solid #EAE3DC">
        <div class="section-num">Introduction</div>
        <h2 class="font-serif chapter-title">Votre Signature Astrale</h2>
        <p style="font-size: 17px; line-height: 1.9; color: #3A1F3D">
          ${profileLine}
        </p>
        <p style="font-size: 16px; line-height: 1.8; color: #555; margin-top: 30px">
          Dès votre premier souffle, l'univers a figé une image du ciel. Cette image est votre Thème Natal. Elle décrit vos prépositions psychologiques, vos défis récurrents et la direction qui donnera le plus de sens à votre existence.
        </p>
      </div>
      
      <div class="row-2">
        <div class="card">
          <div class="card-title">Élément Dominant</div>
          <div class="font-serif" style="font-size: 24px">Eau & Terre</div>
          <p style="font-size: 13px; color: #666; margin-top: 10px">Une nature profonde, intuitive et pragmatique.</p>
        </div>
        <div class="card">
          <div class="card-title">Modalité</div>
          <div class="font-serif" style="font-size: 24px">Fixe</div>
          <p style="font-size: 13px; color: #666; margin-top: 10px">Une grande capacité de persévérance et de fidélité.</p>
        </div>
      </div>
    </main>

    <!-- Houses Sections Loop -->
    ${houses.map(num => `
      <main class="page content">
        <div class="section-num">Maison ${num}</div>
        <h2 class="font-serif chapter-title">${getHouseName(num)}</h2>
        <div class="grid-main">
          <div class="card" style="border-left: 4px solid #C8A96A">
            <p style="font-size: 15px; line-height: 1.8; color: #333">
              La Maison ${num} dans votre thème natal régit **${getHouseDomain(num)}**. 
              Avec vos configurations spécifiques, cet axe de votre vie suggère une quête de ${getHouseGoal(num)}.
            </p>
            <div class="aside-text">Potentiel : Haute sensibilité et besoin de structure.</div>
          </div>
          
          <div class="row-2">
            <div class="card">
              <div class="card-title">Défis à relever</div>
              <p style="font-size: 13px; color: #555">Éviter la dispersion émotionnelle et construire des fondations solides.</p>
            </div>
            <div class="card">
              <div class="card-title">Talents cachés</div>
              <p style="font-size: 13px; color: #555">Intuition naturelle et capacité à anticiper les besoins des autres.</p>
            </div>
          </div>
        </div>
        <div class="footer" style="padding-top: 200px">Astral Letters — Page ${5 + num}</div>
      </main>
    `).join('')}

    <!-- Planets Sections Loop -->
    ${planets.map((planet, i) => `
      <main class="page content">
        <div class="section-num">Planète Arpenteuse</div>
        <h2 class="font-serif chapter-title">${planet}</h2>
        <div class="card">
          <div class="card-title">Fonction Psychologique</div>
          <p style="font-size: 15px; line-height: 1.8">
            Dans le thème de ${firstName}, **${planet}** agit comme le vecteur de ${getPlanetAction(planet)}. 
            Cette position indique comment vous ${getPlanetEffect(planet)}.
          </p>
        </div>
        <div class="card card-gold" style="margin-top: 30px; text-align: left; padding: 25px">
          <div style="font-size: 12px; text-transform: uppercase;">Conseil de Sagesse</div>
          <p class="font-serif" style="font-size: 18px; margin-top: 10px">"Intégrez cette énergie non pas comme une contrainte, mais comme un moteur de votre évolution."</p>
        </div>
        <div class="footer" style="padding-top: 300px">Astral Letters — Page ${17 + i + 1}</div>
      </main>
    `).join('')}

    <!-- Final Page -->
    <main class="page content" style="background: #3A1F3D; color: #FFFFFF; text-align: center; justify-content: center;">
      <div class="hero-pattern"></div>
      <div class="eyebrow" style="color: #C8A96A">Conclusion de votre voyage</div>
      <h2 class="font-serif" style="font-size: 48px; margin-bottom: 20px">Ce n'est que le début.</h2>
      <div class="divider" style="margin: 30px auto"></div>
      <p style="max-width: 500px; margin: 0 auto; line-height: 1.8; opacity: 0.8">
        Votre manuel de soi est une boussole. Pour l'utiliser au quotidien, suivez vos transits mensuels dans votre espace Astral Letters.
      </p>
      <div style="margin-top: 60px; font-size: 10px; opacity: 0.4">ID DE RAPPORT : 0029-AL-${firstName.toUpperCase()} • © 2026 ASTRAL LETTERS</div>
    </main>
  `);
}

function getHouseName(n: number) {
  const names = ["Le Moi & l'Expression", "Ressources & Valeurs", "Communication & Fratrie", "Le Foyer & les Racines", "Créativité & Plaisir", "Santé & Service", "Partenariats & Autrui", "Transformation & Partage", "Sagesse & Long Court", "Carrière & Destinée", "Projets & Amis", "Le Subconscient & l'Invisible"];
  return names[n-1];
}

function getHouseDomain(n: number) {
  const domains = ["votre identité et votre tempérament", "votre rapport à la matière et vos talents productifs", "votre curiosité et vos échanges quotidiens", "votre socle intime et votre héritage familial", "votre expression artistique et votre enfant intérieur", "votre organisation et votre équilibre corps-esprit", "votre lien social et vos engagements profonds", "vos métamorphoses et la gestion des ressources communes", "vos idéaux, vos voyages et votre quête de vérité", "votre stature publique et vos plus grandes ambitions", "vos espoirs collectifs et vos appartenances", "votre retrait nécessaire et votre connexion spirituelle"];
  return domains[n-1];
}

function getHouseGoal(n: number) {
  const goals = ["connaissance de soi", "stabilité matérielle", "clarté intellectuelle", "paix intérieure", "joie expressive", "maîtrise du quotidien", "harmonie relationnelle", "puissance intérieure", "découverte de sens", "réalisation sociale", "impact collectif", "sérénité profonde"];
  return goals[n-1];
}

function getPlanetAction(p: string) {
  const actions: Record<string, string> = {
    "Mercure": "votre raisonnement et votre parole",
    "Vénus": "votre capacité d'attraction et de plaisir",
    "Mars": "votre force d'action et votre courage",
    "Jupiter": "votre expansion et votre chance",
    "Saturne": "votre structure et vos leçons de vie",
    "Uranus": "votre originalité et vos percées",
    "Neptune": "votre intuition et votre rêve",
    "Pluton": "votre pouvoir de régénération"
  };
  return actions[p] || "votre dynamique interne";
}

function getPlanetEffect(p: string) {
  const effects: Record<string, string> = {
    "Mercure": "traitez l'information et communiquez vos idées",
    "Vénus": "exprimez votre affection et vivez vos désirs",
    "Mars": "relevez les défis et affirmez votre volonté",
    "Jupiter": "trouvez des opportunités et grandissez",
    "Saturne": "installez des limites et devenez responsable",
    "Uranus": "révoluionnez votre vie et affirmez votre singularité",
    "Neptune": "imaginiez le futur et ressentez l'invisible",
    "Pluton": "lâchez prise pour renaître plus fort"
  };
  return effects[p] || "avancez sur votre propre chemin";
}
