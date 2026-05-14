"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  MapPin,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";

import { EmptyState } from "../common/empty-state";
import { StatusBadge } from "../common/status-badge";
import { useReportDetail } from "../../hooks/use-reports";
import { useReportComments, useReportVotes } from "../../hooks/use-public-data";
import { ROUTES } from "../../lib/constants";
import { formatDateTime, getInitials, toNumber } from "../../lib/utils";
import type { Comment, Vote } from "../../types/interaction";
import type { Report } from "../../types/report";
import { ReportInteractionPanel } from "./report-interaction-panel";

function getCategoryName(report: Report) {
  if (report.report_categories?.name) {
    return report.report_categories.name;
  }

  if (!report.category) {
    return "Umum";
  }

  if (typeof report.category === "string") {
    return report.category;
  }

  return report.category.name;
}

function getImageUrl(report: Report) {
  if (report.image_url) return report.image_url;
  if (report.photo_url) return report.photo_url;

  const firstImage = report.report_images?.[0];

  if (firstImage?.image_url) {
    return firstImage.image_url;
  }

  return "";
}

function getReportComments(report: Report): Comment[] {
  const reportRecord = report as Record<string, unknown>;
  const comments = reportRecord.comments;

  if (Array.isArray(comments)) {
    return comments as Comment[];
  }

  return [];
}

function getReportVotes(report: Report): Vote[] {
  const reportRecord = report as Record<string, unknown>;
  const votes = reportRecord.votes;

  if (Array.isArray(votes)) {
    return votes as Vote[];
  }

  return [];
}

function getCommentUserName(comment: Comment) {
  return comment.user?.name || comment.users?.name || "Warga";
}

export function ReportDetailClient() {
  const params = useParams();
  const rawId = params?.id;
  const reportId = Array.isArray(rawId) ? rawId[0] : rawId;

  const {
    data: report,
    isLoading,
    isError,
    error,
  } = useReportDetail(reportId);

  const { data: commentsFromEndpoint = [] } = useReportComments(reportId);
  const { data: votesFromEndpoint = [] } = useReportVotes(reportId);

  if (isLoading) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="h-[620px] animate-pulse rounded-[2rem] bg-white" />
        <div className="h-[420px] animate-pulse rounded-[2rem] bg-white" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <EmptyState
        icon={FileText}
        title="Laporan tidak ditemukan"
        description={
          error instanceof Error
            ? error.message
            : "Data laporan tidak tersedia atau gagal dimuat."
        }
        action={
          <Link
            href={ROUTES.reports}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B2D4D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#123C69]"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Laporan
          </Link>
        }
      />
    );
  }

  const latitude = toNumber(report.latitude, 0);
  const longitude = toNumber(report.longitude, 0);
  const imageUrl = getImageUrl(report);

  const commentsFromDetail = getReportComments(report);
  const votesFromDetail = getReportVotes(report);

  const comments =
    commentsFromEndpoint.length > 0 ? commentsFromEndpoint : commentsFromDetail;

  const votes = votesFromEndpoint.length > 0 ? votesFromEndpoint : votesFromDetail;

  const voteCount = report.vote_count ?? report.votes_count ?? votes.length;
  const commentCount =
    report.comment_count ?? report.comments_count ?? comments.length;

  return (
    <div className="space-y-8">
      <Link
        href={ROUTES.reports}
        className="inline-flex items-center gap-2 text-sm font-black text-[#0B2D4D] transition hover:text-[#D9543F]"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke laporan publik
      </Link>

      <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <article className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
          <div className="relative h-72 bg-slate-100 md:h-[420px]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={report.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B2D4D] to-[#123C69] text-white">
                <MapPin className="h-16 w-16 text-[#F5C451]" />
              </div>
            )}

            <div className="absolute left-5 top-5">
              <StatusBadge status={report.status} />
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#FFF4D8] px-3 py-1 text-xs font-bold text-[#D9543F]">
                {getCategoryName(report)}
              </span>

              {report.urgency_level ? (
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                  Urgensi: {String(report.urgency_level)}
                </span>
              ) : null}

              {typeof report.priority_score === "number" ? (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  Prioritas: {report.priority_score}
                </span>
              ) : null}
            </div>

            <h1 className="font-serif text-4xl font-black leading-tight text-[#0B2D4D] md:text-5xl">
              {report.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#D9543F]" />
                {formatDateTime(report.created_at)}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#D9543F]" />
                {report.location_name || "Lokasi belum tersedia"}
              </div>
            </div>

            <p className="mt-8 whitespace-pre-line text-base leading-8 text-slate-600">
              {report.description}
            </p>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-[#0B2D4D]">
              Ringkasan Laporan
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-semibold text-slate-500">
                  Status
                </span>
                <StatusBadge status={report.status} />
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-semibold text-slate-500">
                  Dukungan
                </span>
                <span className="flex items-center gap-2 text-sm font-black text-[#0B2D4D]">
                  <ThumbsUp className="h-4 w-4 text-[#D9543F]" />
                  {voteCount}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-semibold text-slate-500">
                  Komentar
                </span>
                <span className="flex items-center gap-2 text-sm font-black text-[#0B2D4D]">
                  <MessageCircle className="h-4 w-4 text-[#D9543F]" />
                  {commentCount}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#0B2D4D] p-6 text-white shadow-sm">
            <h2 className="text-xl font-black">Lokasi Laporan</h2>

            <div className="mt-5 rounded-[1.5rem] bg-white/10 p-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-[#F5C451]" />
                <div>
                  <p className="font-bold">
                    {report.location_name || "Lokasi belum tersedia"}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/65">
                    {report.address_detail || "Detail alamat belum tersedia."}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-white/55">Latitude</p>
                  <p className="mt-1 font-black">{latitude || "-"}</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-white/55">Longitude</p>
                  <p className="mt-1 font-black">{longitude || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <ReportInteractionPanel reportId={report.id} />

      <section className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-2xl font-black text-[#0B2D4D]">Komentar Warga</h2>
        <p className="mt-2 text-sm text-slate-500">
          Komentar publik membantu memperkuat konteks laporan dan menunjukkan
          partisipasi masyarakat.
        </p>

        <div className="mt-6 space-y-4">
          {comments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
              Belum ada komentar pada laporan ini.
            </div>
          ) : (
            comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF4D8] text-sm font-black text-[#D9543F]">
                    {getInitials(getCommentUserName(comment))}
                  </div>

                  <div>
                    <p className="text-sm font-black text-[#0B2D4D]">
                      {getCommentUserName(comment)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDateTime(comment.created_at)}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {comment.comment}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}