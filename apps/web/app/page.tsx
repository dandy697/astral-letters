"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  X,
  Shield,
  Mail,
  FileText,
  CalendarDays,
  Sparkles,
  Star,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { BirthForm } from "@/components/forms/birth-form";
import { Footer } from "@/components/marketing/footer";
import { Header } from "@/components/marketing/header";
import { PricingCard } from "@/components/marketing/pricing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  calculationSteps,
  comparisonRows,
  ctas,
  demoUser,
  faqItems,
  heroCopy,
  oneShotOffer,
  personalizationProof,
  pricingPlans,
  receiveCards,
  trustBarItems,
} from "@/lib/demo-content";
import { buildCheckoutLink } from "@/lib/checkout";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors pr-4">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-[var(--muted)] shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-sm text-[var(--muted)] leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  const [firstName, setFirstName] = useState("");
  const receiveIcons = [
    <Mail key="mail" className="h-8 w-8" />,
    <CalendarDays key="cal" className="h-8 w-8" />,
    <FileText key="file" className="h-8 w-8" />,
  ];

  return (
    <>
      <Header />
      <main className="overflow-x-hidden">
        {/* ═══ 1. HERO ═══ */}
        <section className="relative min-h-[70vh] flex flex-col justify-center bg-[var(--background)]">
          <div className="container-shell section-wrap">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="label-pill mb-8 mx-auto w-fit">
                  <span className="text-[var(--primary)] font-bold">✦</span>
                  Astral Letters
                </div>

                <h1 className="hero-title mb-6 leading-tight">{heroCopy.title}</h1>

                <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed max-w-2xl mx-auto mb-10">
                  {heroCopy.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="xl">
                    <Link href="#capture">
                      {ctas.heroPrimary}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="xl">
                    <Link href="#tarifs">{ctas.heroSecondary}</Link>
                  </Button>
                </div>

                <div className="mt-14 flex flex-col md:flex-row items-center justify-center gap-x-8 gap-y-4 pt-8 opacity-80">
                  {heroCopy.reassurance.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-center md:text-left">
                      <Check className="h-4 w-4 text-[var(--success)] shrink-0" />
                      <span className="text-sm text-[var(--muted)] font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>



        {/* ═══ 3. CE QUE VOUS RECEVEZ ═══ */}
        <section id="ce-que-vous-recevez" className="section-wrap bg-[var(--background)]">
          <div className="container-shell">
            <motion.div {...fadeInUp} className="max-w-2xl mb-16">
              <p className="eyebrow mb-4">Ce que vous recevez</p>
              <h2 className="section-title mb-6">
                Une lecture personnelle, claire et utile.
              </h2>
              <p className="section-copy">
                Chaque mois, nous transformons votre thème natal réel en contenu
                lisible et actionnable. Pas un horoscope générique — votre
                lecture, calculée pour vous.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {receiveCards.map((item, index) => {
                const colors = ["bg-purple-100 text-purple-600", "bg-amber-100 text-amber-600", "bg-neutral-900 text-white"];
                return (
                  <motion.div
                    key={item.title}
                    {...fadeInUp}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-8 h-full hover:shadow-md transition-all group">
                      <div className={`mb-6 h-12 w-12 rounded-xl flex items-center justify-center ${colors[index]}`}>
                        {receiveIcons[index]}
                      </div>
                      <h3 className="text-xl font-bold mb-3 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[var(--muted)] leading-relaxed">
                        {item.body}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ 4. COMMENT C'EST CALCULÉ ═══ */}
        <section id="comment-ca-marche" className="section-wrap bg-[var(--surface)] border-y border-[var(--border)]">
          <div className="container-shell">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeInUp}>
                <p className="eyebrow mb-4">Comment ça fonctionne</p>
                <h2 className="section-title mb-6">
                  De vos données à une lecture concrète.
                </h2>
                <p className="section-copy mb-12">
                  Votre thème est calculé à partir de données astronomiques réelles utilisées par les professionnels pour une précision absolue.
                </p>

                <div className="space-y-8">
                  {calculationSteps.map((step, index) => (
                    <div key={step.title} className="flex gap-5 group">
                      <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center text-sm font-bold text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-base font-bold mb-1">{step.title}</h4>
                        <p className="text-sm text-[var(--muted)] leading-relaxed">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-10 rounded-2xl bg-gradient-to-br from-[var(--background)] to-[var(--surface)] border border-[var(--border)] shadow-inner"
              >
                <div className="flex items-center gap-2 mb-8">
                  <Star className="h-5 w-5 text-[var(--accent)]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                    Aperçu du résultat
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                      Profil astral
                    </p>
                    <p className="text-lg font-bold">
                      ☀️ {demoUser.sun} · 🌙 {demoUser.moon} · ↑ {demoUser.ascendant}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                      Lecture du mois
                    </p>
                    <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-3">
                      {demoUser.summary}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                      Jours à retenir
                    </p>
                    <div className="space-y-1">
                      {demoUser.keyDays.slice(0, 3).map((day) => (
                        <p key={day} className="text-sm text-[var(--foreground)]">
                          📅 {day}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-xs text-[var(--muted-foreground)] text-center">
                  (Exemple pour Camille, née le 18/11/1993 à Lyon)
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ 5. DIFFÉRENCIATION ═══ */}
        <section className="section-wrap bg-[var(--background)]">
          <div className="container-shell">
            <motion.div {...fadeInUp} className="max-w-2xl mb-16">
              <p className="eyebrow mb-4">La différence</p>
              <h2 className="section-title mb-6">
                Horoscope générique vs Astral Letters
              </h2>
            </motion.div>

            {/* Desktop View: Table */}
            <motion.div {...fadeInUp} className="hidden md:block w-full overflow-hidden rounded-2xl border border-[var(--border)]">
              <div className="grid grid-cols-2 bg-[var(--surface)]">
                <div className="p-6 border-r border-b border-[var(--border)]">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                    Horoscope classique
                  </p>
                </div>
                <div className="p-6 border-b border-[var(--border)] bg-[var(--primary-soft)]">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                    Astral Letters
                  </p>
                </div>
              </div>
              {comparisonRows.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 border-b border-[var(--border)] last:border-b-0 group"
                >
                  <div className="p-6 border-r border-[var(--border)] flex items-start gap-4 transition-colors group-hover:bg-[var(--surface-soft)]">
                    <X className="h-4 w-4 mt-1 text-[var(--danger)] shrink-0 opacity-60" />
                    <span className="text-sm text-[var(--muted)] leading-relaxed">
                      {row.generic}
                    </span>
                  </div>
                  <div className="p-6 bg-[var(--primary-soft)] flex items-start gap-4 transition-colors group-hover:bg-[#f0f4ff]">
                    <Check className="h-5 w-5 mt-0.5 text-[var(--success)] shrink-0" />
                    <span className="text-base text-[var(--foreground)] font-semibold leading-snug">
                      {row.astral}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-4">
              {comparisonRows.map((row, i) => (
                <motion.div
                  key={i}
                  {...fadeInUp}
                  className="rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm"
                >
                  <div className="p-5 bg-[var(--surface)] border-b border-[var(--border)] flex items-start gap-3">
                    <X className="h-4 w-4 mt-0.5 text-[var(--danger)] shrink-0 opacity-50" />
                    <span className="text-sm text-[var(--muted)] leading-relaxed">
                      {row.generic}
                    </span>
                  </div>
                  <div className="p-5 bg-[var(--primary-soft)] flex items-start gap-3">
                    <Check className="h-5 w-5 mt-0.5 text-[var(--success)] shrink-0" />
                    <span className="text-[15px] text-[var(--foreground)] font-bold leading-tight">
                      {row.astral}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 6. FORMULAIRE GRATUIT ═══ */}
        <section
          id="capture"
          className="section-wrap bg-[var(--surface)] border-y border-[var(--border)]"
        >
          <div className="container-shell">
            <motion.div
              {...fadeInUp}
              className="grid lg:grid-cols-[0.8fr_1.2fr] gap-16 items-start"
            >
              <div>
                <p className="eyebrow mb-4">Commencez gratuitement</p>
                <h2 className="section-title mb-6">
                  {firstName ? `${firstName}, votre premier aperçu offert.` : "Votre premier aperçu, offert."}
                </h2>
                <p className="section-copy mb-10">
                  Entrez vos données et découvrez immédiatement votre profil astral et une première lecture de votre période.
                </p>

                <div className="space-y-6">
                  {personalizationProof.map((item, index) => {
                    let displayTitle: string = item.title;
                    if (firstName && index === 0) displayTitle = `Signature : ${firstName}`;
                    if (firstName && index === 1) displayTitle = `Vos 10 planètes, ${firstName}`;

                    return (
                      <div key={item.title} className="flex gap-4">
                        <div className="h-8 w-8 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-xs font-bold text-[var(--accent)] shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-sm mb-1">
                            {displayTitle}
                          </p>
                          <p className="text-xs text-[var(--muted)] leading-relaxed">
                            {item.body}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <BirthForm onNameChange={setFirstName} />
            </motion.div>
          </div>
        </section>

        {/* ═══ 7. TARIFS ═══ */}
        <section id="tarifs" className="section-wrap bg-[var(--background)]">
          <div className="container-shell">
            <motion.div {...fadeInUp} className="text-center mb-16 max-w-2xl mx-auto">
              <p className="eyebrow mb-4">Abonnements</p>
              <h2 className="section-title mb-6">
                Choisissez votre niveau de lecture.
              </h2>
              <p className="section-copy mx-auto">
                Trois formules pour accompagner vos décisions au quotidien. Sans engagement, résiliable en un clic.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pricingPlans.map((plan) => (
                <PricingCard key={plan.slug} {...plan} />
              ))}
            </div>

            {/* One-shot offer */}
            <motion.div {...fadeInUp} className="mt-12 max-w-5xl mx-auto">
              <Card variant="dark" className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] blur-[100px] opacity-10 -mr-20 -mt-20" />
                <div className="relative z-10">
                  <Badge variant="gold" className="mb-4">
                    Paiement unique
                  </Badge>
                  <h3 className="text-3xl font-bold tracking-tight text-white mb-3">
                    {oneShotOffer.name} — {oneShotOffer.price}
                  </h3>
                  <p className="text-white/70 text-sm max-w-md leading-relaxed">
                    {oneShotOffer.description}
                  </p>
                </div>
                <Button
                  asChild
                  variant="gold"
                  size="lg"
                  className="shrink-0 relative z-10"
                >
                  <Link href="#capture">
                    {oneShotOffer.cta}
                  </Link>
                </Button>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ═══ 8. FAQ ═══ */}
        <section id="faq" className="section-wrap bg-[var(--surface)] border-y border-[var(--border)]">
          <div className="container-shell max-w-3xl">
            <motion.div {...fadeInUp} className="text-center mb-12">
              <p className="eyebrow mb-4">Questions fréquentes</p>
              <h2 className="section-title">Tout ce que vous devez savoir.</h2>
            </motion.div>

            <motion.div {...fadeInUp} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
              {faqItems.map((item) => (
                <FAQItem key={item.question} {...item} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ 9. CTA FINAL ═══ */}
        <section className="section-wrap bg-[var(--background)]">
          <div className="container-shell text-center">
            <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
              <Sparkles className="h-8 w-8 text-[var(--accent)] mx-auto mb-6" />
              <h3 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 leading-tight">
                Votre thème astral vous attend.
              </h3>
              <p className="text-lg text-[var(--muted)] mb-10 max-w-lg mx-auto">
                Gratuit. Immédiat. Basé sur vos vraies données.
              </p>
              <Button asChild size="xl">
                <Link href="#capture">
                  Recevoir ma lecture personnalisée
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
