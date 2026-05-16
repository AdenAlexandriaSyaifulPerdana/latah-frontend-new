"use client";

import Link from "next/link";
import { ShieldCheck, Users } from "lucide-react";

import { ROUTES } from "../../lib/constants";
import type { UserRole } from "../../types/user";

interface DashboardHeaderProps {
  role: UserRole;
}

export function DashboardHeader({ role }: DashboardHeaderProps) {
  const subtitle = role === "admin" ? "Admin LATAH" : "Citizen LATAH";

  return (
    <header className="sticky top-0 z-[120] border-b border-white/10 bg-[#0B2D4D] text-white shadow-sm lg:hidden">
      <div className="flex min-h-[84px] items-center justify-between gap-4 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F5C451] text-[#0B2D4D] shadow-lg">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-black leading-none text-white">
              Dashboard
            </h1>
            <p className="mt-1 truncate text-sm font-semibold text-white/65">
              {subtitle}
            </p>
          </div>
        </div>

        <Link
          href={ROUTES.home}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 text-sm font-black text-white transition active:scale-95"
        >
          <Users className="h-5 w-5" />
          Public
        </Link>
      </div>
    </header>
  );
}