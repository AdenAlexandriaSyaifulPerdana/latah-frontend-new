import type { ReactNode } from "react";

import { DashboardShell } from "../../components/layout/dashboard-shell";

export default function CitizenLayout({ children }: { children: ReactNode }) {
  return <DashboardShell role="citizen">{children}</DashboardShell>;
}