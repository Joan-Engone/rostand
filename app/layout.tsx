import type { Metadata, Viewport } from "next";
import { Unbounded, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";

const display = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-jb", display: "swap" });

export const metadata: Metadata = {
  title: "Auto-École Rostand — Permis B, conduite accompagnée, code · depuis 2009",
  description: site.description,
  openGraph: {
    title: "Auto-École Rostand — depuis 2009",
    description: site.description,
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#060908",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets the CSS hide hero content until GSAP animates it in (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="bg-night font-sans text-[16px] leading-relaxed text-bone antialiased md:text-[17px]">{children}</body>
    </html>
  );
}