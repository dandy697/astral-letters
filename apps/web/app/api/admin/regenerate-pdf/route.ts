import { NextResponse } from "next/server";
import { regenerateLocalReportPdf } from "@/lib/local-report-store";
import { prisma } from "@/lib/prisma";
import { regenerateReportPdf } from "@/lib/reports";

export async function POST(request: Request) {
  const formData = await request.formData();
  const reportId = String(formData.get("reportId") ?? "");

  if (!reportId) {
    return NextResponse.json({ error: "Missing report id" }, { status: 400 });
  }

  if (process.env.DATABASE_URL) {
    await regenerateReportPdf(reportId);
    await prisma.auditLog.create({
      data: {
        action: "report.regenerate_pdf",
        entityType: "generated_report",
        entityId: reportId,
        payload: { triggeredFrom: "admin" }
      }
    });
  } else {
    await regenerateLocalReportPdf(reportId);
  }

  return NextResponse.redirect(new URL("/admin?pdf=regenerated", request.url));
}
