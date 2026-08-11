import type { Metadata } from "next";
import {
  DM_Serif_Display,
  Plus_Jakarta_Sans,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next"
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, webSiteSchema } from "@/lib/jsonld";
import {
  defaultOgImage,
  siteBrandTitle,
  siteDescription,
  siteName,
  siteUrl,
} from "@/lib/site";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Pages set a bare title (e.g. "Events"); the template appends the brand so
  // no page has to repeat it — this is what caused the duplicated titles.
  title: { default: siteBrandTitle, template: `%s — ${siteName}` },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName,
    title: { default: siteBrandTitle, template: `%s — ${siteName}` },
    description: siteDescription,
    url: siteUrl,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: { default: siteBrandTitle, template: `%s — ${siteName}` },
    description: siteDescription,
    images: [defaultOgImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd nodes={[organizationSchema(), webSiteSchema()]} />
      </head>
      <body
        className={`${dmSerifDisplay.variable} ${plusJakarta.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider dynamic>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
}
