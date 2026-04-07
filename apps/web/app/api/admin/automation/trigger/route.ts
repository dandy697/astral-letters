import { NextResponse } from "next/server";
import { MonthlyGenerationService, createEmailProvider } from "@/lib/automation";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  // Simple security check
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId");

    const emailProvider = createEmailProvider({
      provider: env.RESEND_API_KEY ? "resend" : "console",
      apiKey: env.RESEND_API_KEY,
    });

    const service = new MonthlyGenerationService(emailProvider);
    
    if (targetUserId) {
      await service.generateForUser(targetUserId);
      return NextResponse.json({ success: true, processed: 1, userId: targetUserId });
    }

    const result = await service.generateForAllUsers();

    return NextResponse.json({ 
      success: true, 
      processed: result.processed,
      errors: result.errors
    });
  } catch (error: any) {
    console.error("[AUTOMATION TRIGGER] Failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
