"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { authService } from "../lib/auth";
import { ROUTES } from "../lib/constants";
import { authStorage } from "../lib/storage";
import type { AuthSession, LoginRequest, RegisterRequest } from "../types/auth";

export function useAuth() {
  const router = useRouter();

  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSession(authStorage.getSession());
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (payload: LoginRequest) => {
      const response = await authService.login(payload);

      const nextSession: AuthSession = {
        token: response.token,
        user: response.user,
      };

      authStorage.setSession(nextSession);
      setSession(nextSession);

      router.push(authService.getDashboardPath(response.user.role));

      return response;
    },
    [router],
  );

  const register = useCallback(async (payload: RegisterRequest) => {
    return authService.register(payload);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setSession(null);
    router.push(ROUTES.login);
  }, [router]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      isAdmin: session?.user.role === "admin",
      isCitizen: session?.user.role === "citizen",
      isLoading,
      login,
      register,
      logout,
    }),
    [session, isLoading, login, register, logout],
  );

  return value;
}