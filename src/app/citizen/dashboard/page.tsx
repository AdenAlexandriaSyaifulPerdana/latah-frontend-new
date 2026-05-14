import { Bell, FileText, MessageCircle, ThumbsUp } from "lucide-react";

import { StatCard } from "../../../components/common/stat-card";

export default function CitizenDashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D9543F]">
          Citizen Area
        </p>
        <h2 className="mt-2 text-3xl font-black text-[#0B2D4D]">
          Ringkasan Kontribusi Warga
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
          Area ini akan digunakan warga untuk membuat laporan, memantau status
          laporan, memberi komentar, menyimpan bookmark, dan melihat notifikasi.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Laporan Saya"
          value="0"
          description="Total laporan yang telah dibuat."
          icon={FileText}
        />
        <StatCard
          title="Komentar"
          value="0"
          description="Interaksi pada laporan publik."
          icon={MessageCircle}
        />
        <StatCard
          title="Upvote"
          value="0"
          description="Dukungan yang diberikan."
          icon={ThumbsUp}
        />
        <StatCard
          title="Notifikasi"
          value="0"
          description="Update status laporan."
          icon={Bell}
        />
      </section>
    </div>
  );
}