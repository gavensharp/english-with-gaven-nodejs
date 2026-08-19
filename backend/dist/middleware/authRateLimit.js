"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimit = void 0;
const rateLimit_1 = require("../utils/rateLimit");
exports.authRateLimit = (0, rateLimit_1.createRateLimiter)({
    redisPrefix: "rl:auth:",
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        error: "Too many authentication attempts. Please try again later.",
    },
});
//# sourceMappingURL=authRateLimit.js.map