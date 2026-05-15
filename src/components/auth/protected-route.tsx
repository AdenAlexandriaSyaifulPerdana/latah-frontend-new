"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo } from "react";

import { FullPageLoader } from "../common/full-page-loader";
import { useAuth } from "../../hooks/use-auth";
import { ROUTES } from "../../lib/constants";
import type { UserRole } from "../../types/user";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

function getFallbackPath(role?: string) {
  if (role === "admin") return ROUTES.adminDashboard;
  if (role === "citizen") return ROUTES.citizenDashboard;

  return ROUTES.login;
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();

  const { user, isAuthenticated, isLoading } = useAuth();

  const isAllowed = useMemo(() => {
    if (!user?.role) return false;
    return allowedRoles.includes(user.role);
  }, [allowedRoles, user?.role]);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace(ROUTES.login);
      return;
    }

    if (!isAllowed) {
      router.replace(getFallbackPath(user.role));
    }
  }, [isLoading, isAuthenticated, user, isAllowed, router]);

  if (isLoading) {
    return (
      <FullPageLoader
        title="Memeriksa sesi"
        description="Kami sedang memastikan akses dashboard kamu."
      />
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <FullPageLoader
        title="Mengalihkan ke login"
        description="Silakan masuk terlebih dahulu untuk mengakses dashboard."
      />
    );
  }

  if (!isAllowed) {
    return (
      <FullPageLoader
        title="Mengalihkan dashboard"
        description="Role akun tidak sesuai dengan halaman yang dibuka."
      />
    );
  }

  return <>{children}</>;
}