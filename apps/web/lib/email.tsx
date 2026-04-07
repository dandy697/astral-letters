import { render } from "@react-email/components";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { CartReminderEmail } from "@/components/emails/cart-reminder-email";
import { ConversionEmail } from "@/components/emails/conversion-email";
import { FreePdfEmail } from "@/components/emails/free-pdf-email";
import { WelcomeEmail } from "@/components/emails/welcome-email";
import { MonthlyEmail } from "@/components/emails/monthly-email";
import { WeeklyEmail } from "@/components/emails/weekly-email";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

type EmailPayload = {
  subject: string;
  html: string;
  text: string;
};

async function deliverEmail(email: string, payload: EmailPayload) {
  if (!resend) {
    return { mocked: true, ...payload };
  }

  return resend.emails.send({
    from: "Astral Letters <hello@astralletters.app>",
    to: [email],
    subject: payload.subject,
    html: payload.html,
    text: payload.text
  });
}

export async function sendWelcomeEmail(email: string, firstName: string, summary: string, signs?: { sun?: string; moon?: string; ascendant?: string }) {
  const react = WelcomeEmail({
    firstName,
    summary,
    sun: signs?.sun ?? "Soleil",
    moon: signs?.moon ?? "Lune",
    ascendant: signs?.ascendant ?? "Ascendant"
  });
  const html = await render(react);
  const text = `Votre analyse astrologique personnalisée est prête\n\nBonjour ${firstName},\n\nSoleil ${signs?.sun ?? "Soleil"} • Lune ${signs?.moon ?? "Lune"} • Ascendant ${signs?.ascendant ?? "Ascendant"}\n\n${summary}\n\nVoir mon analyse : https://astralletters.app/resultat`;
  return deliverEmail(email, {
    subject: "Votre analyse astrologique personnalisée est prête",
    html,
    text
  });
}

export async function sendFreePdfEmail(email: string, firstName: string, pdfUrl?: string | null) {
  const href = pdfUrl?.startsWith("http") ? pdfUrl : `${env.NEXT_PUBLIC_APP_URL}${pdfUrl ?? "/resultat"}`;
  const react = FreePdfEmail({ firstName, downloadHref: href });
  const html = await render(react);
  const text = `Votre PDF découverte est disponible\n\nBonjour ${firstName},\n\nVoici votre premier rapport personnalisé. Téléchargez-le ici : ${href}`;
  return deliverEmail(email, {
    subject: "Votre PDF découverte est disponible",
    html,
    text
  });
}

export async function sendConversionEmail(email: string, firstName: string) {
  const react = ConversionEmail({ firstName });
  const html = await render(react);
  const text = `Allez plus loin avec vos prévisions personnalisées\n\nBonjour ${firstName},\n\nDébloquez vos lectures complètes et vos jours clés : https://astralletters.app/#tarifs`;
  return deliverEmail(email, {
    subject: "Allez plus loin avec vos prévisions personnalisées",
    html,
    text
  });
}

export async function sendMonthlyEmail(email: string, firstName: string, sections: Record<string, string>) {
  const react = MonthlyEmail({ firstName, sections, subject: `${firstName}, votre guidance du mois` });
  const html = await render(react);
  const text = `${firstName}, votre guidance du mois est prête.\n\nÉnergie générale: ${sections.generalEnergy}\n\nAmour: ${sections.love ?? ""}\n\nTravail: ${sections.work ?? ""}\n\nÉnergie: ${sections.wellbeing ?? ""}`;
  return deliverEmail(email, {
    subject: "Votre guidance mensuelle Astral Letters",
    html,
    text
  });
}

export async function sendWeeklyEmail(email: string, firstName: string, intro: string, keyDays: string[]) {
  const react = WeeklyEmail({ firstName, intro, keyDays });
  const html = await render(react);
  const text = `Vos énergies de la semaine\n\n${intro}\n\nJours clés: ${keyDays.join(" • ")}`;
  return deliverEmail(email, {
    subject: "Vos énergies de la semaine",
    html,
    text
  });
}

export async function sendCartReminderEmail(email: string, firstName: string) {
  const react = CartReminderEmail({ firstName });
  const html = await render(react);
  const text = `Votre lecture complète vous attend\n\nFinalisez votre accès à vos prévisions personnalisées : https://astralletters.app/#tarifs`;
  return deliverEmail(email, {
    subject: "Votre lecture complète vous attend",
    html,
    text
  });
}
