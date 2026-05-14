"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "../lib/api";
import type { ApiResponse } from "../types/api";
import type {
  DashboardStats,
  HotspotArea,
  RecentReport,
  TopCategory,
  UserAnalytics,
} from "../types/dashboard";

function extractData<T>(response: ApiResponse<T> | T): T {
  if (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    "data" in response
  ) {
    return (response as ApiResponse<T>).data as T;
  }

  return response as T;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<DashboardStats> | DashboardStats>(
        "/dashboard/stats",
        {
          auth: true,
        },
      );

      return extractData<DashboardStats>(response);
    },
  });
}

export function useRecentReports() {
  return useQuery({
    queryKey: ["dashboard", "recent-reports"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<RecentReport[]> | RecentReport[]>(
        "/dashboard/recent-reports",
        {
          auth: true,
        },
      );

      return extractData<RecentReport[]>(response) ?? [];
    },
  });
}

export function useTopCategories() {
  return useQuery({
    queryKey: ["dashboard", "top-categories"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<TopCategory[]> | TopCategory[]>(
        "/dashboard/top-categories",
        {
          auth: true,
        },
      );

      return extractData<TopCategory[]>(response) ?? [];
    },
  });
}

export function useHotspots() {
  return useQuery({
    queryKey: ["dashboard", "hotspots"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<HotspotArea[]> | HotspotArea[]>(
        "/dashboard/hotspots",
        {
          auth: true,
        },
      );

      return extractData<HotspotArea[]>(response) ?? [];
    },
  });
}

export function useUserAnalytics(userId?: number) {
  return useQuery({
    queryKey: ["analytics", "user", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<UserAnalytics> | UserAnalytics>(
        "/analytics/user",
        {
          auth: true,
          params: {
            user_id: userId,
          },
        },
      );

      return extractData<UserAnalytics>(response);
    },
  });
}