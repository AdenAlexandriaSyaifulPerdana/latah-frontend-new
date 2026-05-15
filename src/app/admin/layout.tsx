import { ProtectedRoute } from "../../components/auth/protected-route";
import { DashboardShell } from "../../components/layout/dashboard-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardShell role="admin">{children}</DashboardShell>
    </ProtectedRoute>
  );
}