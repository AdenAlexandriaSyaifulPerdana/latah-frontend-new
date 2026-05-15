import { ProtectedRoute } from "../../components/auth/protected-route";
import { DashboardShell } from "../../components/layout/dashboard-shell";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["citizen"]}>
      <DashboardShell role="citizen">{children}</DashboardShell>
    </ProtectedRoute>
  );
}