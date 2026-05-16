import {
  Bell,
  Bookmark,
  ChartColumn,
  FileText,
  Home,
  LayoutDashboard,
  ListChecks,
  MapPinned,
  PlusCircle,
  Trophy,
  UserCircle,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ROUTES } from "../lib/constants";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export const publicNavLinks: NavItem[] = [
  {
    label: "Beranda",
    href: ROUTES.home,
    icon: Home,
  },
  {
    label: "Laporan Publik",
    href: ROUTES.reports,
    icon: FileText,
  },
  {
    label: "Peta Laporan",
    href: ROUTES.map,
    icon: MapPinned,
  },
  {
    label: "Leaderboard",
    href: ROUTES.leaderboard,
    icon: Trophy,
  },
];

export const citizenNavLinks: NavItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.citizenDashboard,
    icon: LayoutDashboard,
  },
  {
    label: "Buat Laporan",
    href: ROUTES.citizenNewReport,
    icon: PlusCircle,
  },
  {
    label: "Laporan Saya",
    href: ROUTES.citizenMyReports,
    icon: ListChecks,
  },
  {
    label: "Bookmark",
    href: ROUTES.citizenBookmarks,
    icon: Bookmark,
  },
  {
    label: "Notifikasi",
    href: ROUTES.citizenNotifications,
    icon: Bell,
  },
  {
    label: "Profil",
    href: ROUTES.citizenProfile,
    icon: UserCircle,
  },
];

export const adminNavLinks: NavItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.adminDashboard,
    icon: LayoutDashboard,
  },
  {
    label: "Manajemen Laporan",
    href: ROUTES.adminReports,
    icon: FileText,
  },
  {
    label: "Peta & Hotspot",
    href: ROUTES.adminMap,
    icon: MapPinned,
  },
  {
    label: "Pengguna",
    href: ROUTES.adminUsers,
    icon: Users,
  },
  {
    label: "Analitik",
    href: ROUTES.adminAnalytics,
    icon: ChartColumn,
  },
  {
    label: "Profil",
    href: ROUTES.adminProfile,
    icon: UserCircle,
  },
];