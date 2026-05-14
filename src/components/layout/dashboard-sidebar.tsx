"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";

import { adminNavLinks, citizenNavLinks } from "../../data/nav-links";
import { cn } from "../../lib/utils";
import { useAuth } from "../../hooks/use-auth";
import type { UserRole } from "../../types/user";

interface DashboardSidebarProps {
  role: UserRole;
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = role === "admin" ? adminNavLinks : citizenNavLinks;
  const roleLabel = role === "admin" ? "Admin Pemerintah" : "Warga Jember";

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/10 bg-[#0B2D4D] text-white lg:flex lg:flex-col">
      <div className="border-b border-white/10 p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5C451] text-[#0B2D4D]">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xl font-black leading-none">LATAH</p>
            <p className="mt-1 text-xs text-white/60">{roleLabel}</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {links.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white",
                active && "bg-white text-[#0B2D4D] shadow-lg",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Keluar
        </button>
      </div>
    </aside>
  );
}