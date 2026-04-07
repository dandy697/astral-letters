import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { storeBinaryAsset } from "@/lib/storage";
import { renderFreeTeaserHtml, renderPremiumReportHtml, renderNatalReportHtml } from "@/lib/report-templates";

export async function generatePdfBuffer(html: string) {
  let browser;
  
  try {
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      // Production deployment (Vercel)
      console.log("[PDF] Production environment detected, launching sparticuz-chromium...");
      const chromium = (await import("@sparticuz/chromium")).default;
      const puppeteer = await import("puppeteer-core");
      const path = await import("path");
      const fs = await import("fs");
      
      // Explicitly check for the bin folder as Vercel sometimes traces it elsewhere
      let executablePath = "";
      try {
        // Improved path resolution for Vercel
        const binPath = path.join(process.cwd(), "node_modules/@sparticuz/chromium/bin");
        console.log(`[PDF] Checking binPath: ${binPath}`);
        
        if (fs.existsSync(binPath)) {
          console.log(`[PDF] binPath exists, using it for executablePath.`);
          executablePath = await chromium.executablePath(binPath);
        } else {
          console.log(`[PDF] binPath NOT found at ${binPath}. Falling back to default.`);
          executablePath = await chromium.executablePath();
        }
      } catch (err) {
        console.error("[PDF] Error resolving executable path:", err);
        executablePath = await chromium.executablePath();
      }
      
      console.log(`[PDF] Final executable path: ${executablePath}`);

      browser = await puppeteer.launch({
        args: [
          ...chromium.args, 
          "--font-render-hinting=none",
          "--no-zygote",
          "--single-process",
          "--disable-gpu",
          "--no-sandbox"
        ],
        defaultViewport: (chromium as any).defaultViewport || { width: 1280, height: 720 },
        executablePath: executablePath,
        headless: (chromium as any).headless
      });
      console.log("[PDF] Browser launched successfully on Vercel");
    } else {
      // Local development
      console.log("[PDF] Local environment detected, launching standard puppeteer...");
      const puppeteer = await import("puppeteer");
      browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });
    }
  } catch (launchError: any) {
    console.error(`[PDF] Failed to launch browser: ${launchError.message}`);
    throw new Error(`Browser launch failed: ${launchError.message}`);
  }

  try {
    const page = await browser.newPage();
    console.log("[PDF] Page created, setting content...");
    
    // Increased timeout and changed waitUntil
    await page.setContent(html, { 
      waitUntil: ["networkidle0", "domcontentloaded"], 
      timeout: 80000 
    });
    
    console.log("[PDF] Content set, generating PDF...");
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
    console.log(`[PDF] PDF generated successfully, size: ${pdf.length} bytes`);
    return pdf;
  } catch (renderError: any) {
    console.error(`[PDF] Rendering failed: ${renderError.message}`);
    throw renderError;
  } finally {
    if (browser) {
      await browser.close();
      console.log("[PDF] Browser closed");
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

