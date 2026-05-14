import type { ReportStatus } from "../types/report";


export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "LATAH";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://latah-api.vercel.app/api";

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",

  reports: "/reports",
  map: "/map",
  leaderboard: "/leaderboard",

  citizenDashboard: "/citizen/dashboard",
  citizenNewReport: "/citizen/reports/new",
  citizenMyReports: "/citizen/my-reports",
  citizenBookmarks: "/citizen/bookmarks",
  citizenNotifications: "/citizen/notifications",
  citizenProfile: "/citizen/profile",

  adminDashboard: "/admin/dashboard",
  adminReports: "/admin/reports",
  adminMap: "/admin/map",
  adminUsers: "/admin/users",
  adminAnalytics: "/admin/analytics",
} as const;

export const STORAGE_KEYS = {
  token: "latah_token",
  user: "latah_user",
} as const;

export const REPORT_STATUS_META: Record<
  ReportStatus,
  {
    label: string;
    description: string;
    className: string;
  }
> = {
  pending: {
    label: "Pending",
    description: "Laporan baru",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  processing: {
    label: "Diproses",
    description: "Sedang ditangani",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  resolved: {
    label: "Selesai",
    description: "Laporan selesai",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Ditolak",
    description: "Laporan ditolak",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  verified: {
    label: "Terverifikasi",
    description: "Laporan sudah diverifikasi",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
};

export const DEFAULT_JEMBER_COORDINATE = {
  latitude: -8.1737,
  longitude: 113.7004,
};

export const THEME_COLORS = {
  navy: "#0B2D4D",
  deepBlue: "#123C69",
  coral: "#D9543F",
  warmYellow: "#F5C451",
  cream: "#FFF4D8",
  softWhite: "#FAFAF7",
  slate: "#334155",
} as const;

export function getStatusMeta(status?: string) {
  if (
    status === "pending" ||
    status === "processing" ||
    status === "resolved" ||
    status === "rejected" ||
    status === "verified"
  ) {
    return REPORT_STATUS_META[status];
  }

  return {
    label: status || "Tidak diketahui",
    description: "Status tidak tersedia",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  };
}