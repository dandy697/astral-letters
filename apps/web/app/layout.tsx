import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { StructuredData } from "@/components/marketing/structured-data";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#FAF8F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://astral-letters.com"),
  title: {
    default: "Astral Letters | Votre thème astral, enfin compris simplement",
    template: "%s | Astral Letters",
  },
  description:
    "À partir de votre date, heure et lieu de naissance, recevez une lecture astrologique claire, utile et vraiment personnelle. Calcul réel, pas d'horoscope générique.",
  keywords: [
    "astrologie personnalisée",
    "thème astral",
    "thème natal",
    "lecture astrologique",
    "horoscope personnel",
    "calcul astrologique",
  ],
  authors: [{ name: "Astral Letters" }],
  openGraph: {
    title: "Astral Letters | Votre thème astral, enfin compris simplement",
    description:
      "Recevez une lecture astrologique claire et personnalisée, calculée à partir de votre thème natal réel.",
    url: "https://astral-letters.com",
    siteName: "Astral Letters",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Astral Letters",
    description:
      "Votre thème astral, enfin compris simplement.",
    creator: "@astralletters",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className="antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
        {children}
      </body>
    </html>
  );
}
