import { Redis } from "ioredis";

require("dotenv").config();

type CacheEntry = {
  value: string;
  expiresAt?: number;
};

class SafeRedisCache {
  private client?: Redis;
  private connectionPromise?: Promise<void>;
  private readonly memory = new Map<string, CacheEntry>();
  private readonly isProduction = process.env.NODE_ENV === "production";
  private warned = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL?.trim();
    const redisDisabled = process.env.REDIS_DISABLED === "true";

    if (this.isProduction && redisDisabled) {
      throw new Error(
        "REDIS_DISABLED cannot be used when NODE_ENV=production. Configure REDIS_URL instead."
      );
    }

    if (this.isProduction && !redisUrl) {
      throw new Error(
        "REDIS_URL is required when NODE_ENV=production. Process-local Redis fallback is disabled."
      );
    }

    if (redisDisabled) {
      this.warnFallback("Redis is disabled. Using in-memory cache.");
      return;
    }

    if (!redisUrl) {
      this.warnFallback("Redis URL not configured. Using in-memory cache.");
      return;
    }

    this.client = new Redis(redisUrl, {
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      retryStrategy: () => null,
    });

    this.client.on("connect", () => {
      console.log("Redis connected");
    });

    this.client.on("error", (error) => {
      const failure = this.createRedisFailure("Redis connection failed", error);

      if (this.isProduction) {
        // EventEmitter listeners must not throw. The awaited cache operation
        // receives the same failure and a later request can reconnect.
        console.error(`${failure.message} No in-memory fallback was used.`);
        return;
      }

      this.warnFallback(`${failure.message} Using in-memory cache.`);
    });
  }

  async get(key: unknown): Promise<string | null> {
    const cacheKey = this.normalizeKey(key);

    if (!cacheKey) {
      return null;
    }

    if (this.client) {
      try {
        const client = await this.getReadyClient();
        const value = await client.get(cacheKey);
        if (value !== null || this.isProduction) {
          return value;
        }
      } catch (error) {
        this.handleRedisFailure("Redis get failed", error);
      }
    }

    this.assertMemoryFallbackAllowed();

    return this.getMemory(cacheKey);
  }

  async set(
    key: unknown,
    value: string,
    expiryMode?: "EX",
    seconds?: number
  ): Promise<"OK"> {
    const cacheKey = this.normalizeKey(key);

    if (!cacheKey) {
      return "OK";
    }

    if (!this.isProduction) {
      this.setMemory(cacheKey, value, expiryMode, seconds);
    }

    if (this.client) {
      try {
        const client = await this.getReadyClient();
        if (expiryMode === "EX" && seconds) {
          await client.set(cacheKey, value, expiryMode, seconds);
        } else {
          await client.set(cacheKey, value);
        }
      } catch (error) {
        this.handleRedisFailure("Redis set failed", error);
      }
    } else {
      this.assertMemoryFallbackAllowed();
    }

    return "OK";
  }

  async del(key: unknown): Promise<number> {
    const cacheKey = this.normalizeKey(key);

    if (!cacheKey) {
      return 0;
    }

    let deleted = 0;
    if (this.client) {
      try {
        const client = await this.getReadyClient();
        deleted = await client.del(cacheKey);
      } catch (error) {
        this.handleRedisFailure("Redis delete failed", error);
      }
    } else {
      this.assertMemoryFallbackAllowed();
    }

    if (!this.isProduction && this.memory.delete(cacheKey)) {
      deleted += 1;
    }

    return deleted;
  }

  async incrementWindow(
    key: string,
    windowMs: number
  ): Promise<{ totalHits: number; resetTime: Date }> {
    const cacheKey = this.normalizeKey(key);
    if (!cacheKey) {
      return { totalHits: 0, resetTime: new Date(Date.now() + windowMs) };
    }

    if (this.client) {
      try {
        const client = await this.getReadyClient();
        const result = (await client.eval(
          `
            local hits = redis.call("INCR", KEYS[1])
            local ttl = redis.call("PTTL", KEYS[1])
            if hits == 1 or ttl < 0 then
              redis.call("PEXPIRE", KEYS[1], ARGV[1])
              ttl = tonumber(ARGV[1])
            end
            return { hits, ttl }
          `,
          1,
          cacheKey,
          windowMs
        )) as [number, number];

        return {
          totalHits: Number(result[0]),
          resetTime: new Date(Date.now() + Math.max(Number(result[1]), 0)),
        };
      } catch (error) {
        this.handleRedisFailure("Redis rate-limit increment failed", error);
      }
    }

    this.assertMemoryFallbackAllowed();
    const entry = this.memory.get(cacheKey);
    const now = Date.now();
    const resetAt =
      entry?.expiresAt && entry.expiresAt > now
        ? entry.expiresAt
        : now + windowMs;
    const totalHits =
      entry?.expiresAt && entry.expiresAt > now
        ? Number.parseInt(entry.value, 10) + 1
        : 1;
    this.memory.set(cacheKey, {
      value: String(totalHits),
      expiresAt: resetAt,
    });

    return { totalHits, resetTime: new Date(resetAt) };
  }

  async decrementCounter(key: string): Promise<void> {
    const cacheKey = this.normalizeKey(key);
    if (!cacheKey) {
      return;
    }

    if (this.client) {
      try {
        const client = await this.getReadyClient();
        await client.eval(
          `
            local value = tonumber(redis.call("GET", KEYS[1]) or "0")
            if value > 0 then redis.call("DECR", KEYS[1]) end
            return 1
          `,
          1,
          cacheKey
        );
        return;
      } catch (error) {
        this.handleRedisFailure("Redis rate-limit decrement failed", error);
      }
    }

    this.assertMemoryFallbackAllowed();
    const entry = this.memory.get(cacheKey);
    if (entry) {
      entry.value = String(Math.max(Number.parseInt(entry.value, 10) - 1, 0));
    }
  }

  private normalizeKey(key: unknown): string | null {
    if (key === undefined || key === null) {
      return null;
    }

    return String(key);
  }

  private getMemory(key: string): string | null {
    const entry = this.memory.get(key);
    if (!entry) {
      return null;
    }

    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.memory.delete(key);
      return null;
    }

    return entry.value;
  }

  private setMemory(key: string, value: string, expiryMode?: "EX", seconds?: number) {
    this.memory.set(key, {
      value,
      expiresAt: expiryMode === "EX" && seconds ? Date.now() + seconds * 1000 : undefined,
    });
  }

  private async getReadyClient(): Promise<Redis> {
    const client = this.client;
    if (!client) {
      this.assertMemoryFallbackAllowed();
      throw new Error("Redis client is not configured.");
    }

    if (client.status === "ready") {
      return client;
    }

    if (!this.connectionPromise) {
      this.connectionPromise = client
        .connect()
        .then(() => undefined)
        .finally(() => {
          this.connectionPromise = undefined;
        });
    }

    await this.connectionPromise;
    return client;
  }

  private handleRedisFailure(context: string, error: unknown): void {
    const failure = this.createRedisFailure(context, error);

    if (this.isProduction) {
      throw failure;
    }

    this.disableRemote();
    this.warnFallback(`${failure.message} Using in-memory cache.`);
  }

  private assertMemoryFallbackAllowed(): void {
    if (!this.isProduction) {
      return;
    }

    throw this.createRedisFailure(
      "Redis is unavailable",
      new Error("Process-local fallback is disabled in production")
    );
  }

  private createRedisFailure(context: string, error: unknown): Error {
    const redisError = error as Error & { code?: string };
    const detail = redisError?.code || redisError?.message || "unknown error";
    const failure = new Error(`${context} (${detail}).`);
    failure.name = "RedisUnavailableError";
    return failure;
  }

  private disableRemote() {
    this.client?.disconnect();
    this.client = undefined;
    this.connectionPromise = undefined;
  }

  private warnFallback(message: string) {
    if (this.warned) {
      return;
    }

    this.warned = true;
    console.warn(message);
  }
}

export const redis = new SafeRedisCache();
