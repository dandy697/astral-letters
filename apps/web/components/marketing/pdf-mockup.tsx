"use client";

import { motion } from "framer-motion";
import { FileText, Quote } from "lucide-react";
import { demoUser } from "@/lib/demo-content";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function PDFMockup() {
  return (
    <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <Card variant="tinted" className="overflow-hidden p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white p-3 shadow-[var(--shadow-soft)]">
              <FileText className="h-5 w-5 text-[var(--accent-strong)]" />
            </div>
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--muted)]">PDF premium</p>
              <p className="font-sans text-sm font-semibold">Rapport mensuel d’avril</p>
            </div>
          </div>
          <Badge variant="soft">Premium</Badge>
        </div>
        <div className="mt-6 rounded-[28px] bg-white p-6 shadow-[var(--shadow-soft)]">
          <p className="font-sans text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Pour {demoUser.firstName}</p>
          <h3 className="mt-3 text-3xl leading-tight">Un mini magazine personnel conçu pour durer.</h3>
          <div className="premium-divider my-6" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] bg-[var(--background-soft)] p-4">
              <p className="font-sans text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">Profil astral</p>
              <p className="font-sans mt-2 text-sm leading-7 text-[var(--muted)]">
                Soleil {demoUser.sun} • Lune {demoUser.moon} • Ascendant {demoUser.ascendant}
              </p>
            </div>
            <div className="rounded-[24px] bg-[var(--background-soft)] p-4">
              <p className="font-sans text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">Jours clés</p>
              <p className="font-sans mt-2 text-sm leading-7 text-[var(--muted)]">{demoUser.keyDays.join(" • ")}</p>
            </div>
          </div>
          <div className="mt-4 rounded-[24px] border border-[var(--border)] p-4">
            <Quote className="h-4 w-4 text-[var(--gold)]" />
            <p className="mt-3 text-xl leading-8">Le vrai luxe, ce mois-ci, consiste à protéger votre énergie avant de la disperser.</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
