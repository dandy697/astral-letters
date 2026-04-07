import type { GeneratedReport } from "@prisma/client";
import type { AstroChart } from "@/lib/astro";
import { generatePremiumContent } from "@/lib/content";

type FreeReportContent = ReturnType<typeof generatePremiumContent>;

export function extractReportContent(report: any) {
  if (!report) return {
    firstName: "Vous",
    introduction: "Chargement de votre lecture...",
    generalEnergy: "",
    love: "",
    work: "",
    wellbeing: "",
    keyDays: ["8 avril", "14 avril", "27 avril"],
    chart: null
  };

  const content = (report.contentJson || {}) as any;
  return {
    firstName: report.user?.firstName ?? "Vous",
    introduction: content.introduction ?? "",
    generalEnergy: content.generalEnergy ?? "",
    love: content.love ?? "",
    work: content.work ?? "",
    wellbeing: content.wellbeing ?? "",
    keyDays: Array.isArray(content.keyDays) ? content.keyDays : [],
    chart: content.chart
  };
}
