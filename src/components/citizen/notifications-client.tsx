"use client";

import { Bell, CheckCircle2, Clock } from "lucide-react";

import { EmptyState } from "../common/empty-state";
import { useAuth } from "../../hooks/use-auth";
import { useCitizenNotifications } from "../../hooks/use-citizen-data";
import { formatDateTime } from "../../lib/utils";

export function NotificationsClient() {
  const { user } = useAuth();
  const { data: notifications = [], isLoading, isError, error } =
    useCitizenNotifications(user?.id);

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
          Lihat pemberitahuan terbaru terkait laporan dan aktivitas di LATAH.
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
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className="flex gap-4 rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF4D8] text-[#D9543F]">
                {notification.is_read ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <Clock className="h-6 w-6" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h2 className="font-black text-[#0B2D4D]">
                    {notification.title || notification.type || "Notifikasi LATAH"}
                  </h2>

                  <span className="text-xs font-semibold text-slate-400">
                    {formatDateTime(notification.created_at)}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-7 text-slate-500">
                  {notification.message ||
                    notification.content ||
                    "Ada pembaruan aktivitas pada akun LATAH kamu."}
                </p>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}