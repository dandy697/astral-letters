import { PrismaClient, OfferType, SubscriptionStatus, ReportType, DeliveryChannel, LeadSource } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const offers = [
    {
      slug: "essentiel",
      name: "Essentiel",
      description: "Lecture mensuelle personnalisée basée sur le thème natal réel.",
      priceMonthlyCents: 700,
      type: OfferType.SUBSCRIPTION,
      isHighlighted: false,
      features: ["Lecture mensuelle complète", "Synthèse claire et lisible", "Grandes tendances du mois", "Email personnalisé"]
    },
    {
      slug: "plus",
      name: "Plus",
      description: "L'essentiel + rythme hebdo, jours clés et conseils concrets.",
      priceMonthlyCents: 1200,
      type: OfferType.SUBSCRIPTION,
      isHighlighted: true,
      features: ["Tout Essentiel inclus", "Update hebdomadaire", "Jours clés identifiés", "Conseils concrets et ciblés"]
    },
    {
      slug: "premium",
      name: "Premium",
      description: "L'expérience complète avec PDF premium et analyses détaillées.",
      priceMonthlyCents: 1900,
      type: OfferType.SUBSCRIPTION,
      isHighlighted: false,
      features: ["Tout Plus inclus", "PDF premium mensuel", "Analyse enrichie approfondie", "Focus amour / travail / énergie"]
    },
    {
      slug: "rapport-natal",
      name: "Rapport natal premium",
      description: "Carte du ciel complète analysée en détail. Document de référence à garder.",
      oneShotPriceCents: 2900,
      type: OfferType.ONE_SHOT,
      isHighlighted: false,
      features: ["Rapport natal complet", "PDF premium", "Analyse des aspects et maisons", "10 planètes détaillées"]
    }
  ];

  for (const offer of offers) {
    await prisma.offer.upsert({
      where: { slug: offer.slug },
      update: offer,
      create: offer
    });
  }

  const premiumOffer = await prisma.offer.findUniqueOrThrow({ where: { slug: "premium" } });
  const plusOffer = await prisma.offer.findUniqueOrThrow({ where: { slug: "plus" } });

  const user = await prisma.user.upsert({
    where: { email: "lea@example.com" },
    update: {},
    create: {
      firstName: "Léa",
      email: "lea@example.com",
      timezone: "Europe/Paris",
      leads: {
        create: {
          email: "lea@example.com",
          firstName: "Léa",
          source: LeadSource.LANDING,
          consentText: "J’accepte de recevoir des emails astrologiques personnalisés."
        }
      },
      birthProfile: {
        create: {
          birthDate: new Date("1992-08-15T07:24:00.000Z"),
          birthTime: "09:24",
          birthLocation: "Paris, France",
          latitude: 48.8566,
          longitude: 2.3522,
          timezone: "Europe/Paris"
        }
      },
      natalChart: {
        create: {
          sunSign: "Leo",
          moonSign: "Scorpio",
          ascendantSign: "Virgo",
          technicalSummary: "Dominante fixe, accent relationnel et discernement pratique.",
          chartJson: {
            planets: [
              { name: "Sun", sign: "Leo", degree: 22.3, house: 11 },
              { name: "Moon", sign: "Scorpio", degree: 4.2, house: 3 },
              { name: "Ascendant", sign: "Virgo", degree: 12.1, house: 1 }
            ],
            houses: [{ house: 1, sign: "Virgo" }, { house: 10, sign: "Gemini" }],
            aspects: [{ from: "Sun", to: "Moon", type: "square", orb: 2.3 }]
          }
        }
      },
      subscriptions: {
        createMany: {
          data: [
            {
              offerId: premiumOffer.id,
              status: SubscriptionStatus.ACTIVE,
              trialEndsAt: new Date("2026-04-12T00:00:00.000Z"),
              currentPeriodEnd: new Date("2026-05-12T00:00:00.000Z")
            },
            {
              offerId: plusOffer.id,
              status: SubscriptionStatus.CANCELED,
              currentPeriodEnd: new Date("2026-03-12T00:00:00.000Z")
            }
          ]
        }
      },
      generatedReports: {
        create: {
          type: ReportType.MONTHLY_PREMIUM,
          title: "Avril 2026",
          deliveryChannel: DeliveryChannel.PDF,
          htmlSnapshot: "<h1>Astral Letters Avril</h1>",
          pdfUrl: "https://example.com/reports/avril.pdf",
          contentJson: {
            intro: "Ce mois vous demande de conjuguer ambition et finesse émotionnelle.",
            keyDays: ["2026-04-08", "2026-04-14", "2026-04-27"]
          }
        }
      },
      newsletterLogs: {
        create: {
          subject: "Votre guidance d’avril est prête",
          previewText: "Les jours clés et votre dynamique du mois vous attendent.",
          htmlBody: "<strong>Bonjour Léa</strong>",
          textBody: "Bonjour Léa",
          deliveryStatus: "sent"
        }
      },
      payments: {
        create: {
          offerId: premiumOffer.id,
          amountCents: 4900,
          currency: "eur",
          status: "paid"
        }
      },
      auditLogs: {
        create: {
          action: "seed.created",
          entityType: "user",
          entityId: "lea@example.com",
          payload: { note: "Utilisateur de démonstration" }
        }
      }
    },
    include: {
      subscriptions: true
    }
  });

  console.log(`Seed complete for ${user.email} with ${user.subscriptions.length} subscriptions.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
