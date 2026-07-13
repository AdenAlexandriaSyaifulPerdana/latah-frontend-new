"use client";

import {
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  ShieldCheck,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { EmptyState } from "../common/empty-state";
import { StatCard } from "../common/stat-card";
import { useAdminReports } from "../../hooks/use-admin-data";
import type { Report } from "../../types/report";

function getCategoryName(report: Report) {
  if (report.report_categories?.name) return report.report_categories.name;
  if (typeof report.category === "string") return report.category;
  return report.category?.name || "Umum";
}

function getReporterId(report: Report) {
  return report.users?.id ?? report.user?.id ?? report.user_id ?? null;
}

function getStatusCount(reports: Report[], status: string) {
  return reports.filter((report) => report.status === status).length;
}

function getCategoryStats(reports: Report[]) {
  const map = new Map<string, number>();

  reports.forEach((report) => {
    const category = getCategoryName(report);
    map.set(category, (map.get(category) ?? 0) + 1);
  });

  return Array.from(map.entries())
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);
}

function getPriorityAverage(reports: Report[]) {
  const values = reports
    .map((report) => Number(report.priority_score))
    .filter((value) => Number.isFinite(value));

  if (values.length === 0) return 0;

  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round(total / values.length);
}

function getPercentage(value: number, total: number) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function AdminAnalyticsClient() {
  const { data: reports = [], isLoading, isError, error } = useAdminReports();

  const totalReports = reports.length;
  const pendingReports = getStatusCount(reports, "pending");
  const verifiedReports = getStatusCount(reports, "verified");
  const processingReports = getStatusCount(reports, "processing");
  const resolvedReports = getStatusCount(reports, "resolved");
  const rejectedReports = getStatusCount(reports, "rejected");

  const totalCitizens = new Set(
    reports.map((report) => getReporterId(report)).filter(Boolean),
  ).size;

  const averagePriority = getPriorityAverage(reports);
  const categoryStats = getCategoryStats(reports);

  const completionRate = getPercentage(resolvedReports, totalReports);
  const responseRate = getPercentage(
    verifiedReports + processingReports + resolvedReports,
    totalReports,
  );

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[#0B2D4D] p-8 text-white shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#F5C451]">
          Admin Analytics
        </p>
        <h1 className="mt-3 font-serif text-4xl font-black leading-tight md:text-5xl">
          Analisis performa laporan kota.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
          Pantau distribusi status laporan, kategori masalah terbanyak,
          rata-rata prioritas, dan tingkat penyelesaian laporan masyarakat.
        </p>
      </section>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-[1.5rem] bg-white"
            />
          ))}
        </div>
      ) : null}

      {isError ? (
        <EmptyState
          icon={BarChart3}
          title="Gagal memuat analytics"
          description={
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat mengambil data analytics."
          }
        />
      ) : null}

      {!isLoading && !isError ? (
        <>
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Laporan"
              value={totalReports}
              description="Seluruh laporan yang masuk."
              icon={FileText}
            />
            <StatCard
              title="Warga Aktif"
              value={totalCitizens}
              description="Warga yang pernah melapor."
              icon={ShieldCheck}
            />
            <StatCard
              title="Prioritas Rata-rata"
              value={averagePriority}
              description="Skor prioritas rata-rata laporan."
              icon={TrendingUp}
            />
            <StatCard
              title="Completion Rate"
              value={`${completionRate}%`}
              description="Persentase laporan selesai."
              icon={CheckCircle2}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4D8] text-[#D9543F]">
                  <BarChart3 className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-[#0B2D4D]">
                    Distribusi Status
                  </h2>
                  <p className="text-sm text-slate-500">
                    Perbandingan laporan berdasarkan status penanganan.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "Pending",
                    total: pendingReports,
                    className: "bg-amber-500",
                    icon: Clock,
                  },
                  {
                    label: "Terverifikasi",
                    total: verifiedReports,
                    className: "bg-purple-500",
                    icon: ShieldCheck,
                  },
                  {
                    label: "Diproses",
                    total: processingReports,
                    className: "bg-blue-500",
                    icon: Loader2,
                  },
                  {
                    label: "Selesai",
                    total: resolvedReports,
                    className: "bg-emerald-500",
                    icon: CheckCircle2,
                  },
                  {
                    label: "Ditolak",
                    total: rejectedReports,
                    className: "bg-red-500",
                    icon: XCircle,
                  },
                ].map((item) => {
                  const percentage = getPercentage(item.total, totalReports);
                  const Icon = item.icon;

                  return (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 font-black text-[#0B2D4D]">
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </div>
                        <span className="font-bold text-slate-500">
                          {item.total} laporan · {percentage}%
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${item.className}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#0B2D4D] p-6 text-white shadow-sm">
              <h2 className="text-2xl font-black">Ringkasan Respons</h2>
              <p className="mt-2 text-sm leading-7 text-white/65">
                Rasio laporan yang sudah masuk ke tahap verifikasi, proses,
                atau penyelesaian.
              </p>

              <div className="mt-8 text-center">
                <p className="text-6xl font-black text-[#F5C451]">
                  {responseRate}%
                </p>
                <p className="mt-2 text-sm font-semibold text-white/65">
                  Response Rate
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/55">Selesai</p>
                  <p className="mt-1 text-2xl font-black">{resolvedReports}</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/55">Belum selesai</p>
                  <p className="mt-1 text-2xl font-black">
                    {totalReports - resolvedReports}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-[#0B2D4D]">
              Kategori Masalah Terbanyak
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Kategori dengan jumlah laporan paling tinggi.
            </p>

            <div className="mt-6 space-y-4">
              {categoryStats.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                  Belum ada data kategori.
                </div>
              ) : (
                categoryStats.map((item, index) => {
                  const percentage = getPercentage(item.total, totalReports);

                  return (
                    <div
                      key={item.name}
                      className="rounded-2xl border border-slate-100 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="font-black text-[#0B2D4D]">
                            #{index + 1} {item.name}
                          </p>
                          <p className="text-xs font-semibold text-slate-400">
                            {item.total} laporan
                          </p>
                        </div>

                        <p className="text-sm font-black text-[#D9543F]">
                          {percentage}%
                        </p>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#D9543F]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}