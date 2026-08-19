import rateLimit, { type Options } from "express-rate-limit";

let redisClient: any | undefined;
let redisAvailable = true;

type CreateLimiterOptions = Partial<Omit<Options, "standardHeaders" | "legacyHeaders" | "store">> & {
  redisPrefix: string;
};

function shouldUseRedis() {
  if (process.env.REDIS_ENABLED === "false") {
    return false;
  }

  return Boolean(process.env.REDIS_URL);
}

function getRedisStore(prefix: string) {
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

      redisClient.on("error", (error: Error) => {
        console.error("Rate limit Redis client error:", error.message);
      });

      void redisClient
        .connect()
        .then(() => {
          console.log("✅ Connected to Redis for rate limiting");
        })
        .catch((error: Error) => {
          redisAvailable = false;
          console.error(
            "⚠️  Redis connection failed. Falling back to in-memory rate limiting:",
            error.message,
          );
        });
    }

    return new RedisStore({
      prefix,
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    });
  } catch (error: any) {
    redisAvailable = false;
    console.error(
      "⚠️  Redis rate-limit dependencies are unavailable. Falling back to in-memory rate limiting:",
      error?.message || "Unknown error",
    );
    return undefined;
  }
}

export function createRateLimiter(options: CreateLimiterOptions) {
  const { redisPrefix, ...rateLimitOptions } = options;

  return rateLimit({
    ...rateLimitOptions,
    standardHeaders: true,
    legacyHeaders: false,
    passOnStoreError: true,
    store: getRedisStore(redisPrefix),
  });
}
