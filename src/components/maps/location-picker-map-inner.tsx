"use client";

import L from "leaflet";
import { Crosshair } from "lucide-react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";

const JEMBER_CENTER: [number, number] = [-8.1737, 113.7004];

interface LocationValue {
  latitude?: number | null;
  longitude?: number | null;
}

interface LocationPickerMapInnerProps {
  value: LocationValue;
  onChange: (value: { latitude: number; longitude: number }) => void;
  onAddressChange?: (address: string) => void;
}

function getSelectedPosition(value: LocationValue): [number, number] | null {
  const lat = Number(value.latitude);
  const lng = Number(value.longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return [lat, lng];
}

function createSelectedIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 46px;
        height: 46px;
        border-radius: 9999px;
        background: #D9543F;
        border: 4px solid white;
        box-shadow: 0 14px 30px rgba(11, 45, 77, 0.28);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 900;
      ">
        <span style="font-size: 22px;">⌖</span>
      </div>
    `,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
  });
}

async function reverseGeocode(latitude: number, longitude: number) {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");

    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", String(latitude));
    url.searchParams.set("lon", String(longitude));
    url.searchParams.set("accept-language", "id");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) return "";

    const data = await response.json();

    return typeof data.display_name === "string" ? data.display_name : "";
  } catch {
    return "";
  }
}

function MapClickHandler({
  onPick,
}: {
  onPick: (position: [number, number]) => void;
}) {
  useMapEvents({
    click(event) {
      onPick([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
}

function MapRecenter({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, Math.max(map.getZoom(), 14), {
      animate: true,
      duration: 0.7,
    });
  }, [map, position]);

  return null;
}

export function LocationPickerMapInner({
  value,
  onChange,
  onAddressChange,
}: LocationPickerMapInnerProps) {
  const [errorMessage, setErrorMessage] = useState("");

  const selectedPosition = getSelectedPosition(value);
  const center = selectedPosition ?? JEMBER_CENTER;

  async function selectPosition(position: [number, number]) {
    setErrorMessage("");

    const [latitude, longitude] = position;

    onChange({
      latitude,
      longitude,
    });

    const address = await reverseGeocode(latitude, longitude);

    if (address) {
      onAddressChange?.(address);
    }
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setErrorMessage("Browser tidak mendukung fitur lokasi.");
      return;
    }

    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        selectPosition([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      () => {
        setErrorMessage(
          "Gagal mengambil lokasi. Pastikan izin lokasi browser sudah aktif.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-[#0B2D4D]">
              Pilih Titik Lokasi
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Klik langsung pada peta. Koordinat akan terisi otomatis.
            </p>
          </div>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F5C451] px-4 py-2 text-xs font-black text-[#0B2D4D] transition hover:bg-[#ffd25d]"
          >
            <Crosshair className="h-4 w-4" />
            Gunakan Lokasi Saya
          </button>
        </div>

        <div className="h-[360px] w-full">
          <MapContainer
            center={center}
            zoom={14}
            scrollWheelZoom
            className="h-full w-full"
          >
            <MapRecenter position={center} />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickHandler onPick={selectPosition} />

            {selectedPosition ? (
              <Marker
                position={selectedPosition}
                icon={createSelectedIcon()}
              />
            ) : null}
          </MapContainer>
        </div>
      </div>

      {selectedPosition ? (
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          Titik lokasi dipilih: {selectedPosition[0].toFixed(6)},{" "}
          {selectedPosition[1].toFixed(6)}
        </div>
      ) : (
        <div className="rounded-2xl bg-[#FFF4D8] px-4 py-3 text-sm font-semibold text-[#0B2D4D]">
          Belum ada titik dipilih. Klik peta untuk menentukan lokasi laporan.
        </div>
      )}

      {errorMessage ? (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}