"use client";

import Link from "next/link";
import { FileText, Loader2, Search, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "../common/empty-state";
import { StatusBadge } from "../common/status-badge";
import { useAdminReports, useUpdateReportStatus } from "../../hooks/use-admin-data";
import { formatDateTime } from "../../lib/utils";
import type { Report } from "../../types/report";

const statusOptions = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "verified",
    label: "Terverifikasi",
  },
  {
    value: "processing",
    label: "Diproses",
  },
  {
    value: "resolved",
    label: "Selesai",
  },
  {
    value: "rejected",
    label: "Ditolak",
  },
];

function getCategoryName(report: Report) {
  if (report.report_categories?.name) return report.report_categories.name;

  if (typeof report.category === "string") return report.category;

  return report.category?.name || "Umum";
}

function getReporterName(report: Report) {
  return report.users?.name || report.user?.name || "Citizen";
}

function getArrayLength(value: unknown) {
  return Array.isArray(value) ? value.length : 0;
}

function AdminReportItem({ report }: { report: Report }) {
  const updateStatusMutation = useUpdateReportStatus();

  const [selectedStatus, setSelectedStatus] = useState(
    String(report.status || "pending"),
  );

  useEffect(() => {
    setSelectedStatus(String(report.status || "pending"));
  }, [report.status]);

  const hasChanged = selectedStatus !== String(report.status || "pending");

  async function handleUpdateStatus() {
    if (!hasChanged) return;

    await updateStatusMutation.mutateAsync({
      reportId: report.id,
      status: selectedStatus,
    });
  }

  const commentCount =
    report.comment_count ??
    report.comments_count ??
    getArrayLength(report.comments);

  const voteCount =
    report.vote_count ??
    report.votes_count ??
    getArrayLength(report.votes);

  return (
    <article className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:border-[#F5C451]">
      <div className="grid gap-5 xl:grid-cols-[1fr_220px_220px] xl:items-center">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={report.status} />

            <span className="rounded-full bg-[#FFF4D8] px-3 py-1 text-xs font-bold text-[#D9543F]">
              {getCategoryName(report)}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              ID #{report.id}
            </span>
          </div>

          <h2 className="text-xl font-black text-[#0B2D4D]">{report.title}</h2>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {report.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
            <span>Pelapor: {getReporterName(report)}</span>
            <span>Lokasi: {report.location_name || "-"}</span>
            <span>{formatDateTime(report.created_at)}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-slate-500">
            <span className="rounded-full bg-slate-50 px-3 py-1">
              {voteCount} upvote
            </span>
            <span className="rounded-full bg-slate-50 px-3 py-1">
              {commentCount} komentar
            </span>
            <span className="rounded-full bg-slate-50 px-3 py-1">
              Prioritas: {report.priority_score ?? "-"}
            </span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Update Status
          </label>

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 outline-none transition focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
          <button
            type="button"
            onClick={handleUpdateStatus}
            disabled={!hasChanged || updateStatusMutation.isPending}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#D9543F] px-5 text-sm font-black text-white transition hover:bg-[#c24634] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateStatusMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Simpan Status
              </>
            )}
          </button>

          <Link
            href={`/reports/${report.id}`}
            className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-black text-[#0B2D4D] transition hover:bg-slate-50"
          >
            Detail
          </Link>
        </div>
      </div>

      {updateStatusMutation.isError ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {updateStatusMutation.error instanceof Error
            ? updateStatusMutation.error.message
            : "Gagal memperbarui status laporan."}
        </div>
      ) : null}

      {updateStatusMutation.isSuccess ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          Status laporan berhasil diperbarui.
        </div>
      ) : null}
    </article>
  );
}

export function AdminReportsClient() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");

  const params = useMemo(
    () => ({
      search: keyword.trim() || undefined,
      status: status === "all" ? undefined : status,
    }),
    [keyword, status],
  );

  const { data: reports = [], isLoading, isError, error } = useAdminReports(params);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[#0B2D4D] p-8 text-white shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#F5C451]">
          Manajemen Laporan
        </p>
        <h1 className="mt-3 font-serif text-4xl font-black leading-tight md:text-5xl">
          Verifikasi dan tindak lanjuti laporan.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
          Admin dapat memantau laporan masyarakat, mengubah status, melihat
          prioritas, dan membuka detail laporan untuk konteks lebih lengkap.
        </p>
      </section>

      <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Cari judul laporan..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 outline-none transition focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
          >
            <option value="all">Semua Status</option>
            {statusOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-[1.5rem] bg-white" />
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
              : "Terjadi kesalahan saat mengambil data laporan."
          }
        />
      ) : null}

      {!isLoading && !isError && reports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Tidak ada laporan"
          description="Belum ada laporan yang sesuai dengan filter ini."
        />
      ) : null}

      {!isLoading && !isError && reports.length > 0 ? (
        <section className="space-y-4">
          {reports.map((report) => (
            <AdminReportItem key={report.id} report={report} />
          ))}
        </section>
      ) : null}
    </div>
  );
}