import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { ROUTES } from "../../lib/constants";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B2D4D] px-6 py-12">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F5C451] text-[#0B2D4D]">
          <ShieldCheck className="h-8 w-8" />
        </div>

        <h1 className="text-center text-3xl font-black text-[#0B2D4D]">
          Masuk ke LATAH
        </h1>

        <p className="mt-3 text-center text-sm leading-6 text-slate-500">
          Form login akan dibuat pada part berikutnya dan langsung disambungkan
          ke endpoint <span className="font-bold">/auth/login</span>.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href={ROUTES.home}
            className="flex w-full justify-center rounded-full bg-[#0B2D4D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#123C69]"
          >
            Kembali ke Beranda
          </Link>

          <Link
            href={ROUTES.register}
            className="flex w-full justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-[#0B2D4D] transition hover:bg-slate-50"
          >
            Buat Akun
          </Link>
        </div>
      </div>
    </main>
  );
}