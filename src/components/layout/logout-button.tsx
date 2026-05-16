"use client";

import { type ReactNode, useState } from "react";
import { LogOut, X } from "lucide-react";

import { useAuth } from "../../hooks/use-auth";

interface LogoutButtonProps {
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
  onBeforeLogout?: () => void;
}

export function LogoutButton({
  className,
  children,
  ariaLabel = "Keluar",
  onBeforeLogout,
}: LogoutButtonProps) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  function handleConfirmLogout() {
    onBeforeLogout?.();
    setOpen(false);
    logout();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        aria-label={ariaLabel}
      >
        {children ?? (
          <>
            <LogOut className="h-5 w-5" />
            Keluar
          </>
        )}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm">
          <section className="w-full max-w-sm rounded-[2rem] bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[#D9543F]">
              <LogOut className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-2xl font-black text-[#0B2D4D]">
              Keluar dari akun?
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Kamu akan keluar dari dashboard LATAH dan perlu login ulang untuk
              mengakses akun.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-200 text-sm font-black text-[#0B2D4D] transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#D9543F] text-sm font-black text-white transition hover:bg-[#c24634]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}