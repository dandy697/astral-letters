"use client";

import Script from "next/script";

export function StructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Astral Letters",
    "url": "https://astral-letters.com",
    "logo": "https://astral-letters.com/logo.png",
    "sameAs": [
      "https://instagram.com/astralletters"
    ],
    "description": "L'astrologie de précision pour les psychologies complexes. Cartographie des dynamiques inconscientes par éphémérides NASA."
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Blueprint Natal Sanctuary",
    "provider": {
      "@type": "Organization",
      "name": "Astral Letters"
    },
    "description": "Analyse psychologique profonde basée sur vos données de naissance exactes.",
    "areaServed": "Worldwide",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Lectures Célestes",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Plan Signal"
          },
          "price": "7.00",
          "priceCurrency": "EUR"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Plan Focus"
          },
          "price": "12.00",
          "priceCurrency": "EUR"
        }
      ]
    }
  };

  return (
    <>
      <Script
        id="structured-data-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <Script
        id="structured-data-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
      />
    </>
  );
}
