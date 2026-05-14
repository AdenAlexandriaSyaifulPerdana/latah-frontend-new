export type UserRole = "citizen" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}