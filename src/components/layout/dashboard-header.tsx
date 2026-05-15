"use client";

import { Menu, LogOut } from "lucide-react";

import { useAuth } from "../../hooks/use-auth";
import { getInitials } from "../../lib/utils";
import type { UserRole } from "../../types/user";

interface DashboardHeaderProps {
  role: UserRole;
  onOpenSidebar: () => void;
}

export function DashboardHeader({ role, onOpenSidebar }: DashboardHeaderProps) {
  const { user, logout } = useAuth();

  const title =
    role === "admin" ? "Dashboard Admin LATAH" : "Dashboard Citizen LATAH";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur lg:hidden">
      <div className="flex min-h-[96px] items-center gap-3 px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[#0B2D4D] shadow-sm transition active:scale-95"
          aria-label="Buka menu dashboard"
        >
          <Menu className="h-7 w-7" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-5 text-slate-500">
            Selamat datang kembali
          </p>
          <h1 className="mt-1 text-2xl font-black leading-tight text-[#0B2D4D] sm:text-3xl">
            {title}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden h-14 min-w-14 items-center justify-center rounded-2xl border border-slate-100 bg-white px-4 text-sm font-black text-[#D9543F] shadow-sm min-[390px]:flex">
            <span className="rounded-full bg-[#FFF4D8] px-3 py-2">
              {getInitials(user?.name)}
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D9543F] text-white shadow-sm transition active:scale-95"
            aria-label="Keluar"
          >
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}