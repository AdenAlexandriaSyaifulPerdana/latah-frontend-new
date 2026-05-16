"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useMemo } from "react";

import { adminNavLinks, citizenNavLinks } from "../../data/nav-links";
import { useAuth } from "../../hooks/use-auth";
import { useCitizenNotifications } from "../../hooks/use-citizen-data";
import { ROUTES } from "../../lib/constants";
import { cn } from "../../lib/utils";
import type { UserRole } from "../../types/user";

interface DashboardMobileBottomNavProps {
  role: UserRole;
}

export function DashboardMobileBottomNav({
  role,
}: DashboardMobileBottomNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const { data: notifications = [] } = useCitizenNotifications(
    role === "citizen" ? user?.id : undefined,
  );

  const unreadNotificationCount = notifications.filter(
    (notification) => notification.is_read === false,
  ).length;

  const links = useMemo(() => {
    const sourceLinks = role === "admin" ? adminNavLinks : citizenNavLinks;

    const mobileHrefs =
      role === "admin"
        ? [
            ROUTES.adminDashboard,
            ROUTES.adminReports,
            ROUTES.adminAnalytics,
            ROUTES.adminMap,
            ROUTES.adminProfile,
          ]
        : [
            ROUTES.citizenDashboard,
            ROUTES.citizenNewReport,
            ROUTES.citizenMyReports,
            ROUTES.citizenNotifications,
            ROUTES.citizenProfile,
          ];

    return mobileHrefs
      .map((href) => sourceLinks.find((item) => item.href === href))
      .filter(Boolean) as typeof sourceLinks;
  }, [role]);

  function handleNavigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (pathname === href) return;

    event.preventDefault();
    window.location.href = href;
  }

  return (
    <nav className="fixed bottom-4 left-1/2 z-[120] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 lg:hidden">
      <div className="flex items-center justify-between gap-2 rounded-[2rem] border border-white/10 bg-[#101820]/95 p-2 shadow-2xl backdrop-blur-xl">
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
              onClick={(event) => handleNavigate(event, item.href)}
              aria-label={item.label}
              title={item.label}
              className={cn(
                "relative flex h-14 min-w-0 flex-1 items-center justify-center rounded-[1.5rem] text-white/80 transition active:scale-95",
                active && "bg-white/18 text-white shadow-inner",
              )}
            >
              <Icon className="h-7 w-7" />

              {showNotificationDot ? (
                <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#101820]" />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}