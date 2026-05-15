"use client";

import { FileText, Search, UserCircle, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "../common/empty-state";
import { useAdminReports } from "../../hooks/use-admin-data";
import { getInitials } from "../../lib/utils";
import type { Report } from "../../types/report";

interface CitizenSummary {
  id: number;
  name: string;
  totalReports: number;
  pendingReports: number;
  processingReports: number;
  resolvedReports: number;
  rejectedReports: number;
}

function getCitizenFromReport(report: Report) {
  const id = Number(report.users?.id ?? report.user?.id ?? report.user_id);
  const name = report.users?.name || report.user?.name || `Citizen #${id}`;

  if (!Number.isFinite(id)) return null;

  return {
    id,
    name,
  };
}

function buildCitizenSummaries(reports: Report[]): CitizenSummary[] {
  const map = new Map<number, CitizenSummary>();

  reports.forEach((report) => {
    const citizen = getCitizenFromReport(report);

    if (!citizen) return;

    const current =
      map.get(citizen.id) ??
      {
        id: citizen.id,
        name: citizen.name,
        totalReports: 0,
        pendingReports: 0,
        processingReports: 0,
        resolvedReports: 0,
        rejectedReports: 0,
      };

    current.totalReports += 1;

    if (report.status === "pending") current.pendingReports += 1;
    if (report.status === "processing") current.processingReports += 1;
    if (report.status === "resolved") current.resolvedReports += 1;
    if (report.status === "rejected") current.rejectedReports += 1;

    map.set(citizen.id, current);
  });

  return Array.from(map.values()).sort((a, b) => b.totalReports - a.totalReports);
}

export function AdminUsersClient() {
  const { data: reports = [], isLoading, isError, error } = useAdminReports();

  const [keyword, setKeyword] = useState("");

  const citizens = useMemo(() => buildCitizenSummaries(reports), [reports]);

  const filteredCitizens = useMemo(() => {
    const searchKeyword = keyword.trim().toLowerCase();

    if (!searchKeyword) return citizens;

    return citizens.filter((citizen) => {
      return (
        citizen.name.toLowerCase().includes(searchKeyword) ||
        String(citizen.id).includes(searchKeyword)
      );
    });
  }, [citizens, keyword]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[#0B2D4D] p-8 text-white shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#F5C451]">
          Admin Users
        </p>
        <h1 className="mt-3 font-serif text-4xl font-black leading-tight md:text-5xl">
          Pantau citizen aktif.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
          Lihat daftar citizen yang pernah membuat laporan beserta ringkasan
          kontribusinya.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
          <Users className="mb-4 h-7 w-7 text-[#D9543F]" />
          <p className="text-sm font-semibold text-slate-500">Citizen Aktif</p>
          <h2 className="mt-2 text-3xl font-black text-[#0B2D4D]">
            {isLoading ? "..." : citizens.length}
          </h2>
        </div>

        <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
          <FileText className="mb-4 h-7 w-7 text-blue-600" />
          <p className="text-sm font-semibold text-slate-500">Total Laporan</p>
          <h2 className="mt-2 text-3xl font-black text-[#0B2D4D]">
            {isLoading ? "..." : reports.length}
          </h2>
        </div>

        <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
          <UserCircle className="mb-4 h-7 w-7 text-emerald-600" />
          <p className="text-sm font-semibold text-slate-500">
            Rata-rata Laporan
          </p>
          <h2 className="mt-2 text-3xl font-black text-[#0B2D4D]">
            {isLoading || citizens.length === 0
              ? "..."
              : Math.round(reports.length / citizens.length)}
          </h2>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Cari nama citizen atau ID..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
          />
        </div>
      </section>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : null}

      {isError ? (
        <EmptyState
          icon={Users}
          title="Gagal memuat citizen"
          description={
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat mengambil data citizen."
          }
        />
      ) : null}

      {!isLoading && !isError && filteredCitizens.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Citizen tidak ditemukan"
          description="Belum ada citizen yang sesuai dengan kata kunci pencarian."
        />
      ) : null}

      {!isLoading && !isError && filteredCitizens.length > 0 ? (
        <section className="space-y-4">
          {filteredCitizens.map((citizen) => (
            <article
              key={citizen.id}
              className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:border-[#F5C451]"
            >
              <div className="grid gap-5 md:grid-cols-[1fr_130px_130px_130px_130px] md:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF4D8] text-lg font-black text-[#D9543F]">
                    {getInitials(citizen.name)}
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-[#0B2D4D]">
                      {citizen.name}
                    </h2>
                    <p className="text-sm font-semibold text-slate-400">
                      Citizen ID #{citizen.id}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                  <p className="font-black text-[#0B2D4D]">
                    {citizen.totalReports}
                  </p>
                  <p className="text-xs text-slate-500">Total</p>
                </div>

                <div className="rounded-2xl bg-amber-50 p-4 text-sm">
                  <p className="font-black text-amber-700">
                    {citizen.pendingReports}
                  </p>
                  <p className="text-xs text-amber-700">Pending</p>
                </div>

                <div className="rounded-2xl bg-blue-50 p-4 text-sm">
                  <p className="font-black text-blue-700">
                    {citizen.processingReports}
                  </p>
                  <p className="text-xs text-blue-700">Diproses</p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4 text-sm">
                  <p className="font-black text-emerald-700">
                    {citizen.resolvedReports}
                  </p>
                  <p className="text-xs text-emerald-700">Selesai</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}