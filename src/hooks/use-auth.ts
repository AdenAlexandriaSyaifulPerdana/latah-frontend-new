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
    const currentSession = authStorage.getSession();
    setSession(currentSession);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (payload: LoginRequest) => {
      const response = await authService.login(payload);

      console.log("LOGIN RESPONSE:", response);

      if (!response?.success) {
        throw new Error(response?.message || "Login gagal.");
      }

      if (!response.token) {
        throw new Error("Token tidak ditemukan pada response login.");
      }

      if (!response.user) {
        throw new Error("Data user tidak ditemukan pada response login.");
      }

      const nextSession: AuthSession = {
        token: response.token,
        user: response.user,
      };

      authStorage.setSession(nextSession);
      setSession(nextSession);

      const dashboardPath = authService.getDashboardPath(response.user.role);

      console.log("REDIRECT TO:", dashboardPath);

      router.replace(dashboardPath);

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
    router.replace(ROUTES.login);
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