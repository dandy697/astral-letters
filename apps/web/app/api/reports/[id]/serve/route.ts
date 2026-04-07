import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import path from "node:path";
import { webPublicReportsRoot } from "@/lib/paths";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const filePath = path.join(webPublicReportsRoot, id);

  try {
    const fileBuffer = await readFile(filePath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${id}"`,
      },
    });
  } catch (error) {
    console.error(`[PDF SERVE] File not found: ${filePath}`, error);
    return NextResponse.json({ error: "Rapport introuvable" }, { status: 404 });
  }
}
