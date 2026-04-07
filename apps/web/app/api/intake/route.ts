import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { calculateChart } from "@/lib/astro";
import { generatePremiumContent } from "@/lib/content";
import { sendFreePdfEmail, sendWelcomeEmail } from "@/lib/email";
import { createLocalFreeTeaserReport } from "@/lib/local-report-store";
import { prisma } from "@/lib/prisma";
import { createFreeTeaserReport } from "@/lib/reports";
import { intakeSchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[INTAKE][${requestId}] Starting new request processing...`);
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

      console.log(`[INTAKE][${requestId}] Generating PDF teaser...`);
      try {
        const report = await createFreeTeaserReport({
          userId: user.id,
          firstName: input.firstName,
          chart
        });

        resultUrl = `/resultat/${report.id}`;
        pdfUrl = report.pdfUrl;
      } catch (pdfErr) {
        console.error(`[INTAKE][${requestId}] PDF Generation failed, but user record exists. Proceeding to web result.`, pdfErr);
        // Fallback: create a report entry WITHOUT PDF if generation crashed
        const fallbackReport = await prisma.generatedReport.create({
          data: {
            userId: user.id,
            type: "FREE_TEASER",
            deliveryChannel: "EMAIL",
            title: `Aperçu gratuit • ${new Date().toLocaleDateString("fr-FR")}`,
            contentJson: { 
              ...content,
              chart 
            } as any,
            htmlSnapshot: "<h1>PDF Generation Failed</h1>",
          }
        });
        resultUrl = `/resultat/${fallbackReport.id}`;
      }
    } else {
      console.log(`[INTAKE][${requestId}] Local storage used (No DATABASE_URL).`);
      try {
        const report = await createLocalFreeTeaserReport({
          firstName: input.firstName,
          email: input.email,
          chart
        });

        resultUrl = `/resultat/${report.id}`;
        pdfUrl = report.pdfUrl;
      } catch (localErr) {
        console.error(`[INTAKE][${requestId}] Local report storage/PDF failed.`, localErr);
        throw localErr; // Re-throw to be caught by main handler
      }
    }

    // Attempt to send emails but don't fail the whole request if mailing fails
    try {
      console.log(`[INTAKE][${requestId}] Sending emails...`);
      await sendWelcomeEmail(input.email, input.firstName, content.generalEnergy, {
        sun: chart.luminaries.sun.sign,
        moon: chart.luminaries.moon.sign,
        ascendant: chart.luminaries.ascendant.sign
      });
      await sendFreePdfEmail(input.email, input.firstName, pdfUrl);
    } catch (mailError) {
      console.error("[INTAKE] Non-critical error sending emails:", mailError);
    }

    console.log(`[INTAKE][${requestId}] Processing complete. Redirecting to ${resultUrl}`);
    return NextResponse.json({
      summary: `${content.introduction} ${content.generalEnergy}`,
      chart,
      resultUrl,
      pdfUrl
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      console.warn(`[INTAKE][${requestId}] Validation error:`, error.errors);
      return NextResponse.json({ error: "Données invalides. Veuillez vérifier vos informations." }, { status: 400 });
    }
    
    console.error(`[INTAKE][${requestId}] Unhandled critical error:`, error.message, error.stack);
    return NextResponse.json({ 
      error: `Une erreur critique est survenue (${error.message || "Unknown"}). Nos éphémérides sont peut-être momentanément indisponibles.` 
    }, { status: 500 });
  }
}
