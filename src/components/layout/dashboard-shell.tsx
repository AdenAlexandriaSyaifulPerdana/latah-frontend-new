"use client";

import { DashboardHeader } from "./dashboard-header";
import { DashboardMobileBottomNav } from "./dashboard-mobile-bottom-nav";
import { DashboardSidebar } from "./dashboard-sidebar";
import type { UserRole } from "../../types/user";

interface DashboardShellProps {
  role: UserRole;
  children: React.ReactNode;
}

export function DashboardShell({ role, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#FAFAF7] lg:flex">
      <DashboardSidebar role={role} />

      <div className="min-w-0 flex-1">
        <DashboardHeader role={role} />

        <main className="mx-auto w-full max-w-[1600px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
          {children}
        </main>
      </div>

      <DashboardMobileBottomNav role={role} />
    </div>
  );
}