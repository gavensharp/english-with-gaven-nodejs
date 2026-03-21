"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimit = authRateLimit;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const buckets = new Map();
function getClientKey(req) {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const email = typeof req.body?.email === "string" ? req.body.email.toLowerCase() : "";
    return `${ip}:${email}`;
}
function authRateLimit(req, res, next) {
    const now = Date.now();
    const key = getClientKey(req);
    const existing = buckets.get(key);
    if (!existing || now > existing.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
        return next();
    }
    if (existing.count >= MAX_ATTEMPTS) {
        const retryAfterSec = Math.ceil((existing.resetAt - now) / 1000);
        res.setHeader("Retry-After", retryAfterSec.toString());
        return res.status(429).json({
            error: "Too many authentication attempts. Please try again later.",
        });
    }
    existing.count += 1;
    buckets.set(key, existing);
    return next();
}
//# sourceMappingURL=authRateLimit.js.map