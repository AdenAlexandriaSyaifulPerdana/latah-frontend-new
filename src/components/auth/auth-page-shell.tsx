import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

interface AuthPageShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerHref?: string;
}

export function AuthPageShell({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerHref,
}: AuthPageShellProps) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0B2D4D] px-5 py-6 sm:px-6 lg:flex lg:items-center lg:justify-center lg:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,196,81,0.32),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(217,84,63,0.28),_transparent_32%)]" />

      <div className="relative z-30 mx-auto mb-6 flex w-full max-w-6xl items-center justify-between lg:absolute lg:left-8 lg:top-8 lg:mb-0 lg:w-auto">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5C451] text-[#0B2D4D] shadow-lg">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xl font-black leading-none">LATAH</p>
            <p className="mt-1 text-xs text-white/70">Lapor Pemerintah</p>
          </div>
        </Link>
      </div>

      <section className="relative z-20 mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-[#FFF4D8] p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#0B2D4D] text-[#F5C451]">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <h2 className="mt-8 font-serif text-4xl font-black leading-tight text-[#0B2D4D]">
              Transparansi laporan kota dimulai dari akses yang mudah.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              Masuk atau daftar ke LATAH untuk membuat laporan, memberi
              dukungan, dan memantau perkembangan laporan masyarakat.
            </p>
          </div>

          <div className="mt-10 rounded-[1.5rem] bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-[#0B2D4D]">
              Smart Civic Platform
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              LATAH membantu warga dan pemerintah memetakan laporan kota secara
              transparan dan responsif.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl font-black leading-tight text-[#0B2D4D] sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                {description}
              </p>
            </div>

            {children}

            {footerText && footerLinkText && footerHref ? (
              <p className="mt-8 text-center text-sm text-slate-500">
                {footerText}{" "}
                <Link
                  href={footerHref}
                  className="font-black text-[#D9543F] transition hover:text-[#0B2D4D]"
                >
                  {footerLinkText}
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}