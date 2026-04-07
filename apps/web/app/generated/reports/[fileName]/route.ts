import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { webAppRoot, webPublicReportsRoot } from "@/lib/paths";

export const dynamic = "force-dynamic";

function resolveCandidates(fileName: string) {
  return [
    path.join(webPublicReportsRoot, fileName),
    path.join(webAppRoot, "apps", "web", "public", "generated", "reports", fileName)
  ];
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ fileName: string }> }
) {
  const { fileName } = await context.params;

  for (const candidate of resolveCandidates(fileName)) {
    try {
      await access(candidate);
      const bytes = await readFile(candidate);
      return new NextResponse(bytes, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${fileName}"`,
          "Cache-Control": "public, max-age=0, must-revalidate"
        }
      });
    } catch {
      continue;
    }
  }

  return NextResponse.json({ error: "PDF not found" }, { status: 404 });
}
