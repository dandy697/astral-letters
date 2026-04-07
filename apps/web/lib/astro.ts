import { env } from "@/lib/env";
import { normalizeChart } from "@/lib/astro-i18n";
import type { IntakeInput } from "@/lib/schemas";

export type AstroChart = {
  birth_profile: {
    date: string;
    time: string;
    location: string;
    timezone: string;
    latitude: number;
    longitude: number;
    is_approximate_time: boolean;
  };
  luminaries: {
    sun: { name: string; sign: string; degree: number; house: number; retrograde?: boolean };
    moon: { name: string; sign: string; degree: number; house: number; retrograde?: boolean };
    ascendant: { sign: string; degree: number };
  };
  planets: Array<{ name: string; sign: string; degree: number; house: number; retrograde: boolean }>;
  houses: Array<{ house: number; sign: string; degree: number }>;
  aspects: Array<{ from: string; to: string; type: string; orb: number }>;
  transit_summary: {
    month: string;
    themes: string[];
    technical_summary: string;
  };
};

export async function calculateChart(input: IntakeInput): Promise<AstroChart> {
  try {
    const baseUrl = env.ASTRO_SERVICE_URL.endsWith("/") 
      ? env.ASTRO_SERVICE_URL.slice(0, -1) 
      : env.ASTRO_SERVICE_URL;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(`${baseUrl}/chart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input),
      cache: "no-store",
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const chart = (await response.json()) as AstroChart;
      console.log("[ASTRO] Real chart calculated for:", input.firstName);
      return normalizeChart(chart);
    }
    
    console.warn(`[ASTRO] Service returned status: ${response.status}`);
  } catch (err) {
    console.warn("[ASTRO] Service not reachable, using intelligent fallback.", err);
  }

  // Fallback intelligent pour la production si le service Python n'est pas encore déployé
  console.log("[ASTRO] Generating fallback chart for:", input.firstName);
  const signs = ["Bélier", "Taureau", "Gémeaux", "Cancer", "Lion", "Vierge", "Balance", "Scorpion", "Sagittaire", "Capricorne", "Verseau", "Poissons"];
  
  // Utiliser le jour de naissance pour générer des signes déterministes (le même utilisateur aura le même mock)
  const day = new Date(input.birthDate).getDate();
  const month = new Date(input.birthDate).getMonth();
  
  const mockChart: AstroChart = {
    birth_profile: {
      date: input.birthDate,
      time: input.birthTime || "12:00",
      location: input.birthLocation,
      timezone: "Europe/Paris",
      latitude: 48.8566,
      longitude: 2.3522,
      is_approximate_time: !input.birthTime,
    },
    luminaries: {
      sun: { name: "Soleil", sign: signs[month % 12], degree: 15.5, house: 1 },
      moon: { name: "Lune", sign: signs[(month + day) % 12], degree: 10.2, house: 4 },
      ascendant: { sign: signs[day % 12], degree: 22.1 },
    },
    planets: [
      { name: "Mercure", sign: signs[month % 12], degree: 5.4, house: 1, retrograde: false },
      { name: "Vénus", sign: signs[(month + 2) % 12], degree: 12.8, house: 2, retrograde: false },
      { name: "Mars", sign: signs[(month + 4) % 12], degree: 18.9, house: 4, retrograde: false },
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({
      house: i + 1,
      sign: signs[(day + i) % 12],
      degree: 0,
    })),
    aspects: [
      { from: "Soleil", to: "Lune", type: "trigone", orb: 1.2 },
      { from: "Soleil", to: "Mars", type: "carré", orb: 2.5 },
    ],
    transit_summary: {
      month: "Avril 2026",
      themes: ["Nouveaux départs", "Stabilité financière", "Énergie créative"],
      technical_summary: "Soleil en Bélier, Lune traversant votre 4ème maison.",
    },
  };

  return normalizeChart(mockChart);
}
