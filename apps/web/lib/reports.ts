import { DeliveryChannel, type GeneratedReport, ReportType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { AstroChart } from "@/lib/astro";
import { normalizeChart } from "@/lib/astro-i18n";
import { generatePremiumContent } from "@/lib/content";
import { generateStoredFreeTeaserPdf, generateStoredPremiumPdf } from "@/lib/pdf-generator";

type FreeReportContent = ReturnType<typeof generatePremiumContent>;

export async function createFreeTeaserReport({
  userId,
  firstName,
  chart
}: {
  userId: string;
  firstName: string;
  chart: AstroChart;
}) {
  const content = generatePremiumContent(firstName, chart, "premium-pdf");
  const report = await prisma.generatedReport.create({
    data: {
      userId,
      type: ReportType.FREE_TEASER,
      title: `Aperçu gratuit • ${new Date().toLocaleDateString("fr-FR")}`,
      deliveryChannel: DeliveryChannel.PDF,
      htmlSnapshot: "",
      contentJson: {
        ...content,
        chart
      }
    }
  });

  const stored = await generateStoredPremiumPdf({
    reportId: report.id,
    firstName,
    sun: chart.luminaries.sun.sign,
    moon: chart.luminaries.moon.sign,
    ascendant: chart.luminaries.ascendant.sign,
    profileLine: content.introduction,
    summary: content.generalEnergy,
    love: content.love,
    work: content.work,
    wellbeing: content.wellbeing,
    keyDays: content.keyDays.map((item) => item.date)
  });

  return prisma.generatedReport.update({
    where: { id: report.id },
    data: {
      htmlSnapshot: stored.html,
      pdfUrl: stored.pdfUrl
    }
  });
}

export async function createPremiumReportFromChart({
  userId,
  firstName,
  chart
}: {
  userId: string;
  firstName: string;
  chart: AstroChart;
}) {
  const content = generatePremiumContent(firstName, chart, "premium-pdf");
  const report = await prisma.generatedReport.create({
    data: {
      userId,
      type: ReportType.MONTHLY_PREMIUM,
      title: `Rapport premium • ${new Date().toLocaleDateString("fr-FR")}`,
      deliveryChannel: DeliveryChannel.PDF,
      htmlSnapshot: "",
      contentJson: {
        ...content,
        chart
      }
    }
  });

  const stored = await generateStoredPremiumPdf({
    reportId: report.id,
    firstName,
    sun: chart.luminaries.sun.sign,
    moon: chart.luminaries.moon.sign,
    ascendant: chart.luminaries.ascendant.sign,
    profileLine: content.introduction,
    summary: content.generalEnergy,
    love: content.love,
    work: content.work,
    wellbeing: content.wellbeing,
    keyDays: content.keyDays.map((item) => item.date)
  });

  return prisma.generatedReport.update({
    where: { id: report.id },
    data: {
      htmlSnapshot: stored.html,
      pdfUrl: stored.pdfUrl
    }
  });
}

export async function regenerateReportPdf(reportId: string) {
  const report = await prisma.generatedReport.findUnique({
    where: { id: reportId },
    include: { user: true }
  });

  if (!report) {
    throw new Error("Report not found");
  }

  const content = report.contentJson as FreeReportContent & { chart?: AstroChart };
  const chart = content.chart ? normalizeChart(content.chart) : undefined;
  const firstName = report.user?.firstName ?? "Vous";

  if (report.type === ReportType.FREE_TEASER) {
  const stored = await generateStoredPremiumPdf({
    reportId: report.id,
    firstName,
    sun: chart?.luminaries.sun.sign ?? "Soleil",
    moon: chart?.luminaries.moon.sign ?? "Lune",
    ascendant: chart?.luminaries.ascendant.sign ?? "Ascendant",
    profileLine: content.introduction ?? "",
    summary: content.generalEnergy ?? "",
    love: content.love ?? "",
    work: content.work ?? "",
    wellbeing: content.wellbeing ?? "",
    keyDays: Array.isArray(content.keyDays) ? content.keyDays.map((item) => item.date) : []
  });

    return prisma.generatedReport.update({
      where: { id: report.id },
      data: {
        htmlSnapshot: stored.html,
        pdfUrl: stored.pdfUrl
      }
    });
  }

  const stored = await generateStoredPremiumPdf({
    reportId: report.id,
    firstName,
    sun: chart?.luminaries.sun.sign ?? "Soleil",
    moon: chart?.luminaries.moon.sign ?? "Lune",
    ascendant: chart?.luminaries.ascendant.sign ?? "Ascendant",
    profileLine: content.introduction ?? "",
    summary: content.generalEnergy ?? "",
    love: content.love ?? "",
    work: content.work ?? "",
    wellbeing: content.wellbeing ?? "",
    keyDays: Array.isArray(content.keyDays) ? content.keyDays.map((item) => item.date) : []
  });

  return prisma.generatedReport.update({
    where: { id: report.id },
    data: {
      htmlSnapshot: stored.html,
      pdfUrl: stored.pdfUrl
    }
  });
}
