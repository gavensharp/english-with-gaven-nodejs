import { type Options } from "express-rate-limit";
type CreateLimiterOptions = Partial<Omit<Options, "standardHeaders" | "legacyHeaders" | "store">> & {
    redisPrefix: string;
};
export declare function createRateLimiter(options: CreateLimiterOptions): import("express-rate-limit").RateLimitRequestHandler;
export {};
//# sourceMappingURL=rateLimit.d.ts.map