import { API_BASE_URL } from "./config.js";
import type { ApiError, AdDto, CreateAdDto } from "./dtos.js";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд
  
  let response: Response;
  try {
    response = await fetch(url, { ...options, signal: controller.signal });
  } catch (e: any) {
    if (e.name === "AbortError") {
      throw { status: 0, message: "Таймаут", details: "Сервер довго не відповідає" } as ApiError;
    }
    throw {
      status: 0,
      message: "Помилка мережі або CORS",
      details: e?.message ?? String(e),
    } as ApiError;
  } finally {
    clearTimeout(timeoutId);
  }

  // Обробка успішного 204
  if (response.status === 204) {
    return null as unknown as T;
  }

  const rawText = await response.text();
  
  if (response.ok) {
    if (!rawText) return null as unknown as T;
    try {
      return JSON.parse(rawText) as T;
    } catch {
      return rawText as unknown as T;
    }
  }

  // Намагаємось витягнути помилку з бекенду
  let payload: any = null;
  try { payload = rawText ? JSON.parse(rawText) : null; } catch {}

  const err: ApiError = {
    status: response.status,
    message: payload?.title ?? payload?.message ?? "HTTP помилка",
    details: payload?.detail ?? rawText ?? `HTTP ${response.status}`,
    errors: payload?.errors ?? undefined,
  };
  throw err;
}

export async function getAds() {
  return await request<AdDto[]>("/ads", { method: "GET" });
}

export async function createAd(dto: CreateAdDto) {
  return await request<AdDto>("/ads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export async function deleteAd(id: string) {
  return await request<void>(`/ads/${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
}