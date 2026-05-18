import { API_BASE_URL } from "./config.js";
async function request(path, options = {}) {
    const url = `${API_BASE_URL}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд
    let response;
    try {
        response = await fetch(url, { ...options, signal: controller.signal });
    }
    catch (e) {
        if (e.name === "AbortError") {
            throw { status: 0, message: "Таймаут", details: "Сервер довго не відповідає" };
        }
        throw {
            status: 0,
            message: "Помилка мережі або CORS",
            details: e?.message ?? String(e),
        };
    }
    finally {
        clearTimeout(timeoutId);
    }
    // Обробка успішного 204
    if (response.status === 204) {
        return null;
    }
    const rawText = await response.text();
    if (response.ok) {
        if (!rawText)
            return null;
        try {
            return JSON.parse(rawText);
        }
        catch {
            return rawText;
        }
    }
    // Намагаємось витягнути помилку з бекенду
    let payload = null;
    try {
        payload = rawText ? JSON.parse(rawText) : null;
    }
    catch { }
    const err = {
        status: response.status,
        message: payload?.title ?? payload?.message ?? "HTTP помилка",
        details: payload?.detail ?? rawText ?? `HTTP ${response.status}`,
        errors: payload?.errors ?? undefined,
    };
    throw err;
}
export async function getAds() {
    return await request("/ads", { method: "GET" });
}
export async function createAd(dto) {
    return await request("/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}
export async function deleteAd(id) {
    return await request(`/ads/${encodeURIComponent(id)}`, {
        method: "DELETE"
    });
}
