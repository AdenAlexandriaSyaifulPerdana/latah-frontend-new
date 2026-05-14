"use client";

import Link from "next/link";
import { Bookmark, Loader2, MessageCircle, ThumbsUp } from "lucide-react";
import { type FormEvent, useState } from "react";

import { useAuth } from "../../hooks/use-auth";
import {
  useCreateBookmark,
  useCreateComment,
  useCreateVote,
} from "../../hooks/use-citizen-data";
import { ROUTES } from "../../lib/constants";

interface ReportInteractionPanelProps {
  reportId: number | string;
}

export function ReportInteractionPanel({ reportId }: ReportInteractionPanelProps) {
  const { user, isAuthenticated, isCitizen } = useAuth();

  const createCommentMutation = useCreateComment(reportId);
  const createVoteMutation = useCreateVote(reportId);
  const createBookmarkMutation = useCreateBookmark(user?.id);

  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const numericReportId = Number(reportId);

  const isSubmittingComment = createCommentMutation.isPending;
  const isSubmittingVote = createVoteMutation.isPending;
  const isSubmittingBookmark = createBookmarkMutation.isPending;

  function resetMessage() {
    if (message) setMessage("");
    if (errorMessage) setErrorMessage("");
  }

  async function handleVote() {
    if (!user?.id || !Number.isFinite(numericReportId)) {
      setErrorMessage("User atau laporan tidak valid.");
      return;
    }

    try {
      resetMessage();

      await createVoteMutation.mutateAsync({
        user_id: user.id,
        report_id: numericReportId,
      });

      setMessage("Upvote berhasil diberikan.");
    } catch (error) {
      const errorText =
        error instanceof Error
          ? error.message
          : "Gagal memberi upvote pada laporan.";

      setErrorMessage(errorText);
    }
  }

  async function handleBookmark() {
    if (!user?.id || !Number.isFinite(numericReportId)) {
      setErrorMessage("User atau laporan tidak valid.");
      return;
    }

    try {
      resetMessage();

      await createBookmarkMutation.mutateAsync({
        user_id: user.id,
        report_id: numericReportId,
      });

      setMessage("Laporan berhasil disimpan ke bookmark.");
    } catch (error) {
      const errorText =
        error instanceof Error
          ? error.message
          : "Gagal menyimpan laporan ke bookmark.";

      setErrorMessage(errorText);
    }
  }

  async function handleSubmitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user?.id || !Number.isFinite(numericReportId)) {
      setErrorMessage("User atau laporan tidak valid.");
      return;
    }

    if (!comment.trim()) {
      setErrorMessage("Komentar tidak boleh kosong.");
      return;
    }

    try {
      resetMessage();

      await createCommentMutation.mutateAsync({
        user_id: user.id,
        report_id: numericReportId,
        comment: comment.trim(),
      });

      setComment("");
      setMessage("Komentar berhasil dikirim.");
    } catch (error) {
      const errorText =
        error instanceof Error ? error.message : "Gagal mengirim komentar.";

      setErrorMessage(errorText);
    }
  }

  if (!isAuthenticated) {
    return (
      <section className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-2xl font-black text-[#0B2D4D]">
          Ikut berinteraksi
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          Masuk sebagai citizen untuk memberi upvote, menyimpan laporan, atau
          menulis komentar.
        </p>

        <Link
          href={ROUTES.login}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-[#D9543F] px-6 py-3 text-sm font-black text-white transition hover:bg-[#c24634]"
        >
          Masuk untuk Berinteraksi
        </Link>
      </section>
    );
  }

  if (!isCitizen) {
    return (
      <section className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-2xl font-black text-[#0B2D4D]">
          Mode Admin
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          Akun admin dapat memantau laporan. Interaksi publik seperti komentar,
          bookmark, dan upvote disediakan untuk role citizen.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#0B2D4D]">
            Interaksi Citizen
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
            Beri dukungan pada laporan yang penting, simpan laporan, atau
            tambahkan komentar untuk memperkuat konteks masalah.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleVote}
            disabled={isSubmittingVote}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B2D4D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#123C69] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmittingVote ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ThumbsUp className="h-4 w-4 text-[#F5C451]" />
            )}
            Upvote
          </button>

          <button
            type="button"
            onClick={handleBookmark}
            disabled={isSubmittingBookmark}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F5C451] px-5 py-3 text-sm font-black text-[#0B2D4D] transition hover:bg-[#ffd25d] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmittingBookmark ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            Bookmark
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmitComment} className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-black text-[#0B2D4D]">
            Tulis Komentar
          </label>

          <textarea
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
              resetMessage();
            }}
            rows={4}
            placeholder="Tambahkan informasi atau tanggapan terkait laporan ini..."
            className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-7 outline-none transition focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
          />
        </div>

        {message ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmittingComment}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D9543F] px-6 py-3 text-sm font-black text-white transition hover:bg-[#c24634] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmittingComment ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <MessageCircle className="h-4 w-4" />
              Kirim Komentar
            </>
          )}
        </button>
      </form>
    </section>
  );
}