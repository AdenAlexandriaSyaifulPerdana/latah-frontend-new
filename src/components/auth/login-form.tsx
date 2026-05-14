"use client";

import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { type FormEvent, useState } from "react";

import { useAuth } from "../../hooks/use-auth";

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

export function LoginForm() {
  const { login } = useAuth();

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

      await login({
        email: form.email.trim(),
        password: form.password,
      });
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
    <div>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => fillDemoAccount(citizenDemo)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm transition hover:border-[#F5C451] hover:bg-[#FFF4D8]"
        >
          <span className="block font-black text-[#0B2D4D]">Demo Citizen</span>
          <span className="mt-1 block text-xs text-slate-500">
            Masuk sebagai warga
          </span>
        </button>

        <button
          type="button"
          onClick={() => fillDemoAccount(adminDemo)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm transition hover:border-[#F5C451] hover:bg-[#FFF4D8]"
        >
          <span className="block font-black text-[#0B2D4D]">Demo Admin</span>
          <span className="mt-1 block text-xs text-slate-500">
            Masuk sebagai admin
          </span>
        </button>
      </div>

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
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Masukkan password"
              autoComplete="current-password"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-[#0B2D4D]"
              aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
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
    </div>
  );
}