import type { Metadata } from "next";
import {
  DM_Serif_Display,
  Plus_Jakarta_Sans,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";

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
  title: "Sri Sathya Sai Center of Excellence — Actuarial Data Science & AI",
  description:
    "Pioneering the future of Actuarial Science through AI and Data Science. Professional certifications, workshops, and career opportunities.",
  icons: {
    icon: "/icon.png",
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
      </body>
    </html>
  );
}
