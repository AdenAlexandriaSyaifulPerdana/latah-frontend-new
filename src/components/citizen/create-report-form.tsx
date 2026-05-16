"use client";

import { useRouter } from "next/navigation";
import {
  ImagePlus,
  Loader2,
  Send,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "../../hooks/use-auth";
import {
  useAnalyzeText,
  useCategories,
  useCreateReport,
} from "../../hooks/use-reports";
import { useUploadReportImage } from "../../hooks/use-citizen-data";
import { LocationPickerMap } from "../maps/location-picker-map";
import { api } from "../../lib/api";
import { ROUTES } from "../../lib/constants";
import { saveStoredMyReport } from "../../lib/my-report-storage";
import type { AnalyzeTextResult } from "../../types/ai";
import type { CreateReportRequest, Report } from "../../types/report";


interface FormState {
  title: string;
  description: string;
  category_id: string;
  location_name: string;
  address_detail: string;
  latitude: string;
  longitude: string;
}

const initialForm: FormState = {
  title: "",
  description: "",
  category_id: "",
  location_name: "",
  address_detail: "",
  latitude: "",
  longitude: "",
};

function getUploadUrl(response: unknown) {
  const root =
    typeof response === "object" && response !== null
      ? (response as Record<string, unknown>)
      : {};

  const data =
    "data" in root && typeof root.data === "object" && root.data !== null
      ? (root.data as Record<string, unknown>)
      : root;

  return (
    (typeof data.image_url === "string" && data.image_url) ||
    (typeof data.public_url === "string" && data.public_url) ||
    (typeof data.url === "string" && data.url) ||
    ""
  );
}

function getCreatedReport(response: unknown) {
  const root =
    typeof response === "object" && response !== null
      ? (response as Record<string, unknown>)
      : {};

  const data =
    "data" in root && typeof root.data === "object" && root.data !== null
      ? (root.data as Record<string, unknown>)
      : null;

  const candidates = [
    response,
    data,
    data?.report,
    data?.createdReport,
    data?.newReport,
    data?.item,
    data?.result,
    root.report,
    root.createdReport,
    root.newReport,
    root.item,
    root.result,
  ];

  for (const candidate of candidates) {
    if (
      typeof candidate === "object" &&
      candidate !== null &&
      "id" in candidate
    ) {
      return candidate as Report;
    }
  }

  return null;
}

function normalizeReportsFromResponse(response: unknown): Report[] {
  const root =
    typeof response === "object" && response !== null
      ? (response as Record<string, unknown>)
      : {};

  const data = root.data;

  if (Array.isArray(data)) return data as Report[];

  if (typeof data === "object" && data !== null) {
    const dataObject = data as Record<string, unknown>;

    if (Array.isArray(dataObject.data)) return dataObject.data as Report[];
    if (Array.isArray(dataObject.reports)) return dataObject.reports as Report[];
    if (Array.isArray(dataObject.items)) return dataObject.items as Report[];
    if (Array.isArray(dataObject.rows)) return dataObject.rows as Report[];
  }

  if (Array.isArray(response)) return response as Report[];

  return [];
}

function findCreatedReportFromList(
  reports: Report[],
  payload: CreateReportRequest,
) {
  const matchedReports = reports.filter((report) => {
    return (
      report.title === payload.title &&
      report.description === payload.description &&
      report.location_name === payload.location_name
    );
  });

  return matchedReports.sort((a, b) => Number(b.id) - Number(a.id))[0] ?? null;
}

export function CreateReportForm() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const createReportMutation = useCreateReport();
  const analyzeTextMutation = useAnalyzeText();
  const uploadImageMutation = useUploadReportImage();

  const [form, setForm] = useState<FormState>(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [aiResult, setAiResult] = useState<AnalyzeTextResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isSubmitting =
    createReportMutation.isPending || uploadImageMutation.isPending;

  const selectedCategory = useMemo(() => {
    return categories.find(
      (category) => String(category.id) === form.category_id,
    );
  }, [categories, form.category_id]);

  useEffect(() => {
    if (!form.category_id && categories[0]?.id) {
      setForm((current) => ({
        ...current,
        category_id: String(categories[0].id),
      }));
    }
  }, [categories, form.category_id]);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [imageFile]);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("File harus berupa gambar.");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar maksimal 3MB.");
      return;
    }

    setImageFile(file);
    setErrorMessage("");
  }

  function validateForm() {
    if (!user?.id) return "User tidak valid. Silakan login ulang.";
    if (!form.title.trim()) return "Judul laporan wajib diisi.";
    if (!form.description.trim()) return "Deskripsi laporan wajib diisi.";
    if (!form.location_name.trim()) return "Nama lokasi wajib diisi.";
    if (!form.address_detail.trim()) return "Detail alamat wajib diisi.";

    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return "Pilih titik lokasi laporan di peta terlebih dahulu.";
    }

    return "";
  }

  async function handleAnalyzeText() {
    if (!form.title.trim() || !form.description.trim()) {
      setErrorMessage(
        "Isi judul dan deskripsi terlebih dahulu sebelum menjalankan AI.",
      );
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");

      const result = await analyzeTextMutation.mutateAsync({
        title: form.title.trim(),
        description: form.description.trim(),
      });

      setAiResult(result);

      const matchedCategory = categories.find((category) => {
        const categoryName = category.name.toLowerCase();
        const aiCategory = result.category.toLowerCase();

        return (
          categoryName.includes(aiCategory) ||
          aiCategory.includes(categoryName)
        );
      });

      if (matchedCategory) {
        setForm((current) => ({
          ...current,
          category_id: String(matchedCategory.id),
        }));
      }

      setSuccessMessage("AI berhasil menganalisis kategori dan urgensi laporan.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "AI gagal menganalisis laporan.";

      setErrorMessage(message);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");

      const latitude = Number(form.latitude);
      const longitude = Number(form.longitude);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        setErrorMessage("Pilih titik lokasi laporan di peta terlebih dahulu.");
        return;
      }

      let uploadedImageUrl = "";

      if (imageFile) {
        const uploadResponse = await uploadImageMutation.mutateAsync(imageFile);
        uploadedImageUrl = getUploadUrl(uploadResponse);

        if (!uploadedImageUrl) {
          throw new Error(
            "Gambar berhasil diproses, tetapi URL gambar tidak ditemukan dari server.",
          );
        }
      }

      const payload: CreateReportRequest = {
        user_id: Number(user?.id),
        category_id: Number(form.category_id || categories[0]?.id || 1),
        title: form.title.trim(),
        description: form.description.trim(),
        location_name: form.location_name.trim(),
        address_detail: form.address_detail.trim(),
        latitude,
        longitude,
      };

      if (uploadedImageUrl) {
        payload.image_url = uploadedImageUrl;
      }

      const response = await createReportMutation.mutateAsync(payload);

      let createdReport = getCreatedReport(response);

      if (!createdReport?.id) {
        const reportsResponse = await api.get<unknown>("/reports", {
          auth: true,
        });

        const reports = normalizeReportsFromResponse(reportsResponse);
        createdReport = findCreatedReportFromList(reports, payload);
      }

      const reportToStore: Report = createdReport?.id
        ? {
            ...createdReport,
            user_id: Number(user?.id),
          }
        : {
            id: Date.now(),
            user_id: Number(user?.id),
            category_id: payload.category_id,
            title: payload.title,
            description: payload.description,
            location_name: payload.location_name,
            address_detail: payload.address_detail,
            latitude: payload.latitude,
            longitude: payload.longitude,
            status: "pending",
            created_at: new Date().toISOString(),
            category: selectedCategory,
            is_local_only: true,
          };

      saveStoredMyReport(user?.id, reportToStore);

      setSuccessMessage("Laporan berhasil dikirim.");

      if (createdReport?.id) {
        router.push(`/reports/${createdReport.id}`);
      } else {
        router.push(ROUTES.citizenMyReports);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Laporan gagal dikirim. Silakan coba lagi.";

      setErrorMessage(message);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[#0B2D4D] p-8 text-white">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#F5C451]">
          Smart Report
        </p>
        <h1 className="mt-3 font-serif text-4xl font-black leading-tight md:text-5xl">
          Buat laporan masalah kota.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
          Unggah foto, tulis deskripsi, pilih titik lokasi di peta, lalu gunakan
          bantuan AI untuk membaca kategori dan tingkat urgensi laporan.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[1fr_380px]"
      >
        <section className="space-y-6 rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <div>
            <label className="mb-2 block text-sm font-black text-[#0B2D4D]">
              Judul Laporan
            </label>
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Contoh: Jalan rusak depan pasar"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-[#0B2D4D]">
              Deskripsi
            </label>
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Jelaskan kondisi masalah secara detail..."
              rows={6}
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-7 outline-none transition focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-black text-[#0B2D4D]">
                Kategori
              </label>
              <select
                value={form.category_id}
                onChange={(event) =>
                  updateField("category_id", event.target.value)
                }
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 outline-none transition focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
              >
                {categoriesLoading ? (
                  <option>Memuat kategori...</option>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="1">Kategori Default</option>
                )}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#0B2D4D]">
                Nama Lokasi
              </label>
              <input
                value={form.location_name}
                onChange={(event) =>
                  updateField("location_name", event.target.value)
                }
                placeholder="Contoh: Pasar Tanjung"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-[#0B2D4D]">
              Detail Alamat
            </label>
            <input
              value={form.address_detail}
              onChange={(event) =>
                updateField("address_detail", event.target.value)
              }
              placeholder="Contoh: Jl. Kenanga No. 12, Jember"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#F5C451] focus:ring-4 focus:ring-[#F5C451]/20"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-black text-[#0B2D4D]">
              Titik Lokasi Laporan
            </label>

            <LocationPickerMap
              value={{
                latitude: form.latitude ? Number(form.latitude) : null,
                longitude: form.longitude ? Number(form.longitude) : null,
              }}
              onChange={(location) => {
                setForm((current) => ({
                  ...current,
                  latitude: String(location.latitude),
                  longitude: String(location.longitude),
                }));

                if (errorMessage) setErrorMessage("");
                if (successMessage) setSuccessMessage("");
              }}
              onAddressChange={(address) => {
                setForm((current) => ({
                  ...current,
                  address_detail: current.address_detail || address,
                  location_name:
                    current.location_name || address.split(",")[0] || "",
                }));
              }}
            />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-[#0B2D4D]">Foto Laporan</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Unggah foto kondisi di lapangan agar laporan lebih valid.
            </p>

            <label className="mt-5 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-[#F5C451] hover:bg-[#FFF4D8]">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview laporan"
                  className="h-48 w-full rounded-2xl object-cover"
                />
              ) : (
                <>
                  <ImagePlus className="h-10 w-10 text-[#D9543F]" />
                  <p className="mt-3 text-sm font-black text-[#0B2D4D]">
                    Pilih Gambar
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Format gambar, maksimal 3MB
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {imageFile ? (
              <button
                type="button"
                onClick={() => setImageFile(null)}
                className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#D9543F]"
              >
                <X className="h-4 w-4" />
                Hapus gambar
              </button>
            ) : null}
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-[#0B2D4D]">AI Assistant</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              AI membantu membaca kategori, keyword, dan urgensi laporan.
            </p>

            <button
              type="button"
              onClick={handleAnalyzeText}
              disabled={analyzeTextMutation.isPending}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0B2D4D] px-5 text-sm font-black text-white transition hover:bg-[#123C69] disabled:opacity-70"
            >
              {analyzeTextMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-[#F5C451]" />
                  Analisis dengan AI
                </>
              )}
            </button>

            {aiResult ? (
              <div className="mt-5 space-y-3 rounded-2xl bg-[#FFF4D8] p-4 text-sm">
                <div>
                  <p className="font-black text-[#0B2D4D]">Kategori AI</p>
                  <p className="text-slate-600">{aiResult.category}</p>
                </div>

                <div>
                  <p className="font-black text-[#0B2D4D]">Urgensi</p>
                  <p className="text-slate-600">{aiResult.urgency_level}</p>
                </div>

                <div>
                  <p className="font-black text-[#0B2D4D]">Keyword</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {aiResult.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#D9543F]"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          {selectedCategory ? (
            <section className="rounded-[2rem] bg-[#0B2D4D] p-6 text-white shadow-sm">
              <p className="text-sm text-white/60">Kategori terpilih</p>
              <h3 className="mt-2 text-2xl font-black">
                {selectedCategory.name}
              </h3>
            </section>
          ) : null}

          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {successMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#D9543F] px-5 py-4 text-sm font-black text-white shadow-lg shadow-red-900/10 transition hover:bg-[#c24634] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mengirim laporan...
              </>
            ) : (
              <>
                {imageFile ? (
                  <UploadCloud className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Kirim Laporan
              </>
            )}
          </button>
        </aside>
      </form>
    </div>
  );
}