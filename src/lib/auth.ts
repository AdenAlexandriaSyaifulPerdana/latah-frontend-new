import { api } from "../lib/api";
import { ROUTES } from "../lib/constants";
import { authStorage } from "../lib/storage";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth";
import type { ApiResponse } from "../types/api";
import type { User, UserRole } from "../types/user";

export const authService = {
  login(payload: LoginRequest) {
    return api.post<LoginResponse>("/auth/login", payload);
  },

  register(payload: RegisterRequest) {
    return api.post<RegisterResponse>("/auth/register", payload);
  },

  me() {
    return api.get<ApiResponse<User>>("/auth/me", {
      auth: true,
    });
  },

  logout() {
    authStorage.clear();
  },

  getDashboardPath(role: UserRole) {
    if (role === "admin") return ROUTES.adminDashboard;
    return ROUTES.citizenDashboard;
  },
};