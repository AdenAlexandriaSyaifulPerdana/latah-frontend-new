"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "../lib/api";
import type { ApiResponse } from "../types/api";
import type { Bookmark, Notification, UploadImageResult } from "../types/citizen";
import type { Comment, Vote } from "../types/interaction";
import type { Report } from "../types/report";
import type { UserAnalytics } from "../types/dashboard";

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

function belongsToUser(report: Report, userId: number) {
  return report.user_id === userId || report.user?.id === userId;
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
    queryKey: ["citizen", "reports", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<Report[]> | Report[]>("/reports", {
        auth: true,
      });

      const reports = extractData<Report[]>(response) ?? [];
      return reports.filter((report) => belongsToUser(report, Number(userId)));
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
            user_id: userId,
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
      queryClient.invalidateQueries({ queryKey: ["reports", reportId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
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
      queryClient.invalidateQueries({ queryKey: ["reports", reportId, "votes"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
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
      queryClient.invalidateQueries({ queryKey: ["citizen", "bookmarks", userId] });
    },
  });
}