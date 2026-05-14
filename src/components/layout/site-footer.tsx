import Link from "next/link";
import { Mail, MapPin, ShieldCheck } from "lucide-react";

import { publicNavLinks } from "../../data/nav-links";
import { ROUTES } from "../../lib/constants";

export function SiteFooter() {
  return (
    <footer className="bg-[#071F36] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Link href={ROUTES.home} className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5C451] text-[#0B2D4D]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xl font-black leading-none">LATAH</p>
              <p className="text-sm text-white/60">Lapor Aspirasi & Tata Kota Jember</p>
            </div>
          </Link>

          <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
            Platform pelaporan masalah kota berbasis website untuk mendukung
            transparansi, respons cepat, dan partisipasi masyarakat Jember.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#F5C451]">
            Navigasi
          </h3>
          <div className="mt-5 space-y-3">
            {publicNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm font-medium text-white/65 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#F5C451]">
            Informasi
          </h3>

          <div className="mt-5 space-y-4 text-sm text-white/65">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-[#F5C451]" />
              <span>Kabupaten Jember, Jawa Timur</span>
            </div>

            <div className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-[#F5C451]" />
              <span>support@latah-jember.id</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5">
        <p className="mx-auto max-w-7xl text-xs text-white/45">
          © {new Date().getFullYear()} LATAH. Dibuat untuk mendukung smart city
          dan pelayanan publik yang lebih responsif.
        </p>
      </div>
    </footer>
  );
}