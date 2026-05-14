import type { User } from "../types/user";

export type ReportStatus = "pending" | "processing" | "resolved" | "rejected";

export type UrgencyLevel = "low" | "medium" | "high" | "critical" | string;

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface Report {
  id: number;
  user_id?: number;
  category_id?: number;

  title: string;
  description: string;

  location_name?: string;
  address_detail?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;

  status?: ReportStatus;
  urgency_level?: UrgencyLevel;
  priority_score?: number;

  image_url?: string;
  photo_url?: string;

  category?: Category | string;
  user?: User;

  vote_count?: number;
  votes_count?: number;
  comment_count?: number;
  comments_count?: number;

  created_at?: string;
  updated_at?: string;

  [key: string]: unknown;
}

export interface CreateReportRequest {
  user_id: number;
  category_id: number;
  title: string;
  description: string;
  location_name: string;
  address_detail: string;
  latitude: number;
  longitude: number;
  image_url?: string;
}

export interface UpdateReportStatusRequest {
  new_status: ReportStatus;
  changed_by: number;
  notes: string;
}