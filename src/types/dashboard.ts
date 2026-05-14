import type { Report } from "../types/report";

export interface DashboardStats {
  total_reports: number;
  pending_reports: number;
  processing_reports: number;
  resolved_reports: number;
  total_users: number;
}

export interface TopCategory {
  category_id?: number;
  category_name?: string;
  name?: string;
  total?: number;
  count?: number;
  [key: string]: unknown;
}

export interface HotspotArea {
  location_name?: string;
  area?: string;
  total_reports?: number;
  count?: number;
  latitude?: number | string | null;
  longitude?: number | string | null;
  [key: string]: unknown;
}

export interface UserAnalytics {
  total_reports: number;
  total_comments: number;
  total_votes: number;
}

export type RecentReport = Report;