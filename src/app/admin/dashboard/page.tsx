import { Clock, FileText, Loader2, Users } from "lucide-react";

import { StatCard } from "../../../components/common/stat-card";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D9543F]">
          Admin Command Center
        </p>
        <h2 className="mt-2 text-3xl font-black text-[#0B2D4D]">
          Monitoring Laporan Kota
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
          Area ini akan digunakan admin untuk melihat statistik laporan,
          menentukan prioritas penanganan, memantau hotspot, dan memperbarui
          status laporan masyarakat.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Laporan"
          value="0"
          description="Seluruh laporan yang masuk."
          icon={FileText}
        />
        <StatCard
          title="Pending"
          value="0"
          description="Laporan baru menunggu verifikasi."
          icon={Clock}
        />
        <StatCard
          title="Diproses"
          value="0"
          description="Laporan sedang ditindaklanjuti."
          icon={Loader2}
        />
        <StatCard
          title="Total User"
          value="0"
          description="Jumlah pengguna terdaftar."
          icon={Users}
        />
      </section>
    </div>
  );
}