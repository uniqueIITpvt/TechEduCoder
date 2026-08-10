import { Redis } from "ioredis";

require("dotenv").config();

type CacheEntry = {
  value: string;
  expiresAt?: number;
};

class SafeRedisCache {
  private client?: Redis;
  private readonly memory = new Map<string, CacheEntry>();
  private warned = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL?.trim();

    if (!redisUrl || process.env.REDIS_DISABLED === "true") {
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
      const redisError = error as Error & { code?: string };
      this.warnFallback(`Redis unavailable (${redisError.code || redisError.message}). Using in-memory cache.`);
      this.disableRemote();
    });
  }

  async get(key: unknown): Promise<string | null> {
    const cacheKey = this.normalizeKey(key);

    if (!cacheKey) {
      return null;
    }

    if (this.client) {
      try {
        const value = await this.client.get(cacheKey);
        if (value !== null) {
          return value;
        }
      } catch (error: any) {
        this.warnFallback(`Redis get failed (${error.code || error.message}). Using in-memory cache.`);
        this.disableRemote();
      }
    }

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

    this.setMemory(cacheKey, value, expiryMode, seconds);

    if (this.client) {
      try {
        if (expiryMode === "EX" && seconds) {
          await this.client.set(cacheKey, value, expiryMode, seconds);
        } else {
          await this.client.set(cacheKey, value);
        }
      } catch (error: any) {
        this.warnFallback(`Redis set failed (${error.code || error.message}). Using in-memory cache.`);
        this.disableRemote();
      }
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
        deleted = await this.client.del(cacheKey);
      } catch (error: any) {
        this.warnFallback(`Redis del failed (${error.code || error.message}). Using in-memory cache.`);
        this.disableRemote();
      }
    }

    if (this.memory.delete(cacheKey)) {
      deleted += 1;
    }

    return deleted;
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

  private disableRemote() {
    this.client?.disconnect();
    this.client = undefined;
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
