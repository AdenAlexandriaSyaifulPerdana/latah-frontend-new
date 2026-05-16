import { PageHeading } from "../../components/common/page-heading";
import { PublicNavbar } from "../../components/layout/public-navbar";
import { SiteFooter } from "../../components/layout/site-footer";
import { PublicMapPageClient } from "../../components/maps/public-map-page-client";

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <PublicNavbar />

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        <PageHeading
          eyebrow="Smart Mapping"
          title="Lihat sebaran masalah kota."
          description="Peta laporan membantu masyarakat dan pemerintah melihat area yang membutuhkan perhatian lebih cepat."
        />

        <PublicMapPageClient />
      </div>

      <SiteFooter />
    </main>
  );
}