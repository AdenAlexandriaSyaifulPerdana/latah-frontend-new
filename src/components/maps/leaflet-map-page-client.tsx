"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";

import { EmptyState } from "../common/empty-state";
import { LeafletReportMap } from "./leaflet-report-map";
import { api } from "../../lib/api";
import type { ApiResponse } from "../../types/api";
import type { Report } from "../../types/report";

function extractReports(response: unknown): Report[] {
  if (Array.isArray(response)) return response as Report[];

  if (typeof response === "object" && response !== null) {
    const root = response as Record<string, unknown>;

    if (Array.isArray(root.data)) return root.data as Report[];

    if (typeof root.data === "object" && root.data !== null) {
      const data = root.data as Record<string, unknown>;

      if (Array.isArray(data.data)) return data.data as Report[];
      if (Array.isArray(data.reports)) return data.reports as Report[];
      if (Array.isArray(data.items)) return data.items as Report[];
      if (Array.isArray(data.rows)) return data.rows as Report[];
    }

    if (Array.isArray(root.reports)) return root.reports as Report[];
  }

  return [];
}

export function LeafletMapPageClient() {
  const {
    data: reports = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["public", "leaflet-map", "reports"],
    staleTime: 0,
    refetchOnMount: "always",
    queryFn: async () => {
      const response = await api.get<ApiResponse<Report[]> | Report[]>(
        "/reports",
      );

      return extractReports(response);
    },
  });

  return (
    <main className="bg-[#FAFAF7]">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 rounded-[2rem] bg-[#0B2D4D] p-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#F5C451]">
            Peta Laporan
          </p>
          <h1 className="mt-3 font-serif text-4xl font-black leading-tight md:text-5xl">
            Sebaran laporan warga.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
            Lihat titik laporan masyarakat menggunakan map.
          </p>
        </div>

        {isLoading ? (
          <div className="h-[720px] animate-pulse rounded-[2rem] bg-white" />
        ) : null}

        {isError ? (
          <EmptyState
            icon={MapPin}
            title="Gagal memuat peta"
            description={
              error instanceof Error
                ? error.message
                : "Terjadi kesalahan saat memuat data laporan."
            }
          />
        ) : null}

        {!isLoading && !isError ? (
          <LeafletReportMap
            reports={reports}
            title="Peta Laporan LATAH"
            description="Klik marker untuk melihat ringkasan laporan dan membuka detailnya."
          />
        ) : null}
      </section>
    </main>
  );
}