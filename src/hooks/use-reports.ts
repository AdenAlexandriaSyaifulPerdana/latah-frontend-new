"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "../lib/api";
import type { AnalyzeTextRequest, AnalyzeTextResult } from "../types/ai";
import type { ApiResponse } from "../types/api";
import type { Category, CreateReportRequest, Report } from "../types/report";

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

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Report[]> | Report[]>("/reports");
      return extractData<Report[]>(response) ?? [];
    },
  });
}

export function useReportDetail(reportId?: number | string) {
  return useQuery({
    queryKey: ["reports", reportId],
    enabled: Boolean(reportId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<Report> | Report>(`/reports/${reportId}`);
      return extractData<Report>(response);
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Category[]> | Category[]>("/categories");
      return extractData<Category[]>(response) ?? [];
    },
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateReportRequest) => {
      return api.post<ApiResponse<Report> | Report>("/reports", payload, {
        auth: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useAnalyzeText() {
  return useMutation({
    mutationFn: async (payload: AnalyzeTextRequest) => {
      const response = await api.post<ApiResponse<AnalyzeTextResult>>(
        "/ai/analyze-text",
        payload,
        {
          auth: true,
        },
      );

      return extractData<AnalyzeTextResult>(response);
    },
  });
}