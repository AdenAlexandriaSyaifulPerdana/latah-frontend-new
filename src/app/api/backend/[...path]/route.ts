import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://latah-api.vercel.app/api";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function handler(request: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const backendPath = params.path.join("/");

    const incomingUrl = new URL(request.url);
    const targetUrl = new URL(`${API_BASE_URL}/${backendPath}`);

    incomingUrl.searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });

    const headers = new Headers(request.headers);

    headers.delete("host");
    headers.delete("content-length");
    headers.delete("connection");
    headers.delete("accept-encoding");
    headers.delete("origin");
    headers.delete("referer");
    headers.delete("sec-fetch-site");
    headers.delete("sec-fetch-mode");
    headers.delete("sec-fetch-dest");

    const method = request.method.toUpperCase();

    const body =
      method === "GET" || method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    const response = await fetch(targetUrl.toString(), {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const responseBody = await response.arrayBuffer();

    const responseHeaders = new Headers();
    const contentType = response.headers.get("content-type");

    if (contentType) {
      responseHeaders.set("content-type", contentType);
    }

    return new NextResponse(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("BACKEND PROXY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal menghubungkan frontend dengan backend API.",
      },
      {
        status: 500,
      },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;