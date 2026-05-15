import { Loader2, ShieldCheck } from "lucide-react";

interface FullPageLoaderProps {
  title?: string;
  description?: string;
}

export function FullPageLoader({
  title = "Memuat LATAH",
  description = "Mohon tunggu sebentar, data sedang dipersiapkan.",
}: FullPageLoaderProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-6">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#0B2D4D] text-[#F5C451]">
          <ShieldCheck className="h-8 w-8" />
        </div>

        <Loader2 className="mx-auto mt-6 h-8 w-8 animate-spin text-[#D9543F]" />

        <h1 className="mt-6 text-2xl font-black text-[#0B2D4D]">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          {description}
        </p>
      </div>
    </main>
  );
}