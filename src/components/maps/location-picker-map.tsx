"use client";

import dynamic from "next/dynamic";

const LocationPickerMapInner = dynamic(
  () =>
    import("./location-picker-map-inner").then(
      (module) => module.LocationPickerMapInner,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] animate-pulse rounded-[1.5rem] bg-white" />
    ),
  },
);

interface LocationValue {
  latitude?: number | null;
  longitude?: number | null;
}

interface LocationPickerMapProps {
  value: LocationValue;
  onChange: (value: { latitude: number; longitude: number }) => void;
  onAddressChange?: (address: string) => void;
}

export function LocationPickerMap(props: LocationPickerMapProps) {
  return <LocationPickerMapInner {...props} />;
}