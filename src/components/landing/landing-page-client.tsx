"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  FileText,
  MapPinned,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

import { api } from "../../lib/api";
import { ROUTES } from "../../lib/constants";
import type { ApiResponse } from "../../types/api";
import type { Report } from "../../types/report";

const heroImages = [
  "/images/landing/hero-1.jpg",
  "/images/landing/hero-2.jpg",
  "/images/landing/hero-3.jpg",
  "/images/landing/hero-4.jpg",
];

function extractReports(response: unknown): Report[] {
  if (Array.isArray(response)) return response as Report[];

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

    if (Array.isArray(root.reports)) return root.reports as Report[];
  }

  return [];
}

function getReporterId(report: Report) {
  return report.users?.id ?? report.user?.id ?? report.user_id ?? null;
}

function isHandledReport(report: Report) {
  const status = String(report.status || "").toLowerCase();

  return status === "processing";
}

export function LandingPageClient() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const {
    data: reports = [],
    isLoading,
  } = useQuery({
    queryKey: ["landing", "reports", "summary"],
    staleTime: 0,
    refetchOnMount: "always",
    queryFn: async () => {
      const response = await api.get<ApiResponse<Report[]> | Report[]>(
        "/reports",
      );

      return extractReports(response);
    },
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => {
        return (current + 1) % heroImages.length;
      });
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

  const activeImage = heroImages[activeImageIndex];

  const summaryItems = [
    {
      label: "Laporan Masuk",
      value: isLoading ? "..." : summary.totalReports,
      icon: FileText,
      description: "Total laporan warga yang masuk ke sistem.",
    },
    {
      label: "Sedang Ditangani",
      value: isLoading ? "..." : summary.handledReports,
      icon: TrendingUp,
      description: "Laporan dengan status sedang diproses.",
    },
    {
      label: "Warga Aktif",
      value: isLoading ? "..." : summary.activeCitizens,
      icon: Users,
      description: "Warga yang sudah mengirim laporan.",
    },
  ];

  return (
    <main className="bg-[#FAFAF7]">
      <section className="relative min-h-[calc(100vh-88px)] overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={[
              "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
              index === activeImageIndex ? "opacity-100" : "opacity-0",
            ].join(" ")}
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
        ))}

        <div className="absolute inset-0 bg-[#0B2D4D]/78" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,196,81,0.35),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(217,84,63,0.3),_transparent_36%)]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_420px]">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-[#F5C451] backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Smart Civic Reporting
            </div>

            <h1 className="mt-6 font-serif text-5xl font-black leading-tight md:text-7xl">
              Lapor masalah kota, pantau tindak lanjutnya.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75">
              LATAH membantu warga Jember mengirim laporan, memilih titik
              lokasi, memberi dukungan, dan memantau status penanganan secara
              transparan.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={ROUTES.register}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D9543F] px-7 py-4 text-sm font-black text-white shadow-xl shadow-red-950/20 transition hover:bg-[#c24634]"
              >
                Daftar Citizen
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={ROUTES.reports}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
              >
                Lihat Laporan
              </Link>
            </div>

            <div className="mt-8 flex gap-2">
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

          <aside className="rounded-[2rem] border border-white/15 bg-white/12 p-5 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[1.5rem] bg-white p-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#D9543F]">
                Ringkasan Hari Ini
              </p>

              <h2 className="mt-3 text-2xl font-black text-[#0B2D4D]">
                Data langsung dari sistem.
              </h2>

              <div className="mt-6 space-y-4">
                {summaryItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4D8] text-[#D9543F]">
                          <Icon className="h-6 w-6" />
                        </div>

                        <div>
                          <p className="text-3xl font-black text-[#0B2D4D]">
                            {item.value}
                          </p>
                          <p className="text-sm font-black text-slate-600">
                            {item.label}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-xs leading-5 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <Link
                href={ROUTES.map}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0B2D4D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#123C69]"
              >
                <MapPinned className="h-4 w-4" />
                Buka Peta Laporan
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-16 md:grid-cols-3">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black text-[#0B2D4D]">
            Buat laporan cepat
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Citizen bisa mengirim laporan lengkap dengan foto, deskripsi, dan
            titik lokasi dari peta.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black text-[#0B2D4D]">
            Pantau status
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Setiap perubahan status laporan dapat dipantau melalui dashboard dan
            notifikasi.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black text-[#0B2D4D]">
            Peta masalah kota
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Laporan warga divisualisasikan dalam peta agar titik masalah lebih
            mudah diprioritaskan.
          </p>
        </div>
      </section>
    </main>
  );
}