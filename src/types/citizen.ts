import type { Report } from "./report";

export interface Bookmark {
  id?: number;
  user_id?: number;
  report_id?: number;
  report?: Report;
  reports?: Report;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: number;
  user_id?: number;
  report_id?: number;
  report_status?: string;
  title?: string;
  message?: string;
  content?: string;
  is_read?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface UploadImageResult {
  url?: string;
  image_url?: string;
  public_url?: string;
  path?: string;
  filename?: string;
  [key: string]: unknown;
}