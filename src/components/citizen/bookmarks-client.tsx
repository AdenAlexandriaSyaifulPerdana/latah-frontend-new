"use client";

import Link from "next/link";
import { Bookmark, FileText } from "lucide-react";

import { EmptyState } from "../common/empty-state";
import { StatusBadge } from "../common/status-badge";
import { useAuth } from "../../hooks/use-auth";
import { useCitizenBookmarks } from "../../hooks/use-citizen-data";
import { formatDate } from "../../lib/utils";
import type { Bookmark as BookmarkType } from "../../types/citizen";
import type { Report } from "../../types/report";

function getBookmarkReport(bookmark: BookmarkType) {
  if (bookmark.report) return bookmark.report;
  if (bookmark.reports) return bookmark.reports;

  if ("title" in bookmark && "description" in bookmark) {
    return bookmark as unknown as Report;
  }

  return null;
}

export function BookmarksClient() {
  const { user } = useAuth();

  const {
    data: bookmarks = [],
    isLoading,
    isError,
    error,
  } = useCitizenBookmarks(user?.id);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[#0B2D4D] p-8 text-white">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#F5C451]">
          Bookmark
        </p>
        <h1 className="mt-3 font-serif text-4xl font-black leading-tight md:text-5xl">
          Laporan yang kamu simpan.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
          Simpan laporan penting agar lebih mudah dipantau kembali.
        </p>
      </section>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : null}

      {isError ? (
        <EmptyState
          icon={Bookmark}
          title="Gagal memuat bookmark"
          description={
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat mengambil bookmark."
          }
        />
      ) : null}

      {!isLoading && !isError && bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Belum ada bookmark"
          description="Bookmark laporan publik yang ingin kamu pantau kembali."
        />
      ) : null}

      {!isLoading && !isError && bookmarks.length > 0 ? (
        <section className="space-y-4">
          {bookmarks.map((bookmark, index) => {
            const report = getBookmarkReport(bookmark);
            const reportId = report?.id ?? bookmark.report_id;

            return (
              <article
                key={`${bookmark.id ?? reportId ?? index}`}
                className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:border-[#F5C451]"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      {report?.status ? <StatusBadge status={report.status} /> : null}
                      <span className="rounded-full bg-[#FFF4D8] px-3 py-1 text-xs font-bold text-[#D9543F]">
                        Bookmark
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-[#0B2D4D]">
                      {report?.title || `Laporan #${reportId || "-"}`}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {report?.description ||
                        "Detail laporan akan tampil jika data report tersedia dari API bookmark."}
                    </p>

                    <p className="mt-3 text-xs font-semibold text-slate-400">
                      Disimpan: {formatDate(bookmark.created_at)}
                    </p>
                  </div>

                  {reportId ? (
                    <Link
                      href={`/reports/${reportId}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B2D4D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#123C69]"
                    >
                      <FileText className="h-4 w-4" />
                      Detail
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}