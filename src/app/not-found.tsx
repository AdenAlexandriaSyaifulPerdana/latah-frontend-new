import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

import { ROUTES } from "../lib/constants";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-6">
      <section className="w-full max-w-lg rounded-[2rem] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FFF4D8] text-[#D9543F]">
          <FileQuestion className="h-8 w-8" />
        </div>

        <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-[#D9543F]">
          404
        </p>

        <h1 className="mt-3 text-3xl font-black text-[#0B2D4D]">
          Halaman tidak ditemukan
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          Halaman yang kamu buka tidak tersedia atau sudah dipindahkan.
        </p>

        <Link
          href={ROUTES.home}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#0B2D4D] px-6 py-3 text-sm font-black text-white transition hover:bg-[#123C69]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </section>
    </main>
  );
}