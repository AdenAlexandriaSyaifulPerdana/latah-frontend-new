import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { AppProvider } from "../components/providers/app-provider";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LATAH - Lapor Aspirasi & Tata Kota Jember",
    template: "%s | LATAH",
  },
  description:
    "Platform pelaporan masalah kota Jember berbasis website untuk transparansi, respons cepat, dan partisipasi masyarakat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} ${playfair.variable} min-h-screen bg-[#FAFAF7] text-slate-900 antialiased`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}