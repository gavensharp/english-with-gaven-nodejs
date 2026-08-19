"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = createRateLimiter;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
let redisClient;
let redisAvailable = true;
function shouldUseRedis() {
    if (process.env.REDIS_ENABLED === "false") {
        return false;
    }
    return Boolean(process.env.REDIS_URL);
}
function getRedisStore(prefix) {
    if (!shouldUseRedis() || !redisAvailable) {
        return undefined;
    }
    try {
        const { createClient } = require("redis");
        const { RedisStore } = require("rate-limit-redis");
        if (!redisClient) {
            redisClient = createClient({
                url: process.env.REDIS_URL,
            });
            redisClient.on("error", (error) => {
                console.error("Rate limit Redis client error:", error.message);
            });
            void redisClient
                .connect()
                .then(() => {
                console.log("✅ Connected to Redis for rate limiting");
            })
                .catch((error) => {
                redisAvailable = false;
                console.error("⚠️  Redis connection failed. Falling back to in-memory rate limiting:", error.message);
            });
        }
        return new RedisStore({
            prefix,
            sendCommand: (...args) => redisClient.sendCommand(args),
        });
    }
    catch (error) {
        redisAvailable = false;
        console.error("⚠️  Redis rate-limit dependencies are unavailable. Falling back to in-memory rate limiting:", error?.message || "Unknown error");
        return undefined;
    }
}
function createRateLimiter(options) {
    const { redisPrefix, ...rateLimitOptions } = options;
    return (0, express_rate_limit_1.default)({
        ...rateLimitOptions,
        standardHeaders: true,
        legacyHeaders: false,
        passOnStoreError: true,
        store: getRedisStore(redisPrefix),
    });
}
//# sourceMappingURL=rateLimit.js.map