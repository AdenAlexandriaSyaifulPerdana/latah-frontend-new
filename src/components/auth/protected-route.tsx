"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import { FullPageLoader } from "../../components/common/full-page-loader";
import { authService } from "../../lib/auth";
import { ROUTES } from "../../lib/constants";
import { useAuth } from "../../hooks/use-auth";
import type { UserRole } from "../../types/user";

interface ProtectedRouteProps {
  role: UserRole;
  children: ReactNode;
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace(ROUTES.login);
      return;
    }

    if (user.role !== role) {
      router.replace(authService.getDashboardPath(user.role));
    }
  }, [isLoading, isAuthenticated, user, role, router]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated || !user || user.role !== role) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}