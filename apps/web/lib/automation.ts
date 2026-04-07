/**
 * Automation Service Layer
 * ========================
 * Interfaces and services for future automated generation of readings, PDFs, and emails.
 * 
 * This module is designed to be called by:
 * - A cron job (Vercel Cron, Railway cron, etc.)
 * - A manual admin trigger
 * - A future queue worker (BullMQ, etc.)
 * 
 * Currently, generation is synchronous. In production, move to a job queue.
 */

import type { AstroChart } from "@/lib/astro";
import { generatePremiumContent } from "@/lib/content";

// ═══════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════

export type AutomationJob = {
  type: "monthly_reading" | "weekly_reading" | "pdf_generation" | "email_delivery";
  userId: string;
  status: "pending" | "processing" | "completed" | "failed";
  scheduledAt: Date;
  completedAt?: Date;
  error?: string;
  metadata?: Record<string, unknown>;
};

export type EmailProvider = "resend" | "brevo" | "console";

export type EmailProviderConfig = {
  provider: EmailProvider;
  apiKey?: string;
  fromEmail?: string;
  fromName?: string;
};

// ═══════════════════════════════════════════════════════
// Email Provider Abstraction
// ═══════════════════════════════════════════════════════

export interface IEmailProvider {
  sendEmail(to: string, subject: string, html: string, text: string): Promise<{ id?: string; success: boolean }>;
}

export class ConsoleEmailProvider implements IEmailProvider {
  async sendEmail(to: string, subject: string, _html: string, text: string) {
    console.log(`[EMAIL-CONSOLE] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL-CONSOLE] Body: ${text.slice(0, 200)}...`);
    return { success: true, id: `console-${Date.now()}` };
  }
}

export class ResendEmailProvider implements IEmailProvider {
  private apiKey: string;
  private from: string;

  constructor(apiKey: string, from: string = "Astral Letters <hello@astralletters.app>") {
    this.apiKey = apiKey;
    this.from = from;
  }

  async sendEmail(to: string, subject: string, html: string, text: string) {
    const { Resend } = await import("resend");
    const resend = new Resend(this.apiKey);
    const result = await resend.emails.send({
      from: this.from,
      to: [to],
      subject,
      html,
      text,
    });
    return { success: true, id: result.data?.id };
  }
}

/**
 * Future Brevo provider placeholder.
 * Implement when Brevo API is ready to be integrated.
 */
export class BrevoEmailProvider implements IEmailProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendEmail(to: string, subject: string, html: string, _text: string) {
    // TODO: Implement Brevo API call
    // const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    //   method: "POST",
    //   headers: {
    //     "api-key": this.apiKey,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     sender: { name: "Astral Letters", email: "hello@astralletters.app" },
    //     to: [{ email: to }],
    //     subject,
    //     htmlContent: html,
    //   }),
    // });
    console.log(`[BREVO-STUB] Would send to ${to}: ${subject}`);
    return { success: true, id: `brevo-stub-${Date.now()}` };
  }
}

export function createEmailProvider(config?: EmailProviderConfig): IEmailProvider {
  if (!config || config.provider === "console") {
    return new ConsoleEmailProvider();
  }
  if (config.provider === "resend" && config.apiKey) {
    return new ResendEmailProvider(config.apiKey, config.fromEmail);
  }
  if (config.provider === "brevo" && config.apiKey) {
    return new BrevoEmailProvider(config.apiKey);
  }
  return new ConsoleEmailProvider();
}

// ═══════════════════════════════════════════════════════
// Automation Runner Interfaces
// ═══════════════════════════════════════════════════════

/**
 * Monthly generation workflow:
 * 1. For each active user with a natal chart
 * 2. Generate monthly reading content
 * 3. Create GeneratedReport in DB
 * 4. Generate PDF
 * 5. Send email via configured provider
 */
export interface IMonthlyGenerationService {
  generateForAllUsers(): Promise<{ processed: number; errors: number }>;
  generateForUser(userId: string): Promise<void>;
}

/**
 * Weekly generation workflow:
 * Similar to monthly but lighter content
 */
export interface IWeeklyGenerationService {
  generateForAllUsers(): Promise<{ processed: number; errors: number }>;
  generateForUser(userId: string): Promise<void>;
}

/**
 * PDF generation service
 */
export interface IPdfGenerationService {
  generateTeaser(userId: string): Promise<{ pdfUrl: string }>;
  generatePremium(userId: string): Promise<{ pdfUrl: string }>;
  regenerate(reportId: string): Promise<{ pdfUrl: string }>;
}

// ═══════════════════════════════════════════════════════
// Content Generation Helpers
// ═══════════════════════════════════════════════════════

/**
 * Generate reading content from a chart.
 * This is the bridge between raw astro data and user-facing text.
 */
export function generateReadingContent(
  firstName: string,
  chart: AstroChart,
  variant: "free" | "weekly" | "monthly" | "premium-pdf"
) {
  return generatePremiumContent(firstName, chart, variant);
}

// ═══════════════════════════════════════════════════════
// Email Template Types
// ═══════════════════════════════════════════════════════

export type EmailTemplate =
  | "welcome"
  | "free_pdf_delivery"
  | "conversion"
  | "monthly_newsletter"
  | "weekly_update"
  | "cart_reminder";

export type EmailTemplateData = {
  firstName: string;
  email: string;
  sections?: Record<string, string>;
  pdfUrl?: string;
  keyDays?: string[];
  signs?: { sun?: string; moon?: string; ascendant?: string };
};

/**
 * Map of template types to their subjects
 */
export const EMAIL_SUBJECTS: Record<EmailTemplate, (firstName: string) => string> = {
  welcome: (name) => `${name}, votre analyse astrologique est prête`,
  free_pdf_delivery: () => "Votre PDF découverte est disponible",
  conversion: () => "Allez plus loin avec vos prévisions personnalisées",
  monthly_newsletter: (name) => `${name}, votre guidance mensuelle`,
  weekly_update: () => "Vos tendances de la semaine",
  cart_reminder: () => "Votre lecture complète vous attend",
};

// ═══════════════════════════════════════════════════════
// Cron Job Definitions (for future scheduler)
// ═══════════════════════════════════════════════════════

export const AUTOMATION_SCHEDULES = {
  /** First of each month at 8:00 AM Paris time */
  monthlyReading: "0 8 1 * *",
  /** Every Monday at 8:00 AM Paris time */
  weeklyReading: "0 8 * * 1",
  /** PDF generation follows reading generation */
  pdfAfterReading: "triggered",
  /** Email follows PDF generation */
  emailAfterPdf: "triggered",
} as const;
