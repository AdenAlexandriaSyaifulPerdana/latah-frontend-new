"use client";

import Link from "next/link";
import { FileText, PlusCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "../common/empty-state";
import { ReportCard } from "../reports/report-card";
import { useAuth } from "../../hooks/use-auth";
import { useCitizenReports } from "../../hooks/use-citizen-data";
import { ROUTES } from "../../lib/constants";
import type { Report } from "../../types/report";

function getSearchText(report: Report) {
  const category =
    typeof report.category === "string" ? report.category : report.category?.name;

  return [
    report.title,
    report.description,
    report.location_name,
    report.address_detail,
    report.status,
    category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function MyReportsClient() {
  const { user } = useAuth();
  const { data: reports = [], isLoading, isError, error } =
    useCitizenReports(user?.id);

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");

  const filteredReports = useMemo(() => {
    const searchKeyword = keyword.trim().toLowerCase();

    return reports.filter((report) => {
      const matchKeyword = searchKeyword
        ? getSearchText(report).includes(searchKeyword)
        : true;

      const matchStatus = status === "all" ? true : report.status === status;

      return matchKeyword && matchStatus;
    });
  }, [reports, keyword, status]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[#0B2D4D] p-8 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#F5C451]">
              Laporan Saya
            </p>
            <h1 className="mt-3 font-serif text-4xl font-black leading-tight md:text-5xl">
              Pantau semua laporanmu.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
              Lihat status laporan yang sudah kamu kirimkan, mulai dari pending,
              diproses, selesai, hingga ditolak.
            </p>
          </div>

          <Link
            href={ROUTES.citizenNewReport}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F5C451] px-6 py-3 text-sm font-black text-[#0B2D4D] transition hover:bg-[#ffd25d]"
          >
            <PlusCircle className="h-4 w-4" />
            Buat Laporan
          </Link>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Cari laporan saya..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
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
              className="h-[420px] animate-pulse rounded-[1.75rem] bg-white"
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
              : "Terjadi kesalahan saat mengambil laporan milik pengguna."
          }
        />
      ) : null}

      {!isLoading && !isError && filteredReports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Belum ada laporan"
          description="Kamu belum memiliki laporan yang sesuai dengan filter ini."
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
            <ReportCard
              key={report.id}
              report={report}
              href={`/reports/${report.id}`}
            />
          ))}
        </section>
      ) : null}
    </div>
  );
}