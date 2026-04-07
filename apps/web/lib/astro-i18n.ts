import type { AstroChart } from "@/lib/astro";

const SIGN_TRANSLATIONS: Record<string, string> = {
  Aries: "Bélier",
  Taurus: "Taureau",
  Gemini: "Gémeaux",
  Cancer: "Cancer",
  Leo: "Lion",
  Virgo: "Vierge",
  Libra: "Balance",
  Scorpio: "Scorpion",
  Sagittarius: "Sagittaire",
  Capricorn: "Capricorne",
  Aquarius: "Verseau",
  Pisces: "Poissons"
};

const PLANET_TRANSLATIONS: Record<string, string> = {
  Sun: "Soleil",
  Moon: "Lune",
  Mercury: "Mercure",
  Venus: "Vénus",
  Mars: "Mars",
  Jupiter: "Jupiter",
  Saturn: "Saturne",
  Uranus: "Uranus",
  Neptune: "Neptune",
  Pluto: "Pluton"
};

const ASPECT_TRANSLATIONS: Record<string, string> = {
  conjunction: "conjonction",
  sextile: "sextile",
  square: "carré",
  trine: "trigone",
  opposition: "opposition"
};

export function translateSign(value: string) {
  return SIGN_TRANSLATIONS[value] ?? value;
}

export function translatePlanet(value: string) {
  return PLANET_TRANSLATIONS[value] ?? value;
}

export function translateAspect(value: string) {
  return ASPECT_TRANSLATIONS[value] ?? value;
}

export function normalizeChart(chart: AstroChart): AstroChart {
  return {
    ...chart,
    luminaries: {
      sun: {
        ...chart.luminaries.sun,
        name: translatePlanet(chart.luminaries.sun.name),
        sign: translateSign(chart.luminaries.sun.sign)
      },
      moon: {
        ...chart.luminaries.moon,
        name: translatePlanet(chart.luminaries.moon.name),
        sign: translateSign(chart.luminaries.moon.sign)
      },
      ascendant: {
        ...chart.luminaries.ascendant,
        sign: translateSign(chart.luminaries.ascendant.sign)
      }
    },
    planets: chart.planets.map((planet) => ({
      ...planet,
      name: translatePlanet(planet.name),
      sign: translateSign(planet.sign)
    })),
    houses: chart.houses.map((house) => ({
      ...house,
      sign: translateSign(house.sign)
    })),
    aspects: chart.aspects.map((aspect) => ({
      ...aspect,
      from: translatePlanet(aspect.from),
      to: translatePlanet(aspect.to),
      type: translateAspect(aspect.type)
    })),
    transit_summary: {
      ...chart.transit_summary,
      themes: chart.transit_summary.themes.map((theme) =>
        Object.entries(PLANET_TRANSLATIONS).reduce(
          (acc, [from, to]) => acc.replace(new RegExp(`\\b${from}\\b`, "g"), to),
          Object.entries(SIGN_TRANSLATIONS).reduce(
            (inner, [from, to]) => inner.replace(new RegExp(`\\b${from}\\b`, "g"), to),
            theme
          )
        )
      ),
      technical_summary: Object.entries(PLANET_TRANSLATIONS).reduce(
        (acc, [from, to]) => acc.replace(new RegExp(`\\b${from}\\b`, "g"), to),
        Object.entries(SIGN_TRANSLATIONS).reduce(
          (inner, [from, to]) => inner.replace(new RegExp(`\\b${from}\\b`, "g"), to),
          chart.transit_summary.technical_summary
        )
      )
    }
  };
}

export function translateReportType(type: string) {
  if (type === "FREE_TEASER") return "Aperçu gratuit";
  if (type === "MONTHLY_PREMIUM") return "Rapport premium";
  return type;
}

export function translateAstroText(text: string) {
  let output = text;

  for (const [from, to] of Object.entries(PLANET_TRANSLATIONS)) {
    output = output.replace(new RegExp(`\\b${from}\\b`, "g"), to);
  }

  for (const [from, to] of Object.entries(SIGN_TRANSLATIONS)) {
    output = output.replace(new RegExp(`\\b${from}\\b`, "g"), to);
  }

  for (const [from, to] of Object.entries(ASPECT_TRANSLATIONS)) {
    output = output.replace(new RegExp(`\\b${from}\\b`, "g"), to);
  }

  return output;
}
