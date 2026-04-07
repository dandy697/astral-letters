export const siteNavigation = [
  { label: "Ce que vous recevez", href: "#ce-que-vous-recevez" },
  { label: "Comment ça fonctionne", href: "#comment-ca-marche" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "FAQ", href: "#faq" },
] as const;

export const ctas = {
  heroPrimary: "Découvrir mon thème",
  heroSecondary: "Voir les formules",
  freePrimary: "Recevoir ma lecture",
  resultPrimary: "Débloquer ma lecture complète",
  finalPrimary: "Recevoir ma lecture personnalisée",
  natalPrimary: "Commander mon rapport",
  pdfPrimary: "Télécharger mon PDF premium",
} as const;

export const heroCopy = {
  eyebrow: "Astral Letters — Astrologie personnalisée",
  title: "Votre thème astral, enfin compris simplement.",
  subtitle:
    "À partir de votre date, heure et lieu de naissance, recevez une lecture claire, personnelle et utile pour comprendre vos cycles, vos décisions et vos moments clés.",
  reassurance: [
    "Basé sur vos données de naissance réelles",
    "Calculé à partir de données astronomiques réelles utilisées par les professionnels",
    "Lecture envoyée par email + PDF",
    "Sans engagement",
  ],
} as const;

export const trustBarItems = [
  "Basé sur vos données de naissance réelles",
  "Calcul astrologique rigoureux",
  "Lecture claire et exploitable",
  "Résiliation simple, à tout moment",
] as const;

export const receiveCards = [
  {
    title: "Lecture mensuelle personnalisée",
    body: "Une synthèse claire de votre mois : dynamiques, décisions à privilégier, périodes clés. Rien de générique — tout est basé sur votre thème.",
    icon: "mail", // Purple 🟣
  },
  {
    title: "Jours clés & conseils",
    body: "Identifiez quand agir, attendre ou ajuster. Des repères précis pour vos choix en amour, travail et équilibre personnel.",
    icon: "calendar", // Yellow 🟡
  },
  {
    title: "PDF personnel premium",
    body: "Un document élégant à relire, structuré comme un mini magazine : votre profil, votre mois, vos axes et vos conseils.",
    icon: "file", // Black ⚫
  },
] as const;

export const calculationSteps = [
  {
    title: "1. Vos informations de naissance",
    body: "Prénom, date, heure et lieu de naissance. C'est la base de votre carte du ciel.",
  },
  {
    title: "2. Calcul astronomique réel",
    body: "Votre lieu est géocodé, votre heure convertie, puis votre thème est calculé à partir de données astronomiques réelles utilisées par les professionnels.",
  },
  {
    title: "3. Lecture personnalisée",
    body: "Vos positions planétaires sont traduites en une lecture claire : énergie du mois, relations, travail, rythme personnel.",
  },
  {
    title: "4. Résultat immédiat",
    body: "Votre aperçu apparaît instantanément. Votre PDF est disponible. Vos emails suivent automatiquement.",
  },
] as const;

export const comparisonRows = [
  {
    generic: "Même message pour des milliers de personnes",
    astral: "Calcul basé sur votre thème natal exact",
  },
  {
    generic: "Conseils vagues ou interchangeables",
    astral: "Soleil, Lune, Ascendant + transits réels",
  },
  {
    generic: "Peu de lien avec votre réalité",
    astral: "Lecture claire, concrète et personnelle",
  },
  {
    generic: "Aucune source de données fiable",
    astral: "Données astronomiques réelles utilisées par les professionnels",
  },
] as const;

export const personalizationProof = [
  {
    title: "Votre trio Soleil · Lune · Ascendant",
    body: "La base de votre signature astrale calculée à partir de vos données exactes.",
  },
  {
    title: "Une première lecture personnalisée",
    body: "Directement basée sur vos positions planétaires actuelles.",
  },
  {
    title: "Un aperçu de votre mois",
    body: "Découvrez les dynamiques qui vont influencer vos prochaines semaines.",
  },
  {
    title: "Un PDF découverte",
    body: "À télécharger immédiatement pour garder vos repères.",
  },
] as const;

export const benefits = [
  { title: "Lecture mensuelle", body: "Énergie générale, tendances et climat de votre mois." },
  { title: "Amour et relations", body: "Ce que votre ciel dit de vos liens affectifs ce mois-ci." },
  { title: "Travail et argent", body: "Arbitrages, décisions, levier de croissance du moment." },
  { title: "Énergie et bien-être", body: "Rythme, récupération, moments à protéger." },
  { title: "Jours clés", body: "Les dates importantes pour vos décisions et engagements." },
  { title: "Conseils concrets", body: "Des recommandations actionnables, pas des platitudes." },
  { title: "PDF personnel", body: "Un document complet et lisible à conserver ou partager." },
  { title: "Email personnalisé", body: "Votre lecture arrive directement dans votre boîte." },
] as const;

