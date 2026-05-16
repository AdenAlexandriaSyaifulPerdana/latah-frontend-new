"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  Bell,
  FileText,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Trophy,
  TrendingUp,
  Users,
} from "lucide-react";

import { PublicNavbar } from "../components/layout/public-navbar";
import { SiteFooter } from "../components/layout/site-footer";
import { api } from "../lib/api";
import { ROUTES } from "../lib/constants";
import { howItWorks } from "../data/landing-content";
import type { ApiResponse } from "../types/api";
import type { Report } from "../types/report";

const heroImages = [
  "/images/landing/hero-1.jpg",
  "/images/landing/hero-2.jpg",
  "/images/landing/hero-3.jpg",
  "/images/landing/hero-4.jpg",
];

function extractReports(response: unknown): Report[] {
  if (Array.isArray(response)) {
    return response as Report[];
  }

  if (typeof response === "object" && response !== null) {
    const root = response as Record<string, unknown>;

    if (Array.isArray(root.data)) {
      return root.data as Report[];
    }

    if (typeof root.data === "object" && root.data !== null) {
      const data = root.data as Record<string, unknown>;

      if (Array.isArray(data.data)) return data.data as Report[];
      if (Array.isArray(data.reports)) return data.reports as Report[];
      if (Array.isArray(data.items)) return data.items as Report[];
      if (Array.isArray(data.rows)) return data.rows as Report[];
    }

    if (Array.isArray(root.reports)) {
      return root.reports as Report[];
    }

    if (Array.isArray(root.items)) {
      return root.items as Report[];
    }
  }

  return [];
}

function getReporterId(report: Report) {
  return report.users?.id ?? report.user?.id ?? report.user_id ?? null;
}

function isHandledReport(report: Report) {
  const status = String(report.status || "").toLowerCase();
  return status === "processing" || status === "verified";
}

