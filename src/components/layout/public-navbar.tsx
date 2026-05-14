"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

import { publicNavLinks } from "../../data/nav-links";
import { authService } from "../../lib/auth";
import { ROUTES } from "../../lib/constants";
import { cn } from "../../lib/utils";
import { useAuth } from "../../hooks/use-auth";

export function PublicNavbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const dashboardHref = user ? authService.getDashboardPath(user.role) : ROUTES.login;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B2D4D]/95 text-white shadow-lg shadow-black/10 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href={ROUTES.home} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5C451] text-[#0B2D4D]">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div>
            <p className="text-lg font-black leading-none">LATAH</p>
            <p className="text-xs text-white/70">Lapor Aspirasi Jember</p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {publicNavLinks.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-semibold text-white/70 transition hover:text-white",
                  active && "text-[#F5C451]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {!isLoading && isAuthenticated ? (
            <Link
              href={dashboardHref}
              className="rounded-full bg-[#F5C451] px-5 py-2 text-sm font-bold text-[#0B2D4D] transition hover:bg-[#ffd25d]"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href={ROUTES.login}
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Masuk
              </Link>
              <Link
                href={ROUTES.register}
                className="rounded-full bg-[#D9543F] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#c24634]"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 text-white md:hidden"
          aria-label="Buka menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-white/10 px-6 pb-5 md:hidden">
          <div className="space-y-2 pt-4">
            {publicNavLinks.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/75 transition hover:bg-white/10 hover:text-white",
                    active && "bg-white/10 text-[#F5C451]",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}

            <div className="grid grid-cols-2 gap-3 pt-3">
              <Link
                href={ROUTES.login}
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/20 px-4 py-3 text-center text-sm font-bold text-white"
              >
                Masuk
              </Link>
              <Link
                href={isAuthenticated ? dashboardHref : ROUTES.register}
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-[#F5C451] px-4 py-3 text-center text-sm font-bold text-[#0B2D4D]"
              >
                {isAuthenticated ? "Dashboard" : "Daftar"}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}