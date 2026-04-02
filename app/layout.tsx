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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sssia.org";

const siteName = "Sri Sathya Sai Institute of Actuaries";
const siteBrandTitle =
  "Sri Sathya Sai Institute of Actuaries - Powered by aiactuaries.org";

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
  title: siteBrandTitle,
  description:
    "Pioneering the future of Actuarial Science through AI and Data Science. Professional certifications, workshops, and career opportunities.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName,
    title: { default: siteBrandTitle, template: "%s" },
    images: [
      {
        url: "/sssia.png",
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: { default: siteBrandTitle, template: "%s" },
    images: ["/sssia.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