export default function HomePage() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["landing", "reports", "summary"],
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const response = await api.get<ApiResponse<Report[]> | Report[]>(
        "/reports",
      );

      return extractReports(response);
    },
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const summary = useMemo(() => {
    const totalReports = reports.length;

    const handledReports = reports.filter((report) =>
      isHandledReport(report),
    ).length;

    const activeCitizens = new Set(
      reports.map((report) => getReporterId(report)).filter(Boolean),
    ).size;

    return {
      totalReports,
      handledReports,
      activeCitizens,
    };
  }, [reports]);

  const summaryItems = [
    {
      label: "Laporan Masuk",
      value: isLoading ? "..." : summary.totalReports,
      icon: FileText,
    },
    {
      label: "Sedang Ditangani",
      value: isLoading ? "..." : summary.handledReports,
      icon: TrendingUp,
    },
    {
      label: "Warga Aktif",
      value: isLoading ? "..." : summary.activeCitizens,
      icon: Users,
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <PublicNavbar />

      <section className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-[#0B2D4D] text-white">
        {heroImages.map((image, index) => (
          <div
            key={image}
            aria-hidden="true"
            className={[
              "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
              index === activeImageIndex ? "opacity-100" : "opacity-0",
            ].join(" ")}
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
        ))}

        {/* Overlay dibuat lebih tipis supaya background lebih terlihat */}
        <div className="absolute inset-0 bg-[#0B2D4D]/58" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,196,81,0.22),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(217,84,63,0.18),_transparent_32%)]" />

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-32 lg:pt-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur">
              <Sparkles className="h-4 w-4 text-[#F5C451]" />
              Platform pelaporan kota berbasis AI
            </div>

            <h1 className="max-w-3xl font-serif text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Laporkan Masalah Kota, Pantau Tindak Lanjutnya.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/82 md:text-lg">
              LATAH membantu masyarakat Jember menyampaikan laporan secara
              cepat, transparan, dan berbasis data melalui foto, lokasi,
              interaksi warga, serta prioritas penanganan.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href={ROUTES.citizenNewReport}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F5C451] px-7 py-3 text-sm font-bold text-[#0B2D4D] shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#ffd25d]"
              >
                Buat Laporan
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={ROUTES.map}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Lihat Peta Laporan
                <MapPin className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-2">
              {heroImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`Pilih background ${index + 1}`}
                  className={[
                    "h-2.5 rounded-full transition-all",
                    index === activeImageIndex
                      ? "w-10 bg-[#F5C451]"
                      : "w-2.5 bg-white/35",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <div className="rounded-[1.5rem] bg-white p-5 text-slate-900">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Ringkasan Hari Ini
                    </p>
                    <h2 className="text-2xl font-black text-[#0B2D4D]">
                      Data Sistem LATAH
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-[#FFF4D8] p-3 text-[#D9543F]">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                </div>

                <div className="grid gap-4">
                  {summaryItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4D8] text-[#D9543F]">
                            <Icon className="h-6 w-6" />
                          </div>

                          <div>
                            <p className="text-3xl font-black text-[#0B2D4D]">
                              {item.value}
                            </p>
                            <p className="mt-1 text-sm font-bold text-slate-500">
                              {item.label}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-3xl bg-[#0B2D4D] p-5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <Bell className="h-5 w-5 text-[#F5C451]" />
                    </div>

                    <div>
                      <p className="font-bold">Status laporan transparan</p>
                      <p className="text-sm text-white/70">
                        Pending, diproses, selesai, atau ditolak.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Leaderboard dipindah masuk ke card ringkasan */}
                <div className="mt-4 rounded-3xl bg-[#D9543F] p-5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#F5C451]/20 p-3">
                      <Trophy className="h-5 w-5 text-[#F5C451]" />
                    </div>

                    <div>
                      <p className="font-bold">Leaderboard Warga Aktif</p>
                      <p className="text-sm text-white/80">
                        Gamifikasi kontribusi publik
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card floating lama dihapus */}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D9543F]">
            Cara Kerja
          </p>

          <h2 className="mt-3 font-serif text-4xl font-black text-[#0B2D4D] md:text-5xl">
            Dari laporan warga menjadi tindakan nyata.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {howItWorks.map((item, index) => (
            <article
              key={item.title}
              className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4D8] text-lg font-black text-[#D9543F]">
                {index + 1}
              </div>

              <h3 className="text-lg font-black text-[#0B2D4D]">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-[#0B2D4D] p-8 text-white">
            <MapPin className="mb-5 h-8 w-8 text-[#F5C451]" />
            <h3 className="text-2xl font-black">Smart Mapping</h3>
            <p className="mt-3 text-sm leading-6 text-white/75">
              Menampilkan sebaran laporan berdasarkan lokasi agar area prioritas
              lebih mudah dikenali.
            </p>
          </div>

          <div className="rounded-[2rem] bg-[#FFF4D8] p-8 text-[#0B2D4D]">
            <Sparkles className="mb-5 h-8 w-8 text-[#D9543F]" />
            <h3 className="text-2xl font-black">AI Classification</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Membantu mengklasifikasi laporan dan mendeteksi urgensi
              berdasarkan judul serta deskripsi.
            </p>
          </div>

          <div className="rounded-[2rem] bg-[#D9543F] p-8 text-white">
            <MessageCircle className="mb-5 h-8 w-8 text-[#F5C451]" />
            <h3 className="text-2xl font-black">Civic Interaction</h3>
            <p className="mt-3 text-sm leading-6 text-white/75">
              Warga dapat memberi dukungan dan komentar pada laporan publik
              untuk memperkuat prioritas masalah.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#0B2D4D] p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#F5C451] text-[#0B2D4D]">
              <ShieldCheck className="h-12 w-12" />
            </div>

            <div>
              <h2 className="font-serif text-3xl font-black md:text-5xl">
                Transparansi pelayanan publik dimulai dari laporan yang mudah
                dipantau.
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 md:text-base">
                Dengan sistem tracking, prioritas berbasis data, peta laporan,
                dan interaksi warga, LATAH dirancang sebagai jembatan antara
                masyarakat dan pemerintah daerah.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}