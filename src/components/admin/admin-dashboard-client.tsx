"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";

import { EmptyState } from "../common/empty-state";
import { StatCard } from "../common/stat-card";
import { ReportCard } from "../reports/report-card";
import { useAdminReports } from "../../hooks/use-admin-data";
import { ROUTES } from "../../lib/constants";
import type { Report } from "../../types/report";

function getOwnerId(report: Report) {
  return report.users?.id ?? report.user?.id ?? report.user_id ?? null;
}

export function AdminDashboardClient() {
  const { data: reports = [], isLoading, isError, error } = useAdminReports();

  const totalReports = reports.length;
  const pendingReports = reports.filter((report) => report.status === "pending").length;
  const processingReports = reports.filter(
    (report) => report.status === "processing",
  ).length;
  const resolvedReports = reports.filter(
    (report) => report.status === "resolved",
  ).length;

  const totalCitizens = new Set(
    reports.map((report) => getOwnerId(report)).filter(Boolean),
  ).size;

  const recentReports = reports.slice(0, 4);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[#0B2D4D] p-8 text-white shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#F5C451]">
              Admin Command Center
            </p>
            <h2 className="mt-3 font-serif text-4xl font-black leading-tight md:text-5xl">
              Monitoring laporan kota.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
              Pantau laporan masyarakat, prioritas penanganan, status verifikasi,
              dan aktivitas warga dalam satu dashboard.
            </p>
          </div>

          <Link
            href={ROUTES.adminReports}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F5C451] px-6 py-3 text-sm font-black text-[#0B2D4D] transition hover:bg-[#ffd25d]"
          >
            <ShieldCheck className="h-4 w-4" />
            Kelola Laporan
          </Link>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Laporan"
          value={isLoading ? "..." : totalReports}
          description="Seluruh laporan yang masuk."
          icon={FileText}
        />
        <StatCard
          title="Pending"
          value={isLoading ? "..." : pendingReports}
          description="Laporan baru menunggu tindak lanjut."
          icon={Clock}
        />
        <StatCard
          title="Diproses"
          value={isLoading ? "..." : processingReports}
          description="Laporan sedang dalam proses."
          icon={Loader2}
        />
        <StatCard
          title="Warga Aktif"
          value={isLoading ? "..." : totalCitizens}
          description="Pengguna yang memiliki laporan."
          icon={Users}
        />
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-2xl font-black text-[#0B2D4D]">
              Ringkasan Status
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Distribusi laporan berdasarkan status penanganan.
            </p>
          </div>

          <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
            {resolvedReports} laporan selesai
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-700">Pending</p>
            <p className="mt-2 text-3xl font-black text-amber-700">
              {pendingReports}
            </p>
          </div>

          <div className="rounded-2xl bg-blue-50 p-5">
            <p className="text-sm font-semibold text-blue-700">Diproses</p>
            <p className="mt-2 text-3xl font-black text-blue-700">
              {processingReports}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-emerald-700">Selesai</p>
            <p className="mt-2 text-3xl font-black text-emerald-700">
              {resolvedReports}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-700">Total</p>
            <p className="mt-2 text-3xl font-black text-slate-700">
              {totalReports}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-2xl font-black text-[#0B2D4D]">
              Laporan Terbaru
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Laporan terbaru yang masuk ke sistem LATAH.
            </p>
          </div>

          <Link
            href={ROUTES.adminReports}
            className="text-sm font-black text-[#D9543F] transition hover:text-[#0B2D4D]"
          >
            Lihat semua laporan
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
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
                : "Terjadi kesalahan saat mengambil data laporan."
            }
          />
        ) : null}

        {!isLoading && !isError && recentReports.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {recentReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                href={`/reports/${report.id}`}
              />
            ))}
          </div>
        ) : null}

        {!isLoading && !isError && recentReports.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="Belum ada laporan"
            description="Laporan masyarakat akan tampil di sini setelah masuk ke sistem."
          />
        ) : null}
      </section>
    </div>
  );
}