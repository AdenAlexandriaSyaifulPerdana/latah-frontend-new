"use client";

import { LogOut, ShieldCheck } from "lucide-react";

import { LogoutButton } from "./logout-button";
import type { UserRole } from "../../types/user";

interface DashboardHeaderProps {
  role: UserRole;
}

export function DashboardHeader({ role }: DashboardHeaderProps) {
  const title = role === "admin" ? "Dashboard Admin" : "Dashboard Citizen";

  return (
    <header className="sticky top-0 z-[120] border-b border-white/10 bg-[#0B2D4D] text-white shadow-sm lg:hidden">
      <div className="flex min-h-[92px] items-center justify-between gap-4 px-5 py-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-[#F5C451] text-[#0B2D4D] shadow-lg">
            <ShieldCheck className="h-9 w-9" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-2xl font-black leading-tight text-white">
              {title}
            </h1>
            <p className="mt-1 truncate text-sm font-semibold text-white/65">
              Lapor Pemerintah
            </p>
          </div>
        </div>

        <LogoutButton
          ariaLabel="Logout"
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem] border border-white/15 bg-white/10 text-white transition active:scale-95"
        >
          <LogOut className="h-8 w-8" />
        </LogoutButton>
      </div>
    </header>
  );
}