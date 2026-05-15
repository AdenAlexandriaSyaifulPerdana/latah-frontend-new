"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "../lib/api";
import type { ApiResponse } from "../types/api";
import type { Report, ReportStatus } from "../types/report";

interface AdminReportParams {
  status?: string;
  category?: string;
  search?: string;
}

interface UpdateReportStatusPayload {
  reportId: number | string;
  status: ReportStatus | string;
}

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

function normalizeReports(response: unknown): Report[] {
  const extracted = extractData<unknown>(response as ApiResponse<unknown>);

  if (Array.isArray(extracted)) {
    return extracted as Report[];
  }

  if (typeof extracted === "object" && extracted !== null) {
    const objectData = extracted as Record<string, unknown>;

    if (Array.isArray(objectData.data)) return objectData.data as Report[];
    if (Array.isArray(objectData.reports)) return objectData.reports as Report[];
    if (Array.isArray(objectData.items)) return objectData.items as Report[];
    if (Array.isArray(objectData.rows)) return objectData.rows as Report[];
  }

  return [];
}

export function useAdminReports(params?: AdminReportParams) {
  return useQuery({
    queryKey: ["admin", "reports", params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Report[]> | Report[]>("/reports", {
        auth: true,
        params: {
          status: params?.status,
          category: params?.category,
          search: params?.search,
        },
      });

      return normalizeReports(response);
    },
  });
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, status }: UpdateReportStatusPayload) => {
      return api.patch<ApiResponse<Report> | Report>(
        `/reports/${reportId}`,
        {
          status,
        },
        {
          auth: true,
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}