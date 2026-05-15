"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";
import type { UserRole } from "../../types/user";

interface DashboardShellProps {
  role: UserRole;
  children: React.ReactNode;
}

export function DashboardShell({ role, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-[#FAFAF7] lg:flex">
      <DashboardSidebar role={role} variant="desktop" />

      <div className="min-w-0 flex-1">
        <DashboardHeader
          role={role}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <div className="absolute left-0 top-0 h-full">
            <DashboardSidebar
              role={role}
              variant="mobile"
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0B2D4D] shadow-lg"
            aria-label="Tutup menu dashboard"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      ) : null}
    </div>
  );
}