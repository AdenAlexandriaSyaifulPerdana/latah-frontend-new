"use client";

import Link from "next/link";
import { Eye, EyeOff, Loader2, LogIn, ShieldCheck } from "lucide-react";
import { type FormEvent, useState } from "react";

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "https://latah-api.vercel.app/api";

interface LoginFormState {
  email: string;
  password: string;
}

const citizenDemo: LoginFormState = {
  email: "rizky@gmail.com",
  password: "12345678",
};

const adminDemo: LoginFormState = {
  email: "admin@gmail.com",
  password: "12345678",
};

export default function LoginPage() {
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof LoginFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  }

  function fillDemoAccount(account: LoginFormState) {
    setForm(account);
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    console.log("LOGIN SUBMIT CLICKED");

    if (!form.email.trim()) {
      setErrorMessage("Email wajib diisi.");
      return;
    }

    if (!form.password.trim()) {
      setErrorMessage("Password wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json().catch(() => null);

      console.log("LOGIN API RESULT:", data);

      if (!response.ok) {
        throw new Error(data?.message || `Login gagal. Status: ${response.status}`);
      }

      if (!data?.success) {
        throw new Error(data?.message || "Login gagal.");
      }

      if (!data?.token) {
        throw new Error("Token tidak ditemukan pada response login.");
      }

      if (!data?.user) {
        throw new Error("Data user tidak ditemukan pada response login.");
      }

      window.localStorage.setItem("latah_token", data.token);
      window.localStorage.setItem("latah_user", JSON.stringify(data.user));

      const redirectPath =
        data.user.role === "admin" ? "/admin/dashboard" : "/citizen/dashboard";

      console.log("REDIRECT TO:", redirectPath);

      window.location.assign(redirectPath);
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Login gagal. Silakan coba lagi.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0B2D4D] px-5 py-6 sm:px-6 lg:flex lg:items-center lg:justify-center lg:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,196,81,0.32),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(217,84,63,0.28),_transparent_32%)]" />

      <div className="relative z-30 mx-auto mb-6 flex w-full max-w-6xl items-center justify-between lg:absolute lg:left-8 lg:top-8 lg:mb-0 lg:w-auto">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5C451] text-[#0B2D4D]">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div>
            <p className="text-lg font-black leading-none">LATAH</p>
            <p className="text-xs text-white/70">Lapor Pemerintah</p>
          </div>
        </Link>
      </div>

      <section className="relative z-20 mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-[#FFF4D8] p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#0B2D4D] text-[#F5C451]">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <h2 className="mt-8 font-serif text-4xl font-black leading-tight text-[#0B2D4D]">
              Transparansi laporan kota dimulai dari akses yang mudah.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              Masuk ke LATAH untuk membuat laporan, memantau status, memberi
              dukungan, dan ikut berpartisipasi dalam pengawasan lingkungan kota
              Jember.
            </p>
          </div>

          <div className="mt-10 rounded-[1.5rem] bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-[#0B2D4D]">Demo Akun Admin</p>

            <div className="mt-4 space-y-3 text-sm text-slate-600">

              <div>
                <p>Email: admin@gmail.com</p>
                <p>Password: 12345678</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-7 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl font-black text-[#0B2D4D] sm:text-4xl">
                Masuk ke LATAH
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Gunakan akun citizen atau admin untuk mengakses dashboard sesuai
                role.
              </p>
            </div>

            {/* <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => fillDemoAccount(citizenDemo)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm transition hover:border-[#F5C451] hover:bg-[#FFF4D8]"
              >
                <span className="block font-black text-[#0B2D4D]">
                  Demo Citizen
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  Masuk sebagai warga
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount(adminDemo)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm transition hover:border-[#F5C451] hover:bg-[#FFF4D8]"
              >
                <span className="block font-black text-[#0B2D4D]">
                  Demo Admin
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  Masuk sebagai admin
                </span>
              </button>
            </div> */}

            <form onSubmit={handleSubmit} method="post" className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-black text-[#0B2D4D]"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="Masukkan email"
                  autoComplete="email"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-black text-[#0B2D4D]"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-[#0B2D4D]"
                    aria-label={
                      showPassword ? "Sembunyikan password" : "Lihat password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#D9543F] px-5 text-sm font-black text-white shadow-lg shadow-red-900/10 transition hover:bg-[#c24634] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Masuk
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-black text-[#D9543F] transition hover:text-[#0B2D4D]"
              >
                Daftar sebagai citizen
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}