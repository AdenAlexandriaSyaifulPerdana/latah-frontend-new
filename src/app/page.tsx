import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

import { ROUTES } from "../lib/constants";
import { howItWorks, landingStatsFallback } from "../data/landing-content";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <section className="relative overflow-hidden bg-[#0B2D4D] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,196,81,0.35),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(217,84,63,0.28),_transparent_30%)]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href={ROUTES.home} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5C451] text-[#0B2D4D] shadow-lg">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">LATAH</p>
              <p className="text-xs text-white/70">Lapor Aspirasi Jember</p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
            <Link href={ROUTES.reports} className="transition hover:text-white">
              Laporan Publik
            </Link>
            <Link href={ROUTES.map} className="transition hover:text-white">
              Peta
            </Link>
            <Link href={ROUTES.leaderboard} className="transition hover:text-white">
              Leaderboard
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.login}
              className="hidden rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10 sm:inline-flex"
            >
              Masuk
            </Link>
            <Link
              href={ROUTES.register}
              className="rounded-full bg-[#D9543F] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-[#c24634]"
            >
              Daftar
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-32 lg:pt-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur">
              <Sparkles className="h-4 w-4 text-[#F5C451]" />
              Platform pelaporan kota berbasis AI
            </div>

            <h1 className="max-w-3xl font-serif text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Laporkan Masalah Kota, Pantau Tindak Lanjutnya.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 md:text-lg">
              LATAH membantu masyarakat Jember menyampaikan laporan secara cepat,
              transparan, dan berbasis data melalui foto, lokasi, interaksi warga, dan
              prioritas penanganan.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href={ROUTES.citizenNewReport}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F5C451] px-7 py-3 text-sm font-bold text-[#0B2D4D] shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#ffd25d]"
              >
                Buat Laporan
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={ROUTES.map}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Lihat Peta Laporan
                <MapPin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <div className="rounded-[1.5rem] bg-white p-5 text-slate-900">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Ringkasan Hari Ini
                    </p>
                    <h2 className="text-2xl font-black text-[#0B2D4D]">
                      Dashboard Kota
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-[#FFF4D8] p-3 text-[#D9543F]">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {landingStatsFallback.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <p className="text-2xl font-black text-[#0B2D4D]">
                        {item.value}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-3xl bg-[#0B2D4D] p-5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <Bell className="h-5 w-5 text-[#F5C451]" />
                    </div>
                    <div>
                      <p className="font-bold">Status laporan transparan</p>
                      <p className="text-sm text-white/70">
                        Pending, diproses, selesai, atau ditolak.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 hidden rounded-3xl bg-[#D9543F] p-5 text-white shadow-xl lg:block">
              <Trophy className="mb-3 h-7 w-7 text-[#F5C451]" />
              <p className="text-sm font-bold">Leaderboard Warga Aktif</p>
              <p className="text-xs text-white/75">Gamifikasi kontribusi publik</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D9543F]">
            Cara Kerja
          </p>
          <h2 className="mt-3 font-serif text-4xl font-black text-[#0B2D4D] md:text-5xl">
            Dari laporan warga menjadi tindakan nyata.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {howItWorks.map((item, index) => (
            <article
              key={item.title}
              className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4D8] text-lg font-black text-[#D9543F]">
                {index + 1}
              </div>
              <h3 className="text-lg font-black text-[#0B2D4D]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-[#0B2D4D] p-8 text-white">
            <MapPin className="mb-5 h-8 w-8 text-[#F5C451]" />
            <h3 className="text-2xl font-black">Smart Mapping</h3>
            <p className="mt-3 text-sm leading-6 text-white/75">
              Menampilkan sebaran laporan berdasarkan lokasi agar area prioritas lebih
              mudah dikenali.
            </p>
          </div>

          <div className="rounded-[2rem] bg-[#FFF4D8] p-8 text-[#0B2D4D]">
            <Sparkles className="mb-5 h-8 w-8 text-[#D9543F]" />
            <h3 className="text-2xl font-black">AI Classification</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Membantu mengklasifikasi laporan dan mendeteksi urgensi berdasarkan
              judul serta deskripsi.
            </p>
          </div>

          <div className="rounded-[2rem] bg-[#D9543F] p-8 text-white">
            <MessageCircle className="mb-5 h-8 w-8 text-[#F5C451]" />
            <h3 className="text-2xl font-black">Civic Interaction</h3>
            <p className="mt-3 text-sm leading-6 text-white/75">
              Warga dapat memberi dukungan dan komentar pada laporan publik untuk
              memperkuat prioritas masalah.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}