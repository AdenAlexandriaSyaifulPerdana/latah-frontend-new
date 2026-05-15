import { DashboardShell } from "../../components/layout/dashboard-shell";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="citizen">{children}</DashboardShell>;
}