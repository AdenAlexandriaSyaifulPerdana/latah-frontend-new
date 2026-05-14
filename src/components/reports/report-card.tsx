import Link from "next/link";
import { CalendarDays, MapPin, MessageCircle, ThumbsUp } from "lucide-react";

import { StatusBadge } from "../../components/common/status-badge";
import { formatDate, truncateText } from "../../lib/utils";
import type { Report } from "../../types/report";

interface ReportCardProps {
  report: Report;
  href?: string;
}

function getCategoryName(category: Report["category"]) {
  if (!category) return "Umum";
  if (typeof category === "string") return category;
  return category.name;
}

export function ReportCard({ report, href }: ReportCardProps) {
  const detailHref = href ?? `/reports/${report.id}`;
  const voteCount = report.vote_count ?? report.votes_count ?? 0;
  const commentCount = report.comment_count ?? report.comments_count ?? 0;

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={detailHref} className="block">
        <div className="relative h-44 bg-slate-100">
          {report.image_url || report.photo_url ? (
            <img
              src={report.image_url || report.photo_url}
              alt={report.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B2D4D] to-[#123C69] text-white">
              <MapPin className="h-10 w-10 text-[#F5C451]" />
            </div>
          )}

          <div className="absolute left-4 top-4">
            <StatusBadge status={report.status} />
          </div>
        </div>

        <div className="p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#FFF4D8] px-3 py-1 text-xs font-bold text-[#D9543F]">
              {getCategoryName(report.category)}
            </span>

            {report.urgency_level ? (
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                {String(report.urgency_level)}
              </span>
            ) : null}
          </div>

          <h3 className="line-clamp-2 text-lg font-black text-[#0B2D4D]">
            {report.title}
          </h3>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
            {truncateText(report.description, 120)}
          </p>

          <div className="mt-5 space-y-2 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#D9543F]" />
              <span className="line-clamp-1">
                {report.location_name || report.address_detail || "Lokasi belum tersedia"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#D9543F]" />
              <span>{formatDate(report.created_at)}</span>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <ThumbsUp className="h-4 w-4" />
              {voteCount}
            </div>

            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" />
              {commentCount}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}