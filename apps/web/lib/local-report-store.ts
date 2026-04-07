import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { AstroChart } from "@/lib/astro";
import { normalizeChart, translateReportType } from "@/lib/astro-i18n";
import { generatePremiumContent } from "@/lib/content";
import { webDataRoot } from "@/lib/paths";
import { generateStoredFreeTeaserPdf, generateStoredPremiumPdf } from "@/lib/pdf-generator";

type LocalReportType = "FREE_TEASER" | "MONTHLY_PREMIUM";

export type LocalReportRecord = {
  id: string;
  user: {
    firstName: string;
    email: string;
  };
  type: LocalReportType;
  title: string;
  deliveryChannel: "PDF";
  contentJson: ReturnType<typeof generatePremiumContent> & { chart: AstroChart };
  htmlSnapshot: string;
  pdfUrl: string | null;
  createdAt: string;
};

const dataDir = webDataRoot;
const reportsFile = path.join(dataDir, "local-reports.json");

async function ensureStore() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(reportsFile, "utf8");
  } catch {
    await writeFile(reportsFile, "[]", "utf8");
  }
}

async function readReports(): Promise<LocalReportRecord[]> {
  await ensureStore();
  const raw = await readFile(reportsFile, "utf8");
  return JSON.parse(raw) as LocalReportRecord[];
}

async function writeReports(reports: LocalReportRecord[]) {
  await ensureStore();
  await writeFile(reportsFile, JSON.stringify(reports, null, 2), "utf8");
}

export async function createLocalFreeTeaserReport({
  firstName,
  email,
  chart
}: {
  firstName: string;
  email: string;
  chart: AstroChart;
}) {
  const content = generatePremiumContent(firstName, chart, "premium-pdf");
  const id = randomUUID();

  const stored = await generateStoredPremiumPdf({
    reportId: id,
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

  const report: LocalReportRecord = {
    id,
    user: { firstName, email },
    type: "FREE_TEASER",
    title: `Aperçu gratuit • ${new Date().toLocaleDateString("fr-FR")}`,
    deliveryChannel: "PDF",
    contentJson: {
      ...content,
      chart
    },
    htmlSnapshot: stored.html,
    pdfUrl: stored.pdfUrl,
    createdAt: new Date().toISOString()
  };

  const reports = await readReports();
  reports.unshift(report);
  await writeReports(reports);
  return report;
}

export async function createLocalPremiumReport({
  firstName,
  email,
  chart
}: {
  firstName: string;
  email: string;
  chart: AstroChart;
}) {
  const content = generatePremiumContent(firstName, chart, "premium-pdf");
  const id = randomUUID();

  const stored = await generateStoredPremiumPdf({
    reportId: id,
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

  const report: LocalReportRecord = {
    id,
    user: { firstName, email },
    type: "MONTHLY_PREMIUM",
    title: `Rapport premium • ${new Date().toLocaleDateString("fr-FR")}`,
    deliveryChannel: "PDF",
    contentJson: {
      ...content,
      chart
    },
    htmlSnapshot: stored.html,
    pdfUrl: stored.pdfUrl,
    createdAt: new Date().toISOString()
  };

  const reports = await readReports();
  reports.unshift(report);
  await writeReports(reports);
  return report;
}

export async function findLocalReport(reportId: string) {
  const reports = await readReports();
  return reports.find((report) => report.id === reportId) ?? null;
}

export async function regenerateLocalReportPdf(reportId: string) {
  const reports = await readReports();
  const index = reports.findIndex((report) => report.id === reportId);

  if (index === -1) {
    throw new Error("Local report not found");
  }

  const report = reports[index];
  const chart = normalizeChart(report.contentJson.chart);

  if (report.type === "FREE_TEASER") {
    const stored = await generateStoredPremiumPdf({
      reportId: report.id,
      firstName: report.user.firstName,
      sun: chart.luminaries.sun.sign,
      moon: chart.luminaries.moon.sign,
      ascendant: chart.luminaries.ascendant.sign,
      profileLine: report.contentJson.introduction,
      summary: report.contentJson.generalEnergy,
      love: report.contentJson.love,
      work: report.contentJson.work,
      wellbeing: report.contentJson.wellbeing,
      keyDays: report.contentJson.keyDays.map((item) => item.date)
    });

    reports[index] = { ...report, htmlSnapshot: stored.html, pdfUrl: stored.pdfUrl };
  } else {
    const stored = await generateStoredPremiumPdf({
      reportId: report.id,
      firstName: report.user.firstName,
      sun: chart.luminaries.sun.sign,
      moon: chart.luminaries.moon.sign,
      ascendant: chart.luminaries.ascendant.sign,
      profileLine: report.contentJson.introduction,
      summary: report.contentJson.generalEnergy,
      love: report.contentJson.love,
      work: report.contentJson.work,
      wellbeing: report.contentJson.wellbeing,
      keyDays: report.contentJson.keyDays.map((item) => item.date)
    });

    reports[index] = { ...report, htmlSnapshot: stored.html, pdfUrl: stored.pdfUrl };
  }

  await writeReports(reports);
  return reports[index];
}

export async function getLocalAdminSnapshot() {
  const reports = await readReports();
  const usersMap = new Map<string, { id: string; firstName: string; email: string; subscriptions: { offer: { name: string }; status: string }[] }>();

  for (const report of reports) {
    if (!usersMap.has(report.user.email)) {
      usersMap.set(report.user.email, {
        id: report.id,
        firstName: report.user.firstName,
        email: report.user.email,
        subscriptions: []
      });
    }
  }

  return {
    leads: usersMap.size,
    users: usersMap.size,
    activeSubscriptions: 0,
    reports: reports.slice(0, 5).map((report) => ({
      id: report.id,
      title: report.title,
      type: translateReportType(report.type),
      user: { firstName: report.user.firstName }
    })),
    newsletters: [],
    latestUsers: Array.from(usersMap.values()).slice(0, 5)
  };
}
