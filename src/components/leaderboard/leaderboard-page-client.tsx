"use client";

import { Medal, Trophy, UserCircle } from "lucide-react";

import { EmptyState } from "../common/empty-state";
import { useLeaderboard } from "../../hooks/use-public-data";
import { getInitials } from "../../lib/utils";
import type { LeaderboardItem } from "../../types/interaction";

function getName(item: LeaderboardItem) {
  return item.name || item.user_name || "Warga LATAH";
}

function getPoints(item: LeaderboardItem) {
  return item.total_points ?? item.points ?? item.score ?? 0;
}

function getReports(item: LeaderboardItem) {
  return item.total_reports ?? item.reports_count ?? 0;
}

function getComments(item: LeaderboardItem) {
  return item.total_comments ?? item.comments_count ?? 0;
}

function getVotes(item: LeaderboardItem) {
  return item.total_votes ?? item.votes_count ?? 0;
}

function getRankStyle(index: number) {
  if (index === 0) return "bg-[#F5C451] text-[#0B2D4D]";
  if (index === 1) return "bg-slate-200 text-slate-700";
  if (index === 2) return "bg-orange-100 text-orange-700";
  return "bg-slate-100 text-slate-600";
}

export function LeaderboardPageClient() {
  const { data: leaderboard = [], isLoading, isError, error } = useLeaderboard();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-[1.5rem] bg-white"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={Trophy}
        title="Gagal memuat leaderboard"
        description={
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data leaderboard."
        }
      />
    );
  }

  if (leaderboard.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="Leaderboard belum tersedia"
        description="Belum ada data kontribusi warga yang dapat ditampilkan."
      />
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="space-y-8">
      <section className="grid gap-5 md:grid-cols-3">
        {topThree.map((item, index) => (
          <article
            key={`${item.id ?? item.user_id ?? index}-${getName(item)}`}
            className={[
              "rounded-[2rem] p-6 shadow-sm",
              index === 0
                ? "bg-[#0B2D4D] text-white md:-mt-4"
                : "bg-white text-[#0B2D4D]",
            ].join(" ")}
          >
            <div
              className={[
                "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl",
                getRankStyle(index),
              ].join(" ")}
            >
              <Medal className="h-7 w-7" />
            </div>

            <p className="text-sm font-black opacity-70">Peringkat #{index + 1}</p>
            <h2 className="mt-2 text-2xl font-black">{getName(item)}</h2>

            <p
              className={[
                "mt-4 text-4xl font-black",
                index === 0 ? "text-[#F5C451]" : "text-[#D9543F]",
              ].join(" ")}
            >
              {getPoints(item)}
            </p>
            <p className="text-sm font-semibold opacity-70">poin kontribusi</p>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs font-bold">
              <div className="rounded-2xl bg-black/5 p-3">
                <p className="text-lg">{getReports(item)}</p>
                <p className="opacity-60">Laporan</p>
              </div>

              <div className="rounded-2xl bg-black/5 p-3">
                <p className="text-lg">{getComments(item)}</p>
                <p className="opacity-60">Komentar</p>
              </div>

              <div className="rounded-2xl bg-black/5 p-3">
                <p className="text-lg">{getVotes(item)}</p>
                <p className="opacity-60">Vote</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4D8] text-[#D9543F]">
            <Trophy className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0B2D4D]">
              Daftar Kontribusi Warga
            </h2>
            <p className="text-sm text-slate-500">
              Peringkat berdasarkan kontribusi laporan, komentar, dan dukungan.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {rest.map((item, index) => {
            const rank = index + 4;

            return (
              <article
                key={`${item.id ?? item.user_id ?? rank}-${getName(item)}`}
                className="grid gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-[#F5C451] md:grid-cols-[70px_1fr_140px_140px]"
              >
                <div className="flex items-center gap-3 md:justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-sm font-black text-slate-600">
                    #{rank}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF4D8] text-sm font-black text-[#D9543F]">
                    {getInitials(getName(item))}
                  </div>

                  <div>
                    <p className="font-black text-[#0B2D4D]">{getName(item)}</p>
                    <p className="text-xs text-slate-500">
                      {item.email || "Citizen LATAH"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                  <p className="font-black text-[#0B2D4D]">{getPoints(item)}</p>
                  <p className="text-xs text-slate-500">Poin</p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                  <p className="font-black text-[#0B2D4D]">{getReports(item)}</p>
                  <p className="text-xs text-slate-500">Laporan</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}