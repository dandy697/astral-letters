import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { calculateChart } from "@/lib/astro";
import { generatePremiumContent } from "@/lib/content";
import { sendFreePdfEmail, sendWelcomeEmail } from "@/lib/email";
import { createLocalFreeTeaserReport } from "@/lib/local-report-store";
import { prisma } from "@/lib/prisma";
import { createFreeTeaserReport } from "@/lib/reports";
import { intakeSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  console.log("[INTAKE] Starting new request processing...");
  try {
    const body = await request.json();
    const input = intakeSchema.parse(body);
    console.log(`[INTAKE] Validation successful for ${input.email}`);

    console.log("[INTAKE] Calculating chart...");
    const chart = await calculateChart(input);
    
    console.log("[INTAKE] Generating content...");
    const content = generatePremiumContent(input.firstName, chart, "free");

    let resultUrl: string | null = null;
    let pdfUrl: string | null = null;

    if (process.env.DATABASE_URL) {
      console.log("[INTAKE] Permanent storage (Prisma) active.");
      const user = await prisma.user.upsert({
        where: { email: input.email },
        update: { firstName: input.firstName },
        create: {
          email: input.email,
          firstName: input.firstName
        }
      });

      await prisma.lead.create({
        data: {
          email: input.email,
          firstName: input.firstName,
          consentText: "Consentement capturé depuis le formulaire sanctuary.",
          userId: user.id
        }
      });

      await prisma.birthProfile.upsert({
        where: { userId: user.id },
        update: {
          birthDate: new Date(`${input.birthDate}T00:00:00.000Z`),
          birthTime: input.birthTime || null,
          birthLocation: chart.birth_profile.location,
          latitude: chart.birth_profile.latitude,
          longitude: chart.birth_profile.longitude,
          timezone: chart.birth_profile.timezone,
          isBirthTimeApprox: chart.birth_profile.is_approximate_time
        },
        create: {
          userId: user.id,
          birthDate: new Date(`${input.birthDate}T00:00:00.000Z`),
          birthTime: input.birthTime || null,
          birthLocation: chart.birth_profile.location,
          latitude: chart.birth_profile.latitude,
          longitude: chart.birth_profile.longitude,
          timezone: chart.birth_profile.timezone,
          isBirthTimeApprox: chart.birth_profile.is_approximate_time
        }
      });

      await prisma.natalChart.upsert({
        where: { userId: user.id },
        update: {
          sunSign: chart.luminaries.sun.sign,
          moonSign: chart.luminaries.moon.sign,
          ascendantSign: chart.luminaries.ascendant.sign,
          chartJson: chart,
          technicalSummary: chart.transit_summary.technical_summary
        },
        create: {
          userId: user.id,
          sunSign: chart.luminaries.sun.sign,
          moonSign: chart.luminaries.moon.sign,
          ascendantSign: chart.luminaries.ascendant.sign,
          chartJson: chart,
          technicalSummary: chart.transit_summary.technical_summary
        }
      });

      const report = await createFreeTeaserReport({
        userId: user.id,
        firstName: input.firstName,
        chart
      });

      resultUrl = `/resultat/${report.id}`;
      pdfUrl = report.pdfUrl;
    } else {
      console.log("[INTAKE] Local storage used (No DATABASE_URL).");
      const report = await createLocalFreeTeaserReport({
        firstName: input.firstName,
        email: input.email,
        chart
      });

      resultUrl = `/resultat/${report.id}`;
      pdfUrl = report.pdfUrl;
    }

    // Attempt to send emails but don't fail the whole request if mailing fails
    try {
      console.log("[INTAKE] Sending emails...");
      await sendWelcomeEmail(input.email, input.firstName, content.generalEnergy, {
        sun: chart.luminaries.sun.sign,
        moon: chart.luminaries.moon.sign,
        ascendant: chart.luminaries.ascendant.sign
      });
      await sendFreePdfEmail(input.email, input.firstName, pdfUrl);
    } catch (mailError) {
      console.error("[INTAKE] Non-critical error sending emails:", mailError);
    }

    console.log("[INTAKE] Processing complete.");
    return NextResponse.json({
      summary: `${content.introduction} ${content.generalEnergy}`,
      chart,
      resultUrl,
      pdfUrl
    });
  } catch (error) {
    if (error instanceof ZodError) {
      console.warn("[INTAKE] Validation error:", error.errors);
      return NextResponse.json({ error: "Données invalides. Veuillez vérifier vos informations." }, { status: 400 });
    }
    
    console.error("[INTAKE] Unhandled critical error:", error);
    return NextResponse.json({ 
      error: "Une erreur critique est survenue. Nos éphémérides sont peut-être momentanément indisponibles." 
    }, { status: 500 });
  }
}
