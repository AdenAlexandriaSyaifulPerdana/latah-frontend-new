import type { User } from "./user";

export interface InteractionUser {
  id: number;
  name: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export interface Comment {
  id: number;
  user_id?: number;
  report_id?: number;
  comment: string;
  user?: User;
  users?: InteractionUser;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface Vote {
  id: number;
  user_id?: number;
  report_id?: number;
  vote_type?: string;
  user?: User;
  users?: InteractionUser;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface LeaderboardItem {
  id?: number;
  user_id?: number;
  name?: string;
  user_name?: string;
  email?: string;
  total_points?: number;
  points?: number;
  score?: number;
  total_reports?: number;
  reports_count?: number;
  total_comments?: number;
  comments_count?: number;
  total_votes?: number;
  votes_count?: number;
  rank?: number;
  [key: string]: unknown;
}