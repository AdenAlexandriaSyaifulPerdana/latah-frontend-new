import { PageHeading } from "../../components/common/page-heading";
import { LeaderboardPageClient } from "../../components/leaderboard/leaderboard-page-client";
import { PublicNavbar } from "../../components/layout/public-navbar";
import { SiteFooter } from "../../components/layout/site-footer";

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <PublicNavbar />

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        <PageHeading
          eyebrow="Leaderboard"
          title="Apresiasi warga paling aktif."
          description="Gamifikasi membantu mendorong partisipasi masyarakat melalui poin kontribusi, laporan valid, komentar, dan dukungan terhadap laporan publik."
        />

        <LeaderboardPageClient />
      </div>

      <SiteFooter />
    </main>
  );
}