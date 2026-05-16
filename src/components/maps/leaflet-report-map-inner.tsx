"use client";

import Link from "next/link";
import L from "leaflet";
import { FileText, MapPin } from "lucide-react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useEffect, useMemo, useState } from "react";

import { StatusBadge } from "../common/status-badge";
import { truncateText } from "../../lib/utils";
import type { Report } from "../../types/report";

const JEMBER_CENTER: [number, number] = [-8.1737, 113.7004];

interface LeafletReportMapInnerProps {
  reports: Report[];
  title?: string;
  description?: string;
}

interface ReportPoint {
  report: Report;
  position: [number, number];
}

function toNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function getReportPosition(report: Report): [number, number] | null {
  const lat = toNumber(report.latitude);
  const lng = toNumber(report.longitude);

  if (lat === null || lng === null) return null;

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return [lat, lng];
}

function getCategoryName(report: Report) {
  if (report.report_categories?.name) return report.report_categories.name;
  if (typeof report.category === "string") return report.category;
  return report.category?.name || "Umum";
}

function createPinIcon(active = false) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: ${active ? "48px" : "42px"};
        height: ${active ? "48px" : "42px"};
        border-radius: 9999px;
        background: ${active ? "#D9543F" : "#F5C451"};
        border: 4px solid white;
        box-shadow: 0 14px 30px rgba(11, 45, 77, 0.28);
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${active ? "white" : "#0B2D4D"};
        font-weight: 900;
      ">
        <span style="font-size: 20px;">⌖</span>
      </div>
    `,
    iconSize: active ? [48, 48] : [42, 42],
    iconAnchor: active ? [24, 24] : [21, 21],
    popupAnchor: [0, -22],
  });
}

function MapFitBounds({ points }: { points: ReportPoint[] }) {
  const map = useMap();

  useEffect(() => {
    window.setTimeout(() => {
      map.invalidateSize();

      if (points.length === 0) {
        map.setView(JEMBER_CENTER, 13);
        return;
      }

      if (points.length === 1) {
        map.setView(points[0].position, 14);
        return;
      }

      const bounds = L.latLngBounds(points.map((item) => item.position));

      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 14,
      });
    }, 250);
  }, [map, points]);

  return null;
}

function MapFocus({ position }: { position: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.flyTo(position, Math.max(map.getZoom(), 14), {
      animate: true,
      duration: 0.8,
    });
  }, [map, position]);

  return null;
}

export function LeafletReportMapInner({
  reports,
  title = "Peta Laporan",
  description = "Pantau sebaran laporan masyarakat berdasarkan titik lokasi.",
}: LeafletReportMapInnerProps) {
  const [activeReportId, setActiveReportId] = useState<number | null>(null);

  const reportPoints = useMemo(() => {
    return reports
      .map((report) => {
        const position = getReportPosition(report);

        if (!position) return null;

        return {
          report,
          position,
        };
      })
      .filter(Boolean) as ReportPoint[];
  }, [reports]);

  const activePoint =
    reportPoints.find((item) => item.report.id === activeReportId) ?? null;

  const previewPoint = activePoint ?? reportPoints[0] ?? null;

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#D9543F]">
            OpenStreetMap
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#0B2D4D]">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            {description}
          </p>
        </div>

        <div className="latah-leaflet-map relative z-0 h-[620px] w-full overflow-hidden">
          <MapContainer
            center={JEMBER_CENTER}
            zoom={13}
            scrollWheelZoom
            className="h-full w-full"
          >
            <MapFitBounds points={reportPoints} />
            <MapFocus position={activePoint?.position ?? null} />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {reportPoints.map(({ report, position }) => {
              const active = activePoint?.report.id === report.id;

              return (
                <Marker
                  key={report.id}
                  position={position}
                  icon={createPinIcon(active)}
                  eventHandlers={{
                    click: () => setActiveReportId(report.id),
                  }}
                >
                  <Popup>
                    <div className="max-w-[260px]">
                      <p className="text-xs font-bold text-slate-500">
                        #{report.id} · {getCategoryName(report)}
                      </p>

                      <h3 className="mt-1 text-base font-black text-[#0B2D4D]">
                        {report.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {truncateText(report.description, 90)}
                      </p>

                      <Link
                        href={`/reports/${report.id}`}
                        className="mt-3 inline-flex rounded-full bg-[#0B2D4D] px-4 py-2 text-xs font-black text-white"
                      >
                        Detail Laporan
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            <div className="leaflet-bottom leaflet-left">
              <div className="leaflet-control rounded-2xl bg-[#0B2D4D]/80 px-4 py-3 text-sm font-black text-white shadow-lg backdrop-blur">
                {reportPoints.length} titik laporan ditampilkan
              </div>
            </div>
          </MapContainer>
        </div>
      </div>

      <aside className="space-y-5">
        {previewPoint ? (
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <StatusBadge status={previewPoint.report.status} />
              <span className="text-xs font-bold text-slate-400">
                ID #{previewPoint.report.id}
              </span>
            </div>

            <h2 className="text-2xl font-black leading-tight text-[#0B2D4D]">
              {previewPoint.report.title}
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              {truncateText(previewPoint.report.description, 160)}
            </p>

            <div className="mt-5 rounded-2xl bg-[#FFF4D8] p-4">
              <div className="flex gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#D9543F]" />
                <div>
                  <p className="text-sm font-black text-[#0B2D4D]">
                    {previewPoint.report.location_name ||
                      "Lokasi belum tersedia"}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {previewPoint.report.address_detail ||
                      "Detail alamat belum tersedia."}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/reports/${previewPoint.report.id}`}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0B2D4D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#123C69]"
            >
              <FileText className="h-4 w-4" />
              Lihat Detail Laporan
            </Link>
          </div>
        ) : (
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-[#0B2D4D]">
              Belum ada titik laporan
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              Laporan yang memiliki latitude dan longitude akan tampil di peta.
            </p>
          </div>
        )}

        <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
          {reportPoints.map(({ report }) => (
            <button
              key={report.id}
              type="button"
              onClick={() => setActiveReportId(report.id)}
              className={[
                "w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:border-[#F5C451]",
                activePoint?.report.id === report.id
                  ? "border-[#F5C451]"
                  : "border-slate-100",
              ].join(" ")}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <StatusBadge status={report.status} />
                <span className="text-xs font-bold text-slate-400">
                  #{report.id}
                </span>
              </div>

              <p className="line-clamp-2 text-sm font-black text-[#0B2D4D]">
                {report.title}
              </p>

              <p className="mt-2 line-clamp-1 text-xs text-slate-500">
                {report.location_name ||
                  report.address_detail ||
                  "Lokasi belum tersedia"}
              </p>
            </button>
          ))}
        </div>
      </aside>
    </section>
  );
}