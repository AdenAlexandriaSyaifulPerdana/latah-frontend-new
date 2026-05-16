"use client";

import Link from "next/link";
import { LogOut, Menu, ShieldCheck } from "lucide-react";

import { getInitials } from "../../lib/utils";
import { useAuth } from "../../hooks/use-auth";
import type { UserRole } from "../../types/user";

interface DashboardTopbarProps {
  role: UserRole;
}

export function DashboardTopbar({ role }: DashboardTopbarProps) {
  const { user, logout } = useAuth();

  const title =
    role === "admin" ? "Dashboard Admin LATAH" : "Dashboard Citizen LATAH";

  return (
    <header className="sticky top-0 z-[100] border-b border-slate-100 bg-white/90 px-5 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 lg:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-[#0B2D4D] text-[#F5C451] sm:flex lg:hidden">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-500">
              Selamat datang kembali
            </p>
            <h1 className="text-lg font-black text-[#0B2D4D] md:text-xl">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 md:inline-flex"
          >
            Lihat Website
          </Link>

          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF4D8] text-sm font-black text-[#D9543F]">
              {getInitials(user?.name)}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-black text-[#0B2D4D]">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500">{user?.role || role}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D9543F] text-white transition hover:bg-[#c24634]"
            aria-label="Keluar"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}