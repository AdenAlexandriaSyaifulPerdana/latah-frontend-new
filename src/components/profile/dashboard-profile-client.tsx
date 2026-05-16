"use client";

import Link from "next/link";
import {
  FileText,
  LogOut,
  ShieldCheck,
  UserCircle,
  Users,
} from "lucide-react";

import { LogoutButton } from "../layout/logout-button";
import { useAuth } from "../../hooks/use-auth";
import { ROUTES } from "../../lib/constants";
import { getInitials } from "../../lib/utils";
import type { UserRole } from "../../types/user";

interface DashboardProfileClientProps {
  role: UserRole;
}

export function DashboardProfileClient({ role }: DashboardProfileClientProps) {
  const { user } = useAuth();

  const dashboardHref =
    role === "admin" ? ROUTES.adminDashboard : ROUTES.citizenDashboard;

  const roleLabel = role === "admin" ? "Admin LATAH" : "Citizen LATAH";

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[#0B2D4D] p-8 text-white shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#F5C451]">
          Profile
        </p>
        <h1 className="mt-3 font-serif text-4xl font-black leading-tight md:text-5xl">
          Kelola akunmu.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
          Lihat informasi akun, kembali ke halaman publik, atau logout dari
          dashboard LATAH.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#FFF4D8] text-3xl font-black text-[#D9543F]">
            {getInitials(user?.name)}
          </div>

          <h2 className="mt-5 text-2xl font-black text-[#0B2D4D]">
            {user?.name || "Pengguna LATAH"}
          </h2>

          <p className="mt-2 text-sm font-semibold text-slate-500">
            {user?.email || "-"}
          </p>

          <div className="mt-5 inline-flex rounded-full bg-[#0B2D4D] px-4 py-2 text-sm font-black text-white">
            {roleLabel}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-black text-[#0B2D4D]">
            Aksi Akun
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            Gunakan menu ini untuk berpindah halaman atau keluar dari akun.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Link
              href={dashboardHref}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-[#F5C451] hover:bg-[#FFF4D8]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0B2D4D] shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <p className="font-black text-[#0B2D4D]">Dashboard</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Kembali ke dashboard
                </p>
              </div>
            </Link>

            <Link
              href={ROUTES.home}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-[#F5C451] hover:bg-[#FFF4D8]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0B2D4D] shadow-sm">
                <Users className="h-6 w-6" />
              </div>

              <div>
                <p className="font-black text-[#0B2D4D]">Public</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Buka halaman publik
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0B2D4D] shadow-sm">
                <UserCircle className="h-6 w-6" />
              </div>

              <div>
                <p className="font-black text-[#0B2D4D]">Role</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {roleLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0B2D4D] shadow-sm">
                <FileText className="h-6 w-6" />
              </div>

              <div>
                <p className="font-black text-[#0B2D4D]">Status</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Akun aktif
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-red-100 bg-red-50 p-5">
            <h3 className="text-lg font-black text-red-700">
              Keluar dari akun
            </h3>

            <p className="mt-2 text-sm leading-7 text-red-600/80">
              Logout akan menghapus sesi login dari browser ini.
            </p>

            <LogoutButton className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#D9543F] px-6 text-sm font-black text-white transition hover:bg-[#c24634]">
              <LogOut className="h-4 w-4" />
              Logout
            </LogoutButton>
          </div>
        </div>
      </section>
    </div>
  );
}