"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useEffect } from "react";

interface GlobalErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function GlobalErrorPage({
  error,
  reset,
}: GlobalErrorPageProps) {
  useEffect(() => {
    console.error("GLOBAL ERROR:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-6">
      <section className="w-full max-w-lg rounded-[2rem] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-[#D9543F]">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h1 className="mt-6 text-3xl font-black text-[#0B2D4D]">
          Terjadi kesalahan
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          Sistem gagal memuat halaman ini. Coba muat ulang halaman atau kembali
          beberapa saat lagi.
        </p>

        {error.message ? (
          <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-700">
            {error.message}
          </div>
        ) : null}

        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#D9543F] px-6 py-3 text-sm font-black text-white transition hover:bg-[#c24634]"
        >
          <RefreshCcw className="h-4 w-4" />
          Coba Lagi
        </button>
      </section>
    </main>
  );
}