import type { AdDto, CreateAdDto, ApiError } from "./dtos.js";

const API_BASE_URL = "http://localhost:3000/api/v1";

const DEMO_USER_ID = "user-ihor-123";


async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${path}`;
    
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        "X-Demo-UserId": DEMO_USER_ID,
        ...options.headers
    };

    try {
        const response = await fetch(url, { ...options, headers });
        
        if (response.status === 204) {
            return null as unknown as T;
        }

        const rawText = await response.text();
        let data;
        if (rawText) {
            data = JSON.parse(rawText);
        }

        if (response.ok) {
            return data as T;
        }

        const errorObj: ApiError = {
            status: response.status,
            message: data?.error || data?.message || "Помилка API",
            errors: data?.errors 
        };
        throw errorObj;

    } catch (e: any) {
        if (!e.status) {
            throw { status: 0, message: "Помилка з'єднання з сервером (CORS або сервер вимкнено)" };
        }
        throw e; 
    }
}


export async function getAds(): Promise<AdDto[]> {
    return request<AdDto[]>("/ads");
}

export async function createAd(dto: CreateAdDto): Promise<AdDto> {
    return request<AdDto>("/ads", {
        method: "POST",
        body: JSON.stringify(dto)
    });
}

export async function deleteAd(id: string): Promise<void> {
    return request<void>(`/ads/${id}`, {
        method: "DELETE"
    });
}