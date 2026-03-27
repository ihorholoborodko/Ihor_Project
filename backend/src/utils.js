class ApiError extends Error {
    constructor(status, code, message, details = null) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

function requireString(value, fieldName, minLen = 1) {
    if (typeof value !== "string" || value.trim().length < minLen) {
        return { field: fieldName, message: `${fieldName} is required (min ${minLen} chars)` };
    }
    return null;
}

module.exports = { ApiError, requireString };