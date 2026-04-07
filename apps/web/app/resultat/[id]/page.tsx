import Link from "next/link";
import { Sun, Moon, ArrowUp, Lock, ChevronRight, Download, Shield, Check, Star, ArrowRight, User, Heart, Briefcase, Sparkles } from "lucide-react";
import { demoUser, pricingPlans, oneShotOffer } from "@/lib/demo-content";
import { Footer } from "@/components/marketing/footer";
import { Header } from "@/components/marketing/header";
import { PricingCard } from "@/components/marketing/pricing-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { normalizeChart, translateSign } from "@/lib/astro-i18n";
import { prisma } from "@/lib/prisma";
import { extractReportContent } from "@/lib/report-content";
import { buildCheckoutLink } from "@/lib/checkout";
import { findLocalReport } from "@/lib/local-report-store";

export const dynamic = "force-dynamic";

type ResultPageProps = {
  params?: Promise<{ id: string }>;
};

export default async function ResultPage({ params }: ResultPageProps) {
  const id = (await params)?.id;
  
  let report = process.env.DATABASE_URL && id
    ? await prisma.generatedReport.findUnique({ where: { id }, include: { user: true } })
    : null;

  if (!report && id) {
    const local = await findLocalReport(id);
    if (local) {
      report = {
        id: local.id,
        userId: local.id,
        type: local.type as any,
        title: local.title,
        contentJson: local.contentJson as any,
        htmlSnapshot: local.htmlSnapshot,
        pdfUrl: local.pdfUrl,
        createdAt: new Date(local.createdAt),
        user: {
          firstName: local.user.firstName,
          email: local.user.email
        }
      } as any;
    }
  }

  const content = extractReportContent(report);
  const firstName = content.firstName || demoUser.firstName;
  
  const rawChart = (report as any)?.contentJson?.chart || (report as any)?.chartData;
  const chartData = rawChart 
    ? normalizeChart(rawChart) 
    : {
        luminaries: {
          sun: { sign: "Taurus", name: "Sun" },
          moon: { sign: "Scorpio", name: "Moon" },
          ascendant: { sign: "Leo" }
        }
      };

  const sunSign = chartData.luminaries?.sun?.sign || "Taureau";
  const moonSign = chartData.luminaries?.moon?.sign || "Scorpion";
  const ascendantSign = chartData.luminaries?.ascendant?.sign || "Lion";

  const pdfUrl = (report as any)?.pdfUrl || null;

  return (
    <>
      <Header />
      <main className="py-12 md:py-20 bg-[var(--background)]">
        <div className="container-shell">
          {/* 1. Header & Intro */}
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--success-soft)] text-[var(--success)] font-medium text-sm mb-6">
              <Check className="h-4 w-4" />
              Analyse terminée avec succès
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-serif">
              Votre Thème Astral, {firstName}.
            </h1>
            <p className="text-lg text-[var(--muted)] leading-relaxed italic">
              « {content.introduction} »
            </p>
          </div>

          {/* 2. Portrait (Cards) */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 border-none bg-[var(--surface)] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <Sun className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Position Solaire</p>
                  <h3 className="text-lg font-bold">{translateSign(sunSign)}</h3>
                </div>
              </div>
              <p className="text-sm text-[var(--muted)]">L&apos;essence de votre rayonnement et votre moteur principal.</p>
            </Card>

            <Card className="p-6 border-none bg-[var(--surface)] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Moon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Position Lunaire</p>
                  <h3 className="text-lg font-bold">{translateSign(moonSign)}</h3>
                </div>
              </div>
              <p className="text-sm text-[var(--muted)]">Votre paysage intérieur et la gestion de vos émotions.</p>
            </Card>

            <Card className="p-6 border-none bg-[var(--surface)] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <ArrowUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Ascendant</p>
                  <h3 className="text-lg font-bold">{translateSign(ascendantSign)}</h3>
                </div>
              </div>
              <p className="text-sm text-[var(--muted)]">La manière dont vous agissez et vous présentez au monde.</p>
            </Card>
          </div>

          {/* 3. Detailed Guidance */}
          <div className="max-w-4xl mx-auto space-y-8 mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <section>
                  <div className="flex items-center gap-3 mb-4 text-[var(--accent)] font-serif italic text-xl">
                    <Sparkles className="h-5 w-5" />
                    L&apos;énergie de votre mois
                  </div>
                  <p className="text-[var(--foreground)] leading-relaxed text-sm bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm">
                    {content.generalEnergy}
                  </p>
                </section>
                <section>
                  <div className="flex items-center gap-3 mb-4 text-rose-500 font-serif italic text-xl">
                    <Heart className="h-5 w-5" />
                    Amour & Relations
                  </div>
                  <p className="text-[var(--foreground)] leading-relaxed text-sm bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm">
                    {content.love}
                  </p>
                </section>
              </div>
              <div className="space-y-8">
                <section>
                  <div className="flex items-center gap-3 mb-4 text-blue-600 font-serif italic text-xl">
                    <Briefcase className="h-5 w-5" />
                    Travail & Projets
                  </div>
                  <p className="text-[var(--foreground)] leading-relaxed text-sm bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm">
                    {content.work}
                  </p>
                </section>
                <section>
                  <div className="flex items-center gap-3 mb-4 text-emerald-600 font-serif italic text-xl">
                    <Sparkles className="h-5 w-5" />
                    Équilibre & Vitalité
                  </div>
                  <p className="text-[var(--foreground)] leading-relaxed text-sm bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm">
                    {content.wellbeing}
                  </p>
                </section>
              </div>
            </div>

            {/* 4. Calendrier Personnel (Key Days) */}
            <Card className="p-10 bg-[var(--surface)] border border-[var(--border)] max-w-4xl mx-auto text-center md:text-left mb-12">
              <p className="eyebrow mb-4 text-[var(--accent)]">Calendrier personnel</p>
              <h2 className="text-2xl font-bold tracking-tight mb-8 font-serif">Vos jours clés du mois.</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {content.keyDays && content.keyDays.length > 0 ? (
                  content.keyDays.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-[var(--border)] bg-white shadow-sm">
                      <span className="text-[var(--accent)] font-bold mb-1 block text-lg">✧</span>
                      <span className="text-xs font-bold block mb-1">{item.date}</span>
                      <span className="text-[10px] text-[var(--muted)] leading-tight block">{item.note}</span>
                    </div>
                  ))
                ) : (
                  ["8 avril", "14 avril", "21 avril", "27 avril"].map((date, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-[var(--border)] bg-white">
                      <span className="text-[var(--accent)] font-bold mb-1 block">✧</span>
                      <span className="text-xs font-medium">{date}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* 5. PDF Download (Free) */}
            <div className="text-center py-12 border-y border-[var(--border)] my-16">
              <h3 className="text-xl font-bold mb-4 font-serif">Conservez votre profil astral</h3>
              <p className="text-[var(--muted)] mb-8 max-w-md mx-auto text-sm">
                Téléchargez immédiatement votre portrait de découverte au format PDF pour le relire à tout moment.
              </p>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-12 text-base font-semibold border-2 bg-white/5 hover:bg-white/10">
                  <a href={`/api/reports/${id}/download`} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-5 w-5" />
                    Télécharger mon Portrait
                  </a>
                </Button>
            </div>
          </div>

          {/* 6. Natal Report (Upsell) */}
          <section className="pt-20 border-t border-[var(--border)] mb-24">
            <div className="text-center mb-12">
               <p className="eyebrow mb-3">L&apos;édition de référence</p>
               <h2 className="text-4xl font-serif">Le Manuel de Votre Vie</h2>
               <p className="text-[var(--muted)] mt-2 italic">Votre thème astral complet en 26 pages</p>
            </div>
            
            <Card className="p-6 md:p-12 border-2 border-[var(--accent-soft)] relative overflow-hidden bg-gradient-to-br from-[#FAF8F6] to-[#F3EFED] shadow-2xl max-w-5xl mx-auto">
              {/* ... existing card content ... */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6">
                <Badge variant="gold" className="px-3 py-1 md:px-4 md:py-1.5 shadow-sm text-[10px] md:text-xs">Édition Unique</Badge>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
                <div className="max-w-xl text-center md:text-left pt-8 md:pt-0">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 md:mb-6">Le document de toute une vie.</h3>
                  <p className="text-[var(--muted)] mb-8 md:mb-10 leading-relaxed text-base md:text-lg px-2 md:px-0">
                    Une analyse exhaustive, claire et profondément personnelle. Un manuel indispensable pour comprendre votre ADN stellaire, vos cycles longs et vos forces innées.
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-10">
                    <Button asChild size="lg" variant="default" className="h-14 px-8 text-lg shadow-xl shadow-[var(--accent-soft)] hover:scale-105 transition-transform">
                      <Link href={buildCheckoutLink({ offer: "rapport-natal", reportId: id })}>
                        Commander mon Rapport Natal
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    
                    <div className="flex items-center gap-2 font-serif">
                      <span className="text-4xl font-bold text-[var(--accent)]">29€</span>
                      <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] opacity-70 leading-none">Paiement<br/>unique</span>
                    </div>
                  </div>
                </div>
                
                <div className="hidden lg:block">
                  <div className="relative h-64 w-48 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-[var(--border)] overflow-hidden transition-transform hover:rotate-3">
                     <div className="h-6 bg-[var(--primary-soft)] w-full mb-3" />
                     <div className="p-6 space-y-3">
                        <div className="h-3 bg-gray-100 w-3/4 rounded" />
                        <div className="h-3 bg-gray-100 w-1/2 rounded" />
                        <div className="h-24 bg-gray-50 w-full rounded-lg border border-dashed border-gray-200 mt-6 flex items-center justify-center">
                           <Sparkles className="h-8 w-8 text-amber-200" />
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* 7. Pricing Plans (Subscriptions) - Moved to bottom */}
          <section id="paywall" className="mb-24 pt-20 border-t border-[var(--border)]">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <p className="eyebrow mb-4">Abonnements</p>
              <h2 className="section-title mb-6 text-4xl font-serif">Accompagnez vos décisions au quotidien.</h2>
              <p className="section-copy mx-auto text-sm">
                Choisissez la formule qui vous convient pour recevoir vos lectures détaillées et vos transits chaque mois.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
              {pricingPlans.map((plan) => (
                <PricingCard key={plan.slug} {...plan} reportId={id} />
              ))}
            </div>
          </section>

          <div className="mt-16 text-center text-[var(--muted)] text-sm flex items-center justify-center gap-8">
             <div className="flex items-center gap-2">
               <Shield className="h-4 w-4" />
               Protection des données
             </div>
             <div className="flex items-center gap-2">
               <Sparkles className="h-4 w-4 text-amber-400" />
               Calcul astronomique réel
             </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
