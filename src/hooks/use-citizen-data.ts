"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "../lib/api";
import type { ApiResponse } from "../types/api";
import type { Bookmark, Notification, UploadImageResult } from "../types/citizen";
import type { UserAnalytics } from "../types/dashboard";
import type { Comment, Vote } from "../types/interaction";
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

function normalizeReports(response: unknown): Report[] {
  const extracted = extractData<unknown>(response as ApiResponse<unknown>);

  if (Array.isArray(extracted)) {
    return extracted as Report[];
  }

  if (typeof extracted === "object" && extracted !== null) {
    const objectData = extracted as Record<string, unknown>;

    if (Array.isArray(objectData.data)) {
      return objectData.data as Report[];
    }

    if (Array.isArray(objectData.reports)) {
      return objectData.reports as Report[];
    }

    if (Array.isArray(objectData.items)) {
      return objectData.items as Report[];
    }

    if (Array.isArray(objectData.rows)) {
      return objectData.rows as Report[];
    }

    if (Array.isArray(objectData.result)) {
      return objectData.result as Report[];
    }
  }

  return [];
}

function toSafeNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function getNestedId(value: unknown) {
  if (typeof value !== "object" || value === null) return null;

  const objectValue = value as Record<string, unknown>;

  if ("id" in objectValue) {
    return toSafeNumber(objectValue.id);
  }

  if ("user_id" in objectValue) {
    return toSafeNumber(objectValue.user_id);
  }

  return null;
}

function getReportOwnerId(report: Report) {
  const reportRecord = report as Record<string, unknown>;

  const directFields = [
    "user_id",
    "userId",
    "created_by",
    "createdBy",
    "reporter_id",
    "reporterId",
    "citizen_id",
    "citizenId",
    "author_id",
    "authorId",
  ];

  for (const field of directFields) {
    const value = reportRecord[field];

    const directId = toSafeNumber(value);

    if (directId !== null) {
      return directId;
    }

    const nestedId = getNestedId(value);

    if (nestedId !== null) {
      return nestedId;
    }
  }

  const nestedFields = [
    "user",
    "users",
    "citizen",
    "reporter",
    "author",
    "creator",
  ];

  for (const field of nestedFields) {
    const nestedId = getNestedId(reportRecord[field]);

    if (nestedId !== null) {
      return nestedId;
    }
  }

  return null;
}

function sortReportsByNewest(reports: Report[]) {
  return [...reports].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

    if (dateA !== dateB) {
      return dateB - dateA;
    }

    return Number(b.id) - Number(a.id);
  });
}

export function useCitizenAnalytics(userId?: number) {
  return useQuery({
    queryKey: ["citizen", "analytics", userId],
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

export function useCitizenReports(userId?: number) {
  return useQuery({
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    queryKey: ["citizen", "reports", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const currentUserId = Number(userId);

      const response = await api.get<ApiResponse<Report[]> | Report[]>("/reports", {
        auth: true,
      });

      const reports = normalizeReports(response);

      const myReports = reports.filter((report) => {
        const ownerId = getReportOwnerId(report);
        return ownerId === currentUserId;
      });

      console.log("USER LOGIN ID:", currentUserId);
      console.log("REPORTS FROM BACKEND:", reports);
      console.log("MY REPORTS FROM BACKEND:", myReports);

      return sortReportsByNewest(myReports);
    },
  });
}

export function useUploadReportImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return api.post<ApiResponse<UploadImageResult> | UploadImageResult>(
        "/uploads/report-image",
        formData,
        {
          auth: true,
        },
      );
    },
  });
}

export function useCitizenBookmarks(userId?: number) {
  return useQuery({
    queryKey: ["citizen", "bookmarks", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<Bookmark[]> | Bookmark[]>(
        "/bookmarks",
        {
          auth: true,
          params: {
            user_id: Number(userId),
          },
        },
      );

      return extractData<Bookmark[]>(response) ?? [];
    },
  });
}

  export function useCitizenNotifications(userId?: number) {
    return useQuery({
      queryKey: ["citizen", "notifications", userId],
      enabled: Boolean(userId),
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: 10000,
      queryFn: async () => {
        const response = await api.get<ApiResponse<Notification[]> | Notification[]>(
          "/notifications",
          {
            auth: true,
            params: {
              user_id: userId,
            },
          },
        );

        return extractData<Notification[]>(response) ?? [];
      },
    });
  }

export function useCreateComment(reportId?: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      user_id: number;
      report_id: number;
      comment: string;
    }) => {
      return api.post<ApiResponse<Comment> | Comment>("/comments", payload, {
        auth: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reports", reportId, "comments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reports", reportId],
      });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["citizen", "reports"] });
    },
  });
}

export function useCreateVote(reportId?: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { user_id: number; report_id: number }) => {
      return api.post<ApiResponse<Vote> | Vote>("/votes", payload, {
        auth: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reports", reportId, "votes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reports", reportId],
      });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["citizen", "reports"] });
    },
  });
}

export function useCreateBookmark(userId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { user_id: number; report_id: number }) => {
      return api.post<ApiResponse<Bookmark> | Bookmark>("/bookmarks", payload, {
        auth: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["citizen", "bookmarks", userId],
      });
    },
  });
}