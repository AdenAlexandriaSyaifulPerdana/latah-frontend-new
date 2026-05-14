"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "../lib/api";
import type { ApiResponse } from "../types/api";
import type { Comment, LeaderboardItem, Vote } from "../types/interaction";
import type { Report } from "../types/report";

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

export function useReportComments(reportId?: number | string) {
  return useQuery({
    queryKey: ["reports", reportId, "comments"],
    enabled: Boolean(reportId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<Comment[]> | Comment[]>(
        `/reports/${reportId}/comments`,
      );

      return extractData<Comment[]>(response) ?? [];
    },
  });
}

export function useReportVotes(reportId?: number | string) {
  return useQuery({
    queryKey: ["reports", reportId, "votes"],
    enabled: Boolean(reportId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<Vote[]> | Vote[]>(
        `/reports/${reportId}/votes`,
      );

      return extractData<Vote[]>(response) ?? [];
    },
  });
}

export function useMapReports() {
  return useQuery({
    queryKey: ["map", "reports"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Report[]> | Report[]>(
        "/map/reports",
      );

      return extractData<Report[]>(response) ?? [];
    },
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await api.get<
        ApiResponse<LeaderboardItem[]> | LeaderboardItem[]
      >("/leaderboard");

      return extractData<LeaderboardItem[]>(response) ?? [];
    },
  });
}