export const pricingPlans = [
  {
    slug: "essentiel",
    name: "Essentiel",
    price: "7€",
    cadence: "/mois",
    description: "Pour suivre votre mois simplement.",
    features: [
      "Lecture mensuelle personnalisée",
      "Synthèse claire",
      "Grandes tendances",
      "Email",
    ],
    cta: "Commencer",
    highlight: false,
  },
  {
    slug: "plus",
    name: "Plus",
    price: "12€",
    cadence: "/mois",
    description: "Pour avancer avec plus de précision.",
    features: [
      "Tout Essentiel inclus",
      "Mise à jour hebdomadaire",
      "Jours clés",
      "Conseils concrets",
    ],
    cta: "Débloquer ma lecture",
    badge: "Le plus choisi",
    highlight: true,
  },
  {
    slug: "premium",
    name: "Premium",
    price: "19€",
    cadence: "/mois",
    description: "Pour une lecture complète et approfondie.",
    features: [
      "Tout Plus inclus",
      "PDF premium mensuel",
      "Analyse détaillée",
      "Focus amour / travail / énergie",
    ],
    cta: "Accéder à la version complète",
    highlight: false,
  },
] as const;

export const oneShotOffer = {
  slug: "rapport-natal",
  name: "Rapport natal",
  price: "29€",
  description: "Votre thème complet, à garder. Un document détaillé de 26 pages, lisible et intemporel basé sur votre carte du ciel.",
  cta: "Commander mon rapport",
} as const;

export const faqItems = [
  {
    question: "D'où viennent les données ?",
    answer:
      "Nos calculs s’appuient sur des données astronomiques réelles utilisées par les professionnels, puis sont transformés en lecture claire et personnelle.",
  },
  {
    question: "Pourquoi l'heure est importante ?",
    answer:
      "Elle permet de calculer votre ascendant et la position des maisons, essentielles pour une lecture précise.",
  },
  {
    question: "Est-ce vraiment personnalisé ?",
    answer:
      "Oui. Chaque lecture est générée à partir de vos propres données, pas d'un signe général.",
  },
  {
    question: "Puis-je arrêter facilement ?",
    answer:
      "Oui, à tout moment, en un clic.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Oui. Elles sont utilisées uniquement pour votre analyse et ne sont jamais revendues.",
  },
  {
    question: "Que contient le PDF premium ?",
    answer:
      "Votre profil astral, votre mois détaillé, vos jours clés et des conseils concrets.",
  },
] as const;

export const trustPoints = [
  "Données de naissance réelles",
  "Calcul astrologique rigoureux",
  "Lecture claire et exploitable",
] as const;

export const demoUser = {
  firstName: "Camille",
  email: "camille@example.com",
  birthDate: "1993-11-18",
  birthTime: "07:42",
  birthLocation: "Lyon, France",
  sun: "Scorpion",
  moon: "Balance",
  ascendant: "Sagittaire",
  profileLine:
    "Votre signature astrale unique, calculée au moment de votre premier souffle.",
  summary:
    "Camille, ce mois vous invite à privilégier la précision plutôt que la vitesse. Vos décisions auront plus d’impact si elles sont prises dans le calme plutôt que dans l’urgence.",
  love: "En relation, la clarté est votre meilleure alliée ce mois-ci. Les positions actuelles favorisent les dialogues constructifs.",
  work: "Vos projets bénéficient d'un élan de structure. C'est le moment idéal pour poser un cadre clair avant de passer à l'action.",
  energy:
    "Énergie en stabilisation. Privilégiez les moments de calme pour recharger vos batteries après vos pics d'activité.",
  keyDays: [
    "8 avril — poser un cadre clair",
    "14 avril — moment émotionnel, prendre du recul",
    "27 avril — passage favorable pour décider",
  ],
  premiumHook:
    "Découvrez votre lecture complète pour ce mois.",
} as const;

export const emailPreviews = {
  monthlySubject: "Votre lecture mensuelle est prête",
  monthlyPreview: "Découvrez vos tendances pour les prochaines semaines",
  weeklySubject: "Vos énergies de la semaine",
  weeklyPreview: "Vos jours clés et conseils personnalisés",
} as const;

export const formMicrocopy = {
  privacy: "Vos données sont utilisées uniquement pour calculer votre thème et personnaliser votre lecture.",
  consent: "Recevoir ma lecture personnalisée",
  loadingSteps: [
    "Interrogation des bases de données astronomiques…",
    "Cartographie des 12 maisons de votre ciel…",
    "Analyse des aspects planétaires majeurs…",
    "Finalisation de votre Manuel de Soi…",
    "Préparation de votre rapport de 26 pages…",
  ],
} as const;
