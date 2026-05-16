import { PublicNavbar } from "../../components/layout/public-navbar";
import { SiteFooter } from "../../components/layout/site-footer";
import { LeafletMapPageClient } from "../../components/maps/leaflet-map-page-client";

export default function MapPage() {
  return (
    <>
      <PublicNavbar />
      <LeafletMapPageClient />
      <SiteFooter />
    </>
  );
}