import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractReportContent } from "@/lib/report-content";
import { normalizeChart, translateSign } from "@/lib/astro-i18n";
import { demoUser } from "@/lib/demo-content";
import { generateNatalPdfBuffer } from "@/lib/pdf-generator";

/**
 * GET /api/reports/[id]/natal/download
 * Generates and returns the full Premium Natal PDF (One-shot).
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
  };

  const hasDb = !!process.env.DATABASE_URL;

  // 1. Try Prisma if DB is available
  if (reportId !== "demo" && hasDb) {
    try {
      const report = await prisma.generatedReport.findUnique({
        where: { id: reportId },
      });

      if (report) {
        const content = extractReportContent(report);
        const chart = content.chart ? normalizeChart(content.chart) : null;

        data = {
          firstName: content.firstName,
          sun: translateSign(chart?.luminaries.sun.sign || "Bélier"),
          moon: translateSign(chart?.luminaries.moon.sign || "Taureau"),
          ascendant: translateSign(chart?.luminaries.ascendant.sign || "Gémeaux"),
          profileLine: `${content.introduction}`,
        };
      }
    } catch (error) {
      console.error("Error fetching natal report from Prisma:", error);
    }
  }

  // 2. Fallback to Local Storage if not found or no DB
  if (reportId !== "demo" && data.firstName === demoUser.firstName) {
    try {
      const { findLocalReport } = await import("@/lib/local-report-store");
      const localReport = await findLocalReport(reportId);

      if (localReport) {
        const content = localReport.contentJson;
        const chart = normalizeChart(content.chart);

        data = {
          firstName: localReport.user.firstName,
          sun: translateSign(chart.luminaries.sun.sign),
          moon: translateSign(chart.luminaries.moon.sign),
          ascendant: translateSign(chart.luminaries.ascendant.sign),
          profileLine: content.introduction,
        };
      }
    } catch (error) {
      console.error("Error fetching natal report from local store:", error);
    }
  }

  try {
    const pdfBuffer = await generateNatalPdfBuffer(data);
    const pdf = Buffer.from(pdfBuffer);

    console.log(`[PDF] Generated natal report for ${data.firstName} - Size: ${pdf.length} bytes`);

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": pdf.length.toString(),
        "Content-Disposition": `attachment; filename="Astral-Letters-Rapport-Natal-${encodeURIComponent(data.firstName)}.pdf"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Natal PDF Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate Natal PDF" }, { status: 500 });
  }
}
