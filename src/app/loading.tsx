import { FullPageLoader } from "../components/common/full-page-loader";

export default function Loading() {
  return (
    <FullPageLoader
      title="Memuat halaman"
      description="Data sedang diproses. Mohon tunggu sebentar."
    />
  );
}