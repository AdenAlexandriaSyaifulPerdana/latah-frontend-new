"use client";

import Link from "next/link";
import { FileText, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "../common/empty-state";
import { StatusBadge } from "../common/status-badge";
import { useAdminReports } from "../../hooks/use-admin-data";
import { toNumber } from "../../lib/utils";
import type { Report } from "../../types/report";

function getPointPosition(report: Report, reports: Report[]) {
  const validReports = reports.filter(
    (item) => item.latitude !== undefined && item.longitude !== undefined,
  );

  if (validReports.length <= 1) {
    return {
      left: 50,
      top: 50,
    };
  }

  const latitudes = validReports.map((item) => toNumber(item.latitude));
  const longitudes = validReports.map((item) => toNumber(item.longitude));

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const lat = toNumber(report.latitude);
  const lng = toNumber(report.longitude);

  const lngRange = maxLng - minLng || 1;
  const latRange = maxLat - minLat || 1;

  return {
    left: ((lng - minLng) / lngRange) * 80 + 10,
    top: (1 - (lat - minLat) / latRange) * 80 + 10,
  };
}

function getSearchText(report: Report) {
  const category =
    report.report_categories?.name ||
    (typeof report.category === "string" ? report.category : report.category?.name);

  return [
    report.title,
    report.description,
    report.location_name,
    report.address_detail,
    report.status,
    category,
    report.users?.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function AdminMapClient() {
  const { data: reports = [], isLoading, isError, error } = useAdminReports();

  const [keyword, setKeyword] = useState("");
  const [activeReportId, setActiveReportId] = useState<number | null>(null);

  const filteredReports = useMemo(() => {
    const searchKeyword = keyword.trim().toLowerCase();

    return reports.filter((report) => {
      if (!searchKeyword) return true;
      return getSearchText(report).includes(searchKeyword);
    });
  }, [reports, keyword]);

  const activeReport =
    filteredReports.find((report) => report.id === activeReportId) ??
    filteredReports[0];

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[#0B2D4D] p-8 text-white shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#F5C451]">
          Admin Map
        </p>
        <h1 className="mt-3 font-serif text-4xl font-black leading-tight md:text-5xl">
          Pantau sebaran laporan.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
          Lihat persebaran titik laporan masyarakat berdasarkan koordinat lokasi
          yang dikirimkan.
        </p>
      </section>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="h-[620px] animate-pulse rounded-[2rem] bg-white" />
          <div className="h-[620px] animate-pulse rounded-[2rem] bg-white" />
        </div>
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
          title="Belum ada titik laporan"
          description="Data laporan dengan koordinat belum tersedia."
        />
      ) : null}

      {!isLoading && !isError && filteredReports.length > 0 ? (
        <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Cari laporan, lokasi, pelapor, atau status..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
                />
              </div>
            </div>

            <div className="relative h-[560px] overflow-hidden bg-[#0B2D4D]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,196,81,0.25),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(217,84,63,0.28),_transparent_36%)]" />
              <div className="absolute inset-6 rounded-[2rem] border border-white/10 bg-white/5" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />

              {filteredReports.map((report) => {
                const position = getPointPosition(report, filteredReports);
                const active = activeReport?.id === report.id;

                return (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => setActiveReportId(report.id)}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${position.left}%`,
                      top: `${position.top}%`,
                    }}
                    aria-label={report.title}
                  >
                    <span
                      className={[
                        "flex h-11 w-11 items-center justify-center rounded-full border-4 shadow-xl transition",
                        active
                          ? "scale-110 border-[#F5C451] bg-[#D9543F] text-white"
                          : "border-white bg-[#F5C451] text-[#0B2D4D] hover:scale-110",
                      ].join(" ")}
                    >
                      <MapPin className="h-5 w-5" />
                    </span>
                  </button>
                );
              })}

              <div className="absolute bottom-5 left-5 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur">
                {filteredReports.length} titik laporan
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            {activeReport ? (
              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <StatusBadge status={activeReport.status} />
                  <span className="text-xs font-bold text-slate-400">
                    ID #{activeReport.id}
                  </span>
                </div>

                <h2 className="text-2xl font-black leading-tight text-[#0B2D4D]">
                  {activeReport.title}
                </h2>

                <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500">
                  {activeReport.description}
                </p>

                <div className="mt-5 rounded-2xl bg-[#FFF4D8] p-4">
                  <div className="flex gap-3">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#D9543F]" />
                    <div>
                      <p className="text-sm font-black text-[#0B2D4D]">
                        {activeReport.location_name || "Lokasi belum tersedia"}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {activeReport.address_detail ||
                          "Detail alamat belum tersedia."}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/reports/${activeReport.id}`}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0B2D4D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#123C69]"
                >
                  <FileText className="h-4 w-4" />
                  Lihat Detail
                </Link>
              </div>
            ) : null}

            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {filteredReports.map((report) => (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => setActiveReportId(report.id)}
                  className="w-full rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:border-[#F5C451]"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <StatusBadge status={report.status} />
                    <span className="text-xs font-bold text-slate-400">
                      #{report.id}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-sm font-black text-[#0B2D4D]">
                    {report.title}
                  </p>

                  <p className="mt-2 line-clamp-1 text-xs text-slate-500">
                    {report.location_name ||
                      report.address_detail ||
                      "Lokasi belum tersedia"}
                  </p>
                </button>
              ))}
            </div>
          </aside>
        </section>
      ) : null}
    </div>
  );
}