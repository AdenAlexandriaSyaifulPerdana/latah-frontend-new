"use client";

import dynamic from "next/dynamic";
import type { Report } from "../../types/report";

const LeafletReportMapInner = dynamic(
  () =>
    import("./leaflet-report-map-inner").then(
      (module) => module.LeafletReportMapInner,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[620px] animate-pulse rounded-[2rem] bg-white" />
    ),
  },
);

interface LeafletReportMapProps {
  reports: Report[];
  title?: string;
  description?: string;
}

export function LeafletReportMap(props: LeafletReportMapProps) {
  return <LeafletReportMapInner {...props} />;
}