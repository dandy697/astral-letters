import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { storeBinaryAsset } from "@/lib/storage";
import { renderFreeTeaserHtml, renderPremiumReportHtml, renderNatalReportHtml } from "@/lib/report-templates";

export async function generatePdfBuffer(html: string) {
  let browser;
  
  if (process.env.VERCEL) {
    // Vercel deployment
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = await import("puppeteer-core");
    
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  } else {
    // Local development
    const puppeteer = await import("puppeteer");
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 60000 });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0"
      }
    });
    return pdf;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export async function generatePremiumPdfBuffer(data: {
  firstName: string;
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
  const generatedAt = format(new Date(), "d MMMM yyyy", { locale: fr });
  const html = renderPremiumReportHtml({ ...data, generatedAt });
  return await generatePdfBuffer(html);
}

export async function generateStoredFreeTeaserPdf({
  reportId,
  firstName,
  summary,
  sun,
  moon,
  ascendant,
  profileLine,
  love
}: {
  reportId: string;
  firstName: string;
  summary: string;
  sun: string;
  moon: string;
  ascendant: string;
  profileLine: string;
  love: string;
}) {
  const html = renderFreeTeaserHtml({ firstName, summary, sun, moon, ascendant, profileLine, love });
  const pdf = await generatePdfBuffer(html);
  const fileName = `${reportId}-teaser.pdf`;
  const stored = await storeBinaryAsset({ fileName, bytes: pdf, contentType: "application/pdf" });
  return { html, pdfUrl: stored.url, storage: stored.storage, filePath: stored.filePath };
}

export async function generateNatalPdfBuffer(data: {
  firstName: string;
  sun: string;
  moon: string;
  ascendant: string;
  profileLine: string;
}) {
  const generatedAt = format(new Date(), "d MMMM yyyy", { locale: fr });
  const html = renderNatalReportHtml({ ...data, generatedAt });
  return await generatePdfBuffer(html);
}

export async function generateStoredPremiumPdf(data: {
  reportId: string;
  firstName: string;
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
  const generatedAt = format(new Date(), "d MMMM yyyy", { locale: fr });
  const html = renderPremiumReportHtml({ ...data, generatedAt });
  const pdf = await generatePdfBuffer(html);
  const fileName = `${data.reportId}-premium.pdf`;
  const stored = await storeBinaryAsset({ fileName, bytes: pdf, contentType: "application/pdf" });
  return { html, pdfUrl: stored.url, storage: stored.storage, filePath: stored.filePath };
}

