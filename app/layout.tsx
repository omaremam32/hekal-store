import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bebas_Neue, Cairo, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HekalAIAssistant from "@/components/HekalAIAssistant";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-tag",
  display: "swap",
});

const cairo = Cairo({
  weight: ["400", "600", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hekal — Men's Shirts Since 1970",
  description:
    "Shop men's shirts made by Hekal, the Egyptian shirt factory established in 1970. Discover Colvert, Hunt, and other Hekal-made labels.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${bebasNeue.variable} ${inter.variable} ${plexMono.variable} ${cairo.variable} min-h-screen bg-bone font-body text-charcoal antialiased`}
      >
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <HekalAIAssistant />
        </Providers>
      </body>
    </html>
  );
}