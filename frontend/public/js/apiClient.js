const API_BASE_URL = "http://localhost:3000/api/v1";
const DEMO_USER_ID = "user-ihor-123";
async function request(path, options = {}) {
    const url = `${API_BASE_URL}${path}`;
    const headers = {
        "Content-Type": "application/json",
        "X-Demo-UserId": DEMO_USER_ID,
        ...options.headers
    };
    try {
        const response = await fetch(url, { ...options, headers });
        if (response.status === 204) {
            return null;
        }
        const rawText = await response.text();
        let data;
        if (rawText) {
            data = JSON.parse(rawText);
        }
        if (response.ok) {
            return data;
        }
        const errorObj = {
            status: response.status,
            message: data?.error || data?.message || "Помилка API",
            errors: data?.errors
        };
        throw errorObj;
    }
    catch (e) {
        if (!e.status) {
            throw { status: 0, message: "Помилка з'єднання з сервером (CORS або сервер вимкнено)" };
        }
        throw e;
    }
}
export async function getAds() {
    return request("/ads");
}
export async function createAd(dto) {
    return request("/ads", {
        method: "POST",
        body: JSON.stringify(dto)
    });
}
export async function deleteAd(id) {
    return request(`/ads/${id}`, {
        method: "DELETE"
    });
}
