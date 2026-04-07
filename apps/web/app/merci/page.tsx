import Link from "next/link";
import { CheckCircle2, RotateCcw, ArrowRight, Download } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { Header } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buildCheckoutLink } from "@/lib/checkout";

type ThankYouPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const params = searchParams ? await searchParams : {};
  const status = typeof params.status === "string" ? params.status : "success";
  const offer = typeof params.offer === "string" ? params.offer : "plus";
  const reportId = typeof params.report === "string" ? params.report : null;
  const isCancelled = status === "cancelled";

  return (
    <>
      <Header />
      <main className="py-16 md:py-24 bg-[var(--background)]">
        <div className="container-shell">
          <Card className="mx-auto max-w-2xl p-8 md:p-12 text-center">
            <div className="inline-flex rounded-full p-3 mb-6" style={{ background: isCancelled ? "var(--accent-soft)" : "rgba(62, 142, 109, 0.1)" }}>
              {isCancelled ? (
                <RotateCcw className="h-6 w-6 text-[var(--accent)]" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-[var(--success)]" />
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {isCancelled
                ? "Votre lecture complète vous attend toujours."
                : "Merci ! Votre accès est confirmé."}
            </h1>

            <p className="text-[var(--muted)] leading-relaxed mb-8 max-w-md mx-auto">
              {isCancelled
                ? "Votre commande n'a pas été finalisée. Vous pouvez reprendre votre parcours au même point."
                : "Le paiement a été reçu. Vos contenus premium sont en cours de génération et seront bientôt disponibles."}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {!isCancelled && offer === "rapport-natal" && (
                <Button asChild size="lg">
                  <a href={`/api/reports/${reportId || "demo"}/natal/download`} download>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger mon Rapport Natal
                  </a>
                </Button>
              )}

              {!isCancelled && offer !== "rapport-natal" && (
                <Button asChild size="lg">
                  <Link href={reportId ? `/resultat/${reportId}` : "/"}>
                    Voir ma lecture
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}

              {isCancelled && (
                <Button asChild size="lg">
                  <Link href={buildCheckoutLink({ offer, reportId })}>
                    Reprendre le paiement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}

              <Button asChild variant="outline" size="lg">
                <Link href="/">Retour à l&apos;accueil</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
