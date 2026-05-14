import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { PageHeading } from "../../components/common/page-heading";
import { PublicNavbar } from "../../components/layout/public-navbar";
import { SiteFooter } from "../../components/layout/site-footer";
import { ReportsPageClient } from "../../components/reports/reports-page-client";
import { ROUTES } from "../../lib/constants";

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <PublicNavbar />

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        <PageHeading
          eyebrow="Laporan Publik"
          title="Pantau masalah kota secara terbuka."
          description="Lihat laporan masyarakat, status penanganan, lokasi masalah, serta prioritas laporan yang sedang diproses."
          action={
            <Link
              href={ROUTES.citizenNewReport}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F5C451] px-6 py-3 text-sm font-black text-[#0B2D4D] transition hover:bg-[#ffd25d]"
            >
              <PlusCircle className="h-4 w-4" />
              Buat Laporan
            </Link>
          }
        />

        <ReportsPageClient />
      </div>

      <SiteFooter />
    </main>
  );
}