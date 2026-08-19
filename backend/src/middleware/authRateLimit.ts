import { createRateLimiter } from "../utils/rateLimit";

export const authRateLimit = createRateLimiter({
  redisPrefix: "rl:auth:",
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: "Too many authentication attempts. Please try again later.",
  },
});
