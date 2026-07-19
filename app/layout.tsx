import type { Metadata } from "next";
import { Inter, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBookBar } from "@/components/MobileBookBar";
import { absoluteUrl, siteConfig, weeklyHours } from "@/config/site";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "CUT/CTRL — Contemporary Barbershop",
    template: "%s — CUT/CTRL",
  },
  description: siteConfig.description,
  openGraph: {
    title: "CUT/CTRL — Contemporary Barbershop",
    description: siteConfig.description,
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/og-cutctrl.webp",
        width: 1200,
        height: 630,
        alt: "CUT/CTRL contemporary barbershop in Shoreditch, London",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CUT/CTRL — Contemporary Barbershop",
    description: siteConfig.description,
    images: ["/images/og-cutctrl.webp"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Barbershop"],
  "@id": absoluteUrl("/#studio"),
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  image: absoluteUrl("/images/og-cutctrl.webp"),
  telephone: siteConfig.phone.href,
  email: siteConfig.email,
  priceRange: "££",
  currenciesAccepted: "GBP",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.locality,
    addressRegion: siteConfig.address.region,
    postalCode: siteConfig.address.postalCode,
    addressCountry: siteConfig.address.countryCode,
  },
  openingHoursSpecification: weeklyHours
    .filter((hours) => hours.open && hours.close)
    .map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${hours.schemaDay}`,
      opens: hours.open,
      closes: hours.close,
    })),
  sameAs: [],
  hasMap: siteConfig.mapsUrl,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileBookBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
