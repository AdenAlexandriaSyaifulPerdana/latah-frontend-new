import { ShieldCheck } from "lucide-react";

export function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-6">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 animate-pulse items-center justify-center rounded-3xl bg-[#0B2D4D] text-[#F5C451] shadow-xl">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <p className="text-sm font-semibold text-slate-500">Memuat LATAH...</p>
      </div>
    </div>
  );
}