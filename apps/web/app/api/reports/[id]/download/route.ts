import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractReportContent } from "@/lib/report-content";
import { normalizeChart, translateSign } from "@/lib/astro-i18n";
import { demoUser } from "@/lib/demo-content";
import { generatePremiumPdfBuffer } from "@/lib/pdf-generator";

/**
 * GET /api/reports/[id]/download
 * Generates and returns the full Premium PDF.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: reportId } = await params;

  let data = {
    firstName: demoUser.firstName as string,
    sun: translateSign(demoUser.sun),
    moon: translateSign(demoUser.moon),
    ascendant: translateSign(demoUser.ascendant),
    profileLine: demoUser.profileLine as string,
    summary: demoUser.summary as string,
    love: demoUser.love as string,
    work: demoUser.work as string,
    wellbeing: demoUser.energy as string,
    keyDays: [...demoUser.keyDays] as string[],
  };

  const hasDb = !!process.env.DATABASE_URL;

  // 1. Try Prisma if DB is available
  if (reportId !== "demo" && hasDb) {
    try {
      console.log(`[DOWNLOAD] Fetching report ${reportId} from Prisma...`);
      const report = await prisma.generatedReport.findUnique({
        where: { id: reportId },
      });

      if (report) {
        console.log(`[DOWNLOAD] Found report ${reportId} in Prisma`);
        const content = extractReportContent(report);
        const chart = content.chart ? normalizeChart(content.chart) : null;
        
        data = {
          firstName: content.firstName,
          sun: translateSign(chart?.luminaries.sun.sign || "Bélier"),
          moon: translateSign(chart?.luminaries.moon.sign || "Taureau"),
          ascendant: translateSign(chart?.luminaries.ascendant.sign || "Gémeaux"),
          profileLine: `${content.introduction}`,
          summary: `${content.generalEnergy}`,
          love: content.love || "",
          work: content.work || "",
          wellbeing: content.wellbeing || "",
          keyDays: Array.isArray(content.keyDays) ? (content.keyDays as any[]).map(k => k.date) : [],
        };
      } else {
        console.warn(`[DOWNLOAD] Report ${reportId} not found in Prisma`);
      }
    } catch (error) {
      console.error("[DOWNLOAD] Error fetching report from Prisma:", error);
    }
  }

  // 2. Fallback to Local Storage if not found or no DB
  if (reportId !== "demo" && data.firstName === demoUser.firstName) {
    try {
      console.log(`[DOWNLOAD] Attempting local storage fallback for ${reportId}...`);
      const { findLocalReport } = await import("@/lib/local-report-store");
      const localReport = await findLocalReport(reportId);
      
      if (localReport) {
        console.log(`[DOWNLOAD] Found local report ${reportId}`);
        const content = localReport.contentJson;
        const chart = normalizeChart(content.chart);
        
        data = {
          firstName: localReport.user.firstName,
          sun: translateSign(chart.luminaries.sun.sign),
          moon: translateSign(chart.luminaries.moon.sign),
          ascendant: translateSign(chart.luminaries.ascendant.sign),
          profileLine: content.introduction,
          summary: content.generalEnergy,
          love: content.love || "",
          work: content.work || "",
          wellbeing: content.wellbeing || "",
          keyDays: Array.isArray(content.keyDays) ? (content.keyDays as any[]).map(k => k.date) : [],
        };
      }
    } catch (error) {
      console.error("[DOWNLOAD] Error fetching report from local store:", error);
    }
  }

  console.log(`[DOWNLOAD] Starting PDF generation for ${data.firstName}...`);
  try {
    const pdfBuffer = await generatePremiumPdfBuffer(data);
    const pdf = Buffer.from(pdfBuffer);

    console.log(`[DOWNLOAD] PDF generated successfully for ${data.firstName} - size: ${pdf.length} bytes`);

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": pdf.length.toString(),
        "Content-Disposition": `attachment; filename="Astral-Letters-Rapport-${encodeURIComponent(data.firstName)}.pdf"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("[DOWNLOAD] PDF Generation Error:", error);
    return NextResponse.json({ 
      error: "Failed to generate PDF", 
      details: error.message,
      environment: process.env.VERCEL ? "production" : "development"
    }, { status: 500 });
  }
}
