"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent } from "react";
import { LogOut, ShieldCheck } from "lucide-react";

import { adminNavLinks, citizenNavLinks } from "../../data/nav-links";
import { useAuth } from "../../hooks/use-auth";
import { useCitizenNotifications } from "../../hooks/use-citizen-data";
import { ROUTES } from "../../lib/constants";
import { cn } from "../../lib/utils";
import type { UserRole } from "../../types/user";

interface DashboardSidebarProps {
  role: UserRole;
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const { data: notifications = [] } = useCitizenNotifications(
    role === "citizen" ? user?.id : undefined,
  );

  const unreadNotificationCount = notifications.filter(
    (notification) => notification.is_read === true,
  ).length;

  const links = role === "admin" ? adminNavLinks : citizenNavLinks;
  const roleLabel = role === "admin" ? "Admin Pemerintah" : "Warga Jember";

  function handleMenuClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (pathname === href) return;

    event.preventDefault();
    window.location.href = href;
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto overscroll-contain border-r border-white/10 bg-[#0B2D4D] text-white lg:flex lg:flex-col">
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

          const showNotificationDot =
            role === "citizen" &&
            item.href === ROUTES.citizenNotifications &&
            unreadNotificationCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(event) => handleMenuClick(event, item.href)}
              className={cn(
                "relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white",
                active && "bg-white text-[#0B2D4D] shadow-lg",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>

              {/* {showNotificationDot ? (
                <span className="ml-auto flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              ) : null} */}
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