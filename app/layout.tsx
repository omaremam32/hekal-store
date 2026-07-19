import type { Metadata } from "next";
import { Bebas_Neue, Inter, IBM_Plex_Mono, Cairo } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
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
    "Hekal has made men's shirts in Imbaba, Egypt since 1970 — Oxford, poplin, linen and flannel, cut and finished in-house.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${bebasNeue.variable} ${inter.variable} ${plexMono.variable} ${cairo.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
