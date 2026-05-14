import type { User } from "./user";

export type ReportStatus =
  | "pending"
  | "processing"
  | "resolved"
  | "rejected"
  | "verified";

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

export interface ReportImage {
  id: number;
  image_url: string;
  report_id?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ReportUser {
  id: number;
  name: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export interface Report {
  id: number;

  user_id?: number | string;
  userId?: number | string;
  category_id?: number | string;

  title: string;
  description: string;

  location_name?: string;
  address_detail?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;

  status?: ReportStatus | string;
  urgency_level?: UrgencyLevel;
  priority_score?: number;

  image_url?: string;
  photo_url?: string;

  user?: User;
  users?: ReportUser;

  category?: Category | string;
  report_categories?: Category;

  report_images?: ReportImage[];

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