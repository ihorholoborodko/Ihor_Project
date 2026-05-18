export class ApiError extends Error {
    constructor(public status: number, public code: string, message: string, public details: any = null) {
        super(message);
    }
}

export function requireString(value: any, fieldName: string, minLen = 1) {
    if (typeof value !== "string" || value.trim().length < minLen) {
        return { field: fieldName, message: `${fieldName} is required (min ${minLen} chars)` };
    }
    return null;
}