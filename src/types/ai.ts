export interface AnalyzeTextRequest {
  title: string;
  description: string;
}

export interface AnalyzeTextResult {
  category: string;
  keywords: string[];
  urgency_level: string;
}

export interface CalculatePriorityRequest {
  title?: string;
  description?: string;
  urgency_level?: string;
  vote_count?: number;
  similar_reports_count?: number;
  [key: string]: unknown;
}

export interface PriorityResult {
  priority_score?: number;
  priority_level?: string;
  reasons?: string[];
  [key: string]: unknown;
}