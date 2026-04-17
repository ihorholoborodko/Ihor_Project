const { ApiError } = require("../utils");

function errorHandler(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            error: { code: err.code, message: err.message, details: err.details }
        });
    }

    const msg = String(err && err.message ? err.message : err);
    
    if (msg.includes("UNIQUE constraint failed")) {
        return res.status(409).json({ error: { code: "CONFLICT", message: "Unique constraint violation" } });
    }
    if (msg.includes("NOT NULL constraint failed")) {
        return res.status(400).json({ error: { code: "BAD_REQUEST", message: "Invalid data format for DB" } });
    }

    console.error("Unhandled error:", err);
    return res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
}

module.exports = { errorHandler };