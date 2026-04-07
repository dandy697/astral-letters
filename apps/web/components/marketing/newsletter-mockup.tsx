"use client";

import { motion } from "framer-motion";
import { MailCheck, Sparkles } from "lucide-react";
import { demoUser, emailPreviews } from "@/lib/demo-content";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function NewsletterMockup() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
      <Card variant="premium" className="surface-grid overflow-hidden p-6 md:p-8">
        <div className="relative z-[1]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--accent-soft)] p-3">
                <MailCheck className="h-5 w-5 text-[var(--accent-strong)]" />
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Newsletter premium</p>
                <p className="font-sans text-sm font-semibold">{emailPreviews.monthlySubject}</p>
              </div>
            </div>
            <Badge variant="gold">Plus</Badge>
          </div>
          <div className="premium-divider my-6" />
          <p className="font-sans text-sm text-[var(--muted)]">Bonjour {demoUser.firstName},</p>
          <h3 className="mt-3 text-3xl leading-tight">Votre énergie du mois vous invite à choisir moins, mais mieux.</h3>
          <div className="mt-6 grid gap-4">
            {[
              ["Énergie générale", demoUser.summary],
              ["Amour", demoUser.love],
              ["Travail", demoUser.work]
            ].map(([title, body]) => (
              <div key={title} className="rounded-[24px] border border-[var(--border)] bg-white/80 p-4">
                <div className="font-sans text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">{title}</div>
                <p className="font-sans mt-2 text-sm leading-7 text-[var(--muted)]">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-[24px] bg-[var(--primary)] px-5 py-4 text-[var(--primary-foreground)]">
            <Sparkles className="h-4 w-4" />
            <p className="font-sans text-sm">Jours clés: {demoUser.keyDays.join(" • ")}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
