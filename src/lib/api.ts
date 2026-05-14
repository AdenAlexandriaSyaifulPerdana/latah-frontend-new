import { API_BASE_URL } from "./constants";
import { authStorage } from "./storage";

type QueryParams = Record<string, string | number | boolean | null | undefined>;

interface ApiRequestOptions extends RequestInit {
  auth?: boolean;
  params?: QueryParams;
}

function buildUrl(path: string, params?: QueryParams) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { auth = false, params, headers, body, ...restOptions } = options;

  const requestHeaders = new Headers(headers);

  if (!(body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = authStorage.getToken();

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(buildUrl(path, params), {
    ...restOptions,
    body,
    headers: requestHeaders,
    cache: "no-store",
  });

  let responseData: unknown = null;

  try {
    responseData = await response.json();
  } catch {
    responseData = null;
  }

  if (!response.ok) {
    const message =
      typeof responseData === "object" &&
      responseData !== null &&
      "message" in responseData &&
      typeof responseData.message === "string"
        ? responseData.message
        : `Request gagal dengan status ${response.status}`;

    throw new Error(message);
  }

  if (
    typeof responseData === "object" &&
    responseData !== null &&
    "success" in responseData &&
    responseData.success === false
  ) {
    const message =
      "message" in responseData && typeof responseData.message === "string"
        ? responseData.message
        : "Request gagal diproses.";

    throw new Error(message);
  }

  return responseData as T;
}

export const api = {
  get<T>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) {
    return apiFetch<T>(path, {
      ...options,
      method: "GET",
    });
  },

  post<T>(
    path: string,
    data?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ) {
    const body = data instanceof FormData ? data : JSON.stringify(data ?? {});

    return apiFetch<T>(path, {
      ...options,
      method: "POST",
      body,
    });
  },

  patch<T>(
    path: string,
    data?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ) {
    const body = data instanceof FormData ? data : JSON.stringify(data ?? {});

    return apiFetch<T>(path, {
      ...options,
      method: "PATCH",
      body,
    });
  },

  delete<T>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) {
    return apiFetch<T>(path, {
      ...options,
      method: "DELETE",
    });
  },
};