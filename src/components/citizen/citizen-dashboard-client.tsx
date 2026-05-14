"use client";

import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock,
  FileText,
  MessageCircle,
  PlusCircle,
  ThumbsUp,
} from "lucide-react";

import { EmptyState } from "../common/empty-state";
import { StatCard } from "../common/stat-card";
import { ReportCard } from "../reports/report-card";
import { useAuth } from "../../hooks/use-auth";
import { useCitizenAnalytics, useCitizenReports } from "../../hooks/use-citizen-data";
import { ROUTES } from "../../lib/constants";

export function CitizenDashboardClient() {
  const { user } = useAuth();
  const userId = user?.id;

  const { data: analytics, isLoading: analyticsLoading } =
    useCitizenAnalytics(userId);

  const { data: reports = [], isLoading: reportsLoading } =
    useCitizenReports(userId);

  const pendingReports = reports.filter((report) => report.status === "pending").length;
  const processingReports = reports.filter(
    (report) => report.status === "processing",
  ).length;
  const resolvedReports = reports.filter(
    (report) => report.status === "resolved",
  ).length;

  const recentReports = reports.slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[#0B2D4D] p-8 text-white shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#F5C451]">
              Citizen Dashboard
            </p>
            <h2 className="mt-3 font-serif text-4xl font-black leading-tight md:text-5xl">
              Halo, {user?.name || "Warga Jember"}.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
              Buat laporan masalah kota, pantau status laporan, beri dukungan,
              dan ikuti perkembangan laporan publik secara transparan.
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

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Laporan Saya"
          value={analyticsLoading ? "..." : analytics?.total_reports ?? reports.length}
          description="Total laporan yang telah dibuat."
          icon={FileText}
        />
        <StatCard
          title="Komentar"
          value={analyticsLoading ? "..." : analytics?.total_comments ?? 0}
          description="Total komentar yang dibuat."
          icon={MessageCircle}
        />
        <StatCard
          title="Upvote"
          value={analyticsLoading ? "..." : analytics?.total_votes ?? 0}
          description="Total dukungan pada laporan."
          icon={ThumbsUp}
        />
        <StatCard
          title="Notifikasi"
          value="Aktif"
          description="Update status laporan tersedia."
          icon={Bell}
        />
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
          <Clock className="mb-4 h-7 w-7 text-amber-500" />
          <p className="text-sm font-semibold text-slate-500">Pending</p>
          <h3 className="mt-2 text-3xl font-black text-[#0B2D4D]">
            {reportsLoading ? "..." : pendingReports}
          </h3>
        </div>

        <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
          <FileText className="mb-4 h-7 w-7 text-blue-600" />
          <p className="text-sm font-semibold text-slate-500">Diproses</p>
          <h3 className="mt-2 text-3xl font-black text-[#0B2D4D]">
            {reportsLoading ? "..." : processingReports}
          </h3>
        </div>

        <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
          <CheckCircle2 className="mb-4 h-7 w-7 text-emerald-600" />
          <p className="text-sm font-semibold text-slate-500">Selesai</p>
          <h3 className="mt-2 text-3xl font-black text-[#0B2D4D]">
            {reportsLoading ? "..." : resolvedReports}
          </h3>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-2xl font-black text-[#0B2D4D]">
              Laporan Terbaru Saya
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Pantau laporan terakhir yang kamu kirimkan.
            </p>
          </div>

          <Link
            href={ROUTES.citizenMyReports}
            className="text-sm font-black text-[#D9543F] transition hover:text-[#0B2D4D]"
          >
            Lihat semua laporan
          </Link>
        </div>

        {reportsLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-[420px] animate-pulse rounded-[1.75rem] bg-white"
              />
            ))}
          </div>
        ) : recentReports.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recentReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                href={`/reports/${report.id}`}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="Belum ada laporan"
            description="Mulai buat laporan pertama untuk membantu pemerintah memetakan masalah kota."
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
        )}
      </section>
    </div>
  );
}