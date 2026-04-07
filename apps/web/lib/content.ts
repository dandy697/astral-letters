import type { AstroChart } from "@/lib/astro";

type ContentVariant = "free" | "weekly" | "monthly" | "premium-pdf";

function matches(value: string, ...candidates: string[]) {
  return candidates.includes(value);
}

export function generatePremiumContent(firstName: string, chart: AstroChart, variant: ContentVariant) {
  const { sun, moon, ascendant } = chart.luminaries;
  const transitThemes = chart.transit_summary.themes.join(", ");
  const intro =
    `${firstName}, votre axe ${sun.sign} / ${moon.sign} / ${ascendant.sign} donne une lecture très précise de votre façon d’avancer : ` +
    `${matches(sun.sign, "Bélier", "Belier", "Aries") ? "vous décidez vite" : "vous cherchez une cohérence durable"}, ` +
    `${matches(moon.sign, "Scorpion", "Scorpio") ? "avec une vie émotionnelle intense" : "avec un besoin sensible de sécurité"}, ` +
    `tandis que votre ascendant ${ascendant.sign} colore votre manière d’entrer dans le monde avec ${matches(ascendant.sign, "Vierge", "Virgo") ? "finesse et discernement" : "présence et singularité"}.`;

  const base = {
    introduction: intro,
    generalEnergy: `Le mois met l’accent sur ${transitThemes}. Vos transits favorisent les réglages intelligents plutôt que les grands gestes symboliques. Tout ce qui vous aide à clarifier vos priorités, vos alliances et votre rythme intérieur devient immédiatement rentable.`,
    love: `En relation, vous gagnez à dire les choses plus tôt et plus simplement. Votre combinaison solaire et lunaire ne supporte pas longtemps l’ambiguïté. Si vous êtes célibataire, les rencontres les plus prometteuses émergent là où la conversation est dense, fine et concrète.`,
    work: `Côté travail et argent, la carte invite à arbitrer avec lucidité. Vous avez intérêt à sécuriser ce qui produit de la stabilité, puis à investir votre énergie sur un seul levier de croissance à la fois. Les décisions prises avec méthode auront un effet durable.`,
    wellbeing: `Votre niveau d’énergie dépend d’un point simple : ne pas confondre intensité et dispersion. Votre ciel favorise les routines élégantes, le sommeil protégé et les temps de recul avant décision.`,
    keyDays: [
      { date: "8 avril", note: "journée utile pour cadrer une discussion ou signer un engagement" },
      { date: "14 avril", note: "pic émotionnel, à convertir en clarification plutôt qu’en réaction" },
      { date: "27 avril", note: "fenêtre favorable pour repositionner un objectif important" }
    ],
    advice: [
      "Réduisez le nombre de priorités actives pour retrouver une vraie traction.",
      "Formulez vos attentes avec précision dans vos relations proches.",
      "Réservez une plage hebdomadaire sans notifications pour penser à long terme."
    ],
    conclusion: `La vraie force de votre mois ne vient pas d’un événement unique, ${firstName}, mais de votre capacité à transformer une perception fine en décisions propres. C’est ce qui donne à votre trajectoire sa qualité premium.`
  };

  if (variant === "free") {
    return {
      ...base,
      // On garde tout le contenu pour l'instant
    };
  }

  if (variant === "weekly") {
    return {
      ...base,
      introduction: `${firstName}, voici votre réglage de la semaine à partir de votre thème natal réel.`,
      keyDays: base.keyDays.slice(0, 2)
    };
  }

  if (variant === "premium-pdf") {
    return {
      ...base,
      generalEnergy: `${base.generalEnergy} Le PDF premium pousse plus loin les zones d’appui, les tensions utiles et la manière d’aligner vos choix avec la structure profonde de votre thème.`,
      advice: [...base.advice, "Traitez vos jours clés comme de vrais points de pilotage, pas comme de simples curiosités."]
    };
  }

  return base;
}
