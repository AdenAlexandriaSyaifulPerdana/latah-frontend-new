"use client";

import Link from "next/link";
import { FileText, PlusCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "../common/empty-state";
import { ReportCard } from "./report-card";
import { useReports } from "../../hooks/use-reports";
import { ROUTES } from "../../lib/constants";
import type { Report } from "../../types/report";

function getReportSearchText(report: Report) {
  const category =
    typeof report.category === "string" ? report.category : report.category?.name;

  return [
    report.title,
    report.description,
    report.location_name,
    report.address_detail,
    report.status,
    report.urgency_level,
    category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function ReportsPageClient() {
  const { data: reports = [], isLoading, isError, error } = useReports();
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");

  const filteredReports = useMemo(() => {
    const searchKeyword = keyword.trim().toLowerCase();

    return reports.filter((report) => {
      const matchKeyword = searchKeyword
        ? getReportSearchText(report).includes(searchKeyword)
        : true;

      const matchStatus = status === "all" ? true : report.status === status;

      return matchKeyword && matchStatus;
    });
  }, [reports, keyword, status]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Cari berdasarkan judul, lokasi, kategori, atau deskripsi..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 outline-none transition focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Diproses</option>
            <option value="resolved">Selesai</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
      </section>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[420px] animate-pulse rounded-[1.75rem] bg-white shadow-sm"
            />
          ))}
        </div>
      ) : null}

      {isError ? (
        <EmptyState
          icon={FileText}
          title="Gagal memuat laporan"
          description={
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat mengambil data laporan publik."
          }
        />
      ) : null}

      {!isLoading && !isError && filteredReports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Belum ada laporan yang sesuai"
          description="Coba gunakan kata kunci lain atau ubah filter status laporan."
          action={
            <Link
              href={ROUTES.citizenNewReport}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D9543F] px-5 py-3 text-sm font-black text-white transition hover:bg-[#c24634]"
            >
              <PlusCircle className="h-4 w-4" />
              Buat Laporan
            </Link>
          }
        />
      ) : null}

      {!isLoading && !isError && filteredReports.length > 0 ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </section>
      ) : null}
    </div>
  );
}