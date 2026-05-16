"use client";

import { Search, MapPin } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "../common/empty-state";
import { LeafletReportMap } from "../maps/leaflet-report-map";
import { useAdminReports } from "../../hooks/use-admin-data";
import type { Report } from "../../types/report";

function getCategoryName(report: Report) {
  if (report.report_categories?.name) return report.report_categories.name;
  if (typeof report.category === "string") return report.category;
  return report.category?.name || "";
}

function getSearchText(report: Report) {
  return [
    report.title,
    report.description,
    report.location_name,
    report.address_detail,
    report.status,
    getCategoryName(report),
    report.users?.name,
    report.user?.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function AdminMapClient() {
  const { data: reports = [], isLoading, isError, error } = useAdminReports();

  const [keyword, setKeyword] = useState("");

  const filteredReports = useMemo(() => {
    const searchKeyword = keyword.trim().toLowerCase();

    if (!searchKeyword) return reports;

    return reports.filter((report) => {
      return getSearchText(report).includes(searchKeyword);
    });
  }, [reports, keyword]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[#0B2D4D] p-8 text-white shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#F5C451]">
          Peta & Hotspot
        </p>
        <h1 className="mt-3 font-serif text-4xl font-black leading-tight md:text-5xl">
          Pantau sebaran laporan.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
          Lihat persebaran titik laporan masyarakat berdasarkan koordinat lokasi
          yang dikirimkan citizen.
        </p>
      </section>

      <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Cari laporan, lokasi, pelapor, atau status..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
          />
        </div>
      </section>

      {isLoading ? (
        <div className="h-[720px] animate-pulse rounded-[2rem] bg-white" />
      ) : null}

      {isError ? (
        <EmptyState
          icon={MapPin}
          title="Gagal memuat peta"
          description={
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat mengambil data laporan."
          }
        />
      ) : null}

      {!isLoading && !isError && filteredReports.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Tidak ada titik laporan"
          description="Belum ada laporan yang sesuai dengan pencarian atau belum ada koordinat lokasi."
        />
      ) : null}

      {!isLoading && !isError && filteredReports.length > 0 ? (
        <LeafletReportMap
          reports={filteredReports}
          title="Peta Hotspot Laporan"
          description="Klik marker untuk melihat ringkasan laporan dan membuka detailnya."
        />
      ) : null}
    </div>
  );
}