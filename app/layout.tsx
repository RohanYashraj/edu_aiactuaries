import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, webSiteSchema } from "@/lib/jsonld";
import {
  siteBrandTitle,
  siteDescription,
  siteName,
  siteUrl,
} from "@/lib/site";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display-custom",
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
    icon: "/sssia-logo.jpeg",
  },
  openGraph: {
    type: "website",
    siteName,
    title: { default: siteBrandTitle, template: `%s — ${siteName}` },
    description: siteDescription,
    url: siteUrl,
    // No `images` here: app/opengraph-image.tsx generates the card, and an
    // explicit value would override it.
  },
  twitter: {
    card: "summary_large_image",
    title: { default: siteBrandTitle, template: `%s — ${siteName}` },
    description: siteDescription,
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
        className={`${playfair.variable} ${inter.variable} ${geistMono.variable} antialiased`}
      >
        {/* No `dynamic` prop: it reads request headers during SSR, which throws
            DYNAMIC_SERVER_USAGE on the statically generated (ISR) pages. Auth
            state resolves client-side instead. */}
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
        <Toaster position="bottom-right" />
        <Analytics />
      </body>
    </html>
  );
}
