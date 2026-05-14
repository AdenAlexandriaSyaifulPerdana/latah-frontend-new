import { ROUTES } from "../lib/constants";

export const publicNavLinks = [
  {
    label: "Beranda",
    href: ROUTES.home,
  },
  {
    label: "Laporan Publik",
    href: ROUTES.reports,
  },
  {
    label: "Peta Laporan",
    href: ROUTES.map,
  },
  {
    label: "Leaderboard",
    href: ROUTES.leaderboard,
  },
];

export const citizenNavLinks = [
  {
    label: "Dashboard",
    href: ROUTES.citizenDashboard,
  },
  {
    label: "Buat Laporan",
    href: ROUTES.citizenNewReport,
  },
  {
    label: "Laporan Saya",
    href: ROUTES.citizenMyReports,
  },
  {
    label: "Bookmark",
    href: ROUTES.citizenBookmarks,
  },
  {
    label: "Notifikasi",
    href: ROUTES.citizenNotifications,
  },
];

export const adminNavLinks = [
  {
    label: "Dashboard",
    href: ROUTES.adminDashboard,
  },
  {
    label: "Manajemen Laporan",
    href: ROUTES.adminReports,
  },
  {
    label: "Peta & Hotspot",
    href: ROUTES.adminMap,
  },
  {
    label: "Pengguna",
    href: ROUTES.adminUsers,
  },
  {
    label: "Analitik",
    href: ROUTES.adminAnalytics,
  },
];