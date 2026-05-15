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

export const metadata = {
  title: {
    default: "LATAH - Lapor Aspirasi Jember",
    template: "%s | LATAH",
  },
  description:
    "Platform pelaporan aspirasi masyarakat Jember untuk transparansi, pemetaan masalah kota, dan tindak lanjut pemerintah.",
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