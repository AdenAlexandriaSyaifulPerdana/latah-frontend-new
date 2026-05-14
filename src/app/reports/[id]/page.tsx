import { PublicNavbar } from "../../../components/layout/public-navbar";
import { SiteFooter } from "../../../components/layout/site-footer";
import { ReportDetailClient } from "../../../components/reports/report-detail-client";

export default function ReportDetailPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <PublicNavbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <ReportDetailClient />
      </div>

      <SiteFooter />
    </main>
  );
}