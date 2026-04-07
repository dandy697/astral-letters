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
  const response = await fetch(`${env.ASTRO_SERVICE_URL}/chart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Astro service unavailable");
  }

  const chart = (await response.json()) as AstroChart;
  return normalizeChart(chart);
}
