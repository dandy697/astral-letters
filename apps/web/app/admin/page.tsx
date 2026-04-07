import Link from "next/link";
import { Users, FileText, Mail, CreditCard, RefreshCw, Eye, ArrowLeft } from "lucide-react";
import { getLocalAdminSnapshot } from "@/lib/local-report-store";
import { translateReportType } from "@/lib/astro-i18n";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

async function getAdminStats() {
  if (!process.env.DATABASE_URL) {
    return getLocalAdminSnapshot();
  }

  const [leads, users, activeSubscriptions, reports, newsletters, latestUsers] =
    await Promise.all([
      prisma.lead.count(),
      prisma.user.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.generatedReport.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
      prisma.newsletterLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          subscriptions: { include: { offer: true } },
          natalChart: true,
          birthProfile: true,
        },
      }),
    ]);

  return { leads, users, activeSubscriptions, reports, newsletters, latestUsers };
}

export default async function AdminPage() {
  const data = await getAdminStats();

  const stats = [
    { label: "Leads gratuits", value: data.leads, icon: <Mail className="h-5 w-5" /> },
    { label: "Utilisateurs", value: data.users, icon: <Users className="h-5 w-5" /> },
    { label: "Abonnés actifs", value: data.activeSubscriptions, icon: <CreditCard className="h-5 w-5" /> },
    { label: "Rapports générés", value: data.reports.length, icon: <FileText className="h-5 w-5" /> },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container-shell py-6 flex items-center justify-between">
          <div>
            <p className="eyebrow mb-2">Administration</p>
            <h1 className="text-3xl font-bold tracking-tight">
              Astral Letters Dashboard
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Leads, conversions, rapports et abonnements.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au site
            </Link>
          </Button>
        </div>
      </header>

      <div className="container-shell py-8">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                  {stat.icon}
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  {stat.label}
                </p>
              </div>
              <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Reports */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Derniers rapports / PDFs</h2>
              <Badge variant="outline">{data.reports.length} récents</Badge>
            </div>
            <div className="space-y-3">
              {data.reports.map((report: any) => (
                <div
                  key={report.id}
                  className="rounded-xl border border-[var(--border)] p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {report.title}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      {report.user.firstName} •{" "}
                      {translateReportType(report.type)}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <form
                      action="/api/admin/regenerate-pdf"
                      method="post"
                    >
                      <input type="hidden" name="reportId" value={report.id} />
                      <Button type="submit" variant="ghost" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    </form>
                    <form
                      action="/api/admin/regenerate-pdf"
                      method="post"
                    >
                      <input type="hidden" name="reportId" value={report.id} />
                      <input type="hidden" name="type" value="reading" />
                      <Button type="submit" variant="ghost" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Lecture
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
              {data.reports.length === 0 && (
                <p className="text-sm text-[var(--muted)] text-center py-8">
                  Aucun rapport généré pour le moment.
                </p>
              )}
            </div>
          </Card>

          {/* Newsletters */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Derniers emails envoyés</h2>
              <Badge variant="outline">{data.newsletters.length} récents</Badge>
            </div>
            <div className="space-y-3">
              {data.newsletters.map((newsletter: any) => (
                <div
                  key={newsletter.id}
                  className="rounded-xl border border-[var(--border)] p-4"
                >
                  <p className="text-sm font-semibold">{newsletter.subject}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    {newsletter.user.firstName} • {newsletter.deliveryStatus}
                  </p>
                  <p className="text-xs text-[var(--foreground)] mt-2">
                    {newsletter.previewText}
                  </p>
                </div>
              ))}
              {data.newsletters.length === 0 && (
                <p className="text-sm text-[var(--muted)] text-center py-8">
                  Aucun email envoyé pour le moment.
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Users */}
        <Card className="mt-6 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Utilisateurs récents</h2>
          </div>
          <div className="space-y-3">
            {data.latestUsers.map((user: any) => (
              <div
                key={user.id}
                className="rounded-xl border border-[var(--border)] p-4 grid gap-3 md:grid-cols-[1fr_1fr_auto] items-center"
              >
                <div>
                  <p className="text-sm font-semibold">{user.firstName}</p>
                  <p className="text-xs text-[var(--muted)]">{user.email}</p>
                </div>
                <div className="text-sm text-[var(--foreground)]">
                  {user.subscriptions.length > 0
                    ? user.subscriptions
                        .map(
                          (sub: any) =>
                            `${sub.offer.name} • ${sub.status}`
                        )
                        .join(" / ")
                    : "Aucun abonnement"}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Détail
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Relancer
                  </Button>
                </div>
              </div>
            ))}
            {data.latestUsers.length === 0 && (
              <p className="text-sm text-[var(--muted)] text-center py-8">
                Aucun utilisateur pour le moment.
              </p>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
