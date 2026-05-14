"use client";

import type { ReactNode } from "react";

import { ProtectedRoute } from "../../components/auth/protected-route";
import { DashboardSidebar } from "../../components/layout/dashboard-sidebar";
import { DashboardTopbar } from "../../components/layout/dashboard-topbar";
import type { UserRole } from "../../types/user";

interface DashboardShellProps {
  role: UserRole;
  children: ReactNode;
}

export function DashboardShell({ role, children }: DashboardShellProps) {
  return (
    <ProtectedRoute role={role}>
      <div className="min-h-screen bg-[#FAFAF7]">
        <div className="flex min-h-screen">
          <DashboardSidebar role={role} />

          <div className="flex min-w-0 flex-1 flex-col">
            <DashboardTopbar role={role} />

            <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}