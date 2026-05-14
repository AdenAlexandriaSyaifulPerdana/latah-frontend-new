"use client";

import { Mail, ShieldCheck, UserCircle } from "lucide-react";

import { useAuth } from "../../../hooks/use-auth";
import { getInitials } from "../../../lib/utils";

export default function CitizenProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[#0B2D4D] p-8 text-white">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#F5C451]">
          Profile
        </p>
        <h1 className="mt-3 font-serif text-4xl font-black leading-tight md:text-5xl">
          Profil Citizen.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
          Informasi akun warga yang digunakan untuk membuat laporan dan ikut
          berpartisipasi dalam sistem LATAH.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-[#FFF4D8] text-4xl font-black text-[#D9543F]">
            {getInitials(user?.name)}
          </div>

          <h2 className="mt-6 text-2xl font-black text-[#0B2D4D]">
            {user?.name || "Citizen"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{user?.email}</p>

          <div className="mt-6 rounded-2xl bg-[#0B2D4D] px-4 py-3 text-sm font-black text-white">
            Role: {user?.role || "citizen"}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black text-[#0B2D4D]">
            Informasi Akun
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5">
              <UserCircle className="h-6 w-6 text-[#D9543F]" />
              <div>
                <p className="text-sm font-semibold text-slate-500">Nama</p>
                <p className="font-black text-[#0B2D4D]">
                  {user?.name || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5">
              <Mail className="h-6 w-6 text-[#D9543F]" />
              <div>
                <p className="text-sm font-semibold text-slate-500">Email</p>
                <p className="font-black text-[#0B2D4D]">
                  {user?.email || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5">
              <ShieldCheck className="h-6 w-6 text-[#D9543F]" />
              <div>
                <p className="text-sm font-semibold text-slate-500">Status</p>
                <p className="font-black text-[#0B2D4D]">
                  Akun citizen aktif
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}