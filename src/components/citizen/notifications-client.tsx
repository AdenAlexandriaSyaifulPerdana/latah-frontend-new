"use client";

import {
  Bell,
  CheckCircle2,
  Clock,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { EmptyState } from "../common/empty-state";
import { useAuth } from "../../hooks/use-auth";
import { formatDateTime } from "../../lib/utils";
import type { Notification } from "../../types/citizen";
import { useEffect } from "react";
import {
  useCitizenNotifications,
  useMarkNotificationsRead,
} from "../../hooks/use-citizen-data";

type NotificationStatus =
  | "pending"
  | "verified"
  | "processing"
  | "resolved"
  | "rejected";

interface StatusMeta {
  label: string;
  icon: LucideIcon;
  wrapperClassName: string;
  iconClassName: string;
  badgeClassName: string;
}

function getNotificationStatus(notification: Notification): NotificationStatus {
  const rawStatus = String(notification.report_status || "").toLowerCase();

  if (
    rawStatus === "pending" ||
    rawStatus === "verified" ||
    rawStatus === "processing" ||
    rawStatus === "resolved" ||
    rawStatus === "rejected"
  ) {
    return rawStatus;
  }

  const message = `${notification.title || ""} ${notification.message || ""}`.toLowerCase();

  if (message.includes("terverifikasi") || message.includes("verified")) {
    return "verified";
  }

  if (message.includes("diproses") || message.includes("processing")) {
    return "processing";
  }

  if (message.includes("selesai") || message.includes("resolved")) {
    return "resolved";
  }

  if (message.includes("ditolak") || message.includes("rejected")) {
    return "rejected";
  }

  return "pending";
}

function getStatusMeta(status: NotificationStatus): StatusMeta {
  const meta: Record<NotificationStatus, StatusMeta> = {
    pending: {
      label: "Pending",
      icon: Clock,
      wrapperClassName: "border-amber-100 bg-amber-50",
      iconClassName: "bg-amber-100 text-amber-700",
      badgeClassName: "bg-amber-100 text-amber-700",
    },
    verified: {
      label: "Terverifikasi",
      icon: ShieldCheck,
      wrapperClassName: "border-purple-100 bg-purple-50",
      iconClassName: "bg-purple-100 text-purple-700",
      badgeClassName: "bg-purple-100 text-purple-700",
    },
    processing: {
      label: "Diproses",
      icon: Loader2,
      wrapperClassName: "border-blue-100 bg-blue-50",
      iconClassName: "bg-blue-100 text-blue-700",
      badgeClassName: "bg-blue-100 text-blue-700",
    },
    resolved: {
      label: "Selesai",
      icon: CheckCircle2,
      wrapperClassName: "border-emerald-100 bg-emerald-50",
      iconClassName: "bg-emerald-100 text-emerald-700",
      badgeClassName: "bg-emerald-100 text-emerald-700",
    },
    rejected: {
      label: "Ditolak",
      icon: XCircle,
      wrapperClassName: "border-red-100 bg-red-50",
      iconClassName: "bg-red-100 text-red-700",
      badgeClassName: "bg-red-100 text-red-700",
    },
  };

  return meta[status];
}

export function NotificationsClient() {
  const { user } = useAuth();

  const {
    data: notifications = [],
    isLoading,
    isError,
    error,
  } = useCitizenNotifications(user?.id);

  const markNotificationsReadMutation = useMarkNotificationsRead(user?.id);

  useEffect(() => {
    const hasUnreadNotifications = notifications.some(
      (notification) => notification.is_read === false,
    );

    if (
      user?.id &&
      notifications.length > 0 &&
      hasUnreadNotifications &&
      !markNotificationsReadMutation.isPending
    ) {
      markNotificationsReadMutation.mutate();
    }
  }, [user?.id, notifications, markNotificationsReadMutation]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[#0B2D4D] p-8 text-white">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#F5C451]">
          Notifikasi
        </p>
        <h1 className="mt-3 font-serif text-4xl font-black leading-tight md:text-5xl">
          Update laporanmu.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
          Lihat pemberitahuan terbaru terkait perubahan status laporan dan
          aktivitas penting di LATAH.
        </p>
      </section>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : null}

      {isError ? (
        <EmptyState
          icon={Bell}
          title="Gagal memuat notifikasi"
          description={
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat mengambil notifikasi."
          }
        />
      ) : null}

      {!isLoading && !isError && notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Belum ada notifikasi"
          description="Update status laporan dan aktivitas penting akan muncul di sini."
        />
      ) : null}

      {!isLoading && !isError && notifications.length > 0 ? (
        <section className="space-y-4">
          {notifications.map((notification) => {
            const status = getNotificationStatus(notification);
            const meta = getStatusMeta(status);
            const Icon = meta.icon;

            return (
              <article
                key={notification.id}
                className={[
                  "relative rounded-[1.5rem] border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                  meta.wrapperClassName,
                ].join(" ")}
              >

                <div className="flex gap-4">
                  <div
                    className={[
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                      meta.iconClassName,
                    ].join(" ")}
                  >
                    <Icon
                      className={[
                        "h-6 w-6",
                        status === "processing" ? "animate-spin" : "",
                      ].join(" ")}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span
                            className={[
                              "rounded-full px-3 py-1 text-xs font-black",
                              meta.badgeClassName,
                            ].join(" ")}
                          >
                            {meta.label}
                          </span>

                          {notification.report_id ? (
                            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-slate-500">
                              Laporan #{notification.report_id}
                            </span>
                          ) : null}
                        </div>

                        <h2 className="font-black text-[#0B2D4D]">
                          {notification.title || "Notifikasi LATAH"}
                        </h2>
                      </div>

                      <span className="text-xs font-semibold text-slate-500">
                        {formatDateTime(notification.created_at)}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {notification.message ||
                        notification.content ||
                        "Ada pembaruan aktivitas pada akun LATAH kamu."}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}