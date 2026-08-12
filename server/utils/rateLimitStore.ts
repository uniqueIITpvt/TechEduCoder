import type { Options, Store } from "express-rate-limit";
import { redis } from "./redis";

type LocalWindow = {
  totalHits: number;
  resetTime: Date;
};

export class RedisRateLimitStore implements Store {
  localKeys = false;
  private windowMs = 60_000;
  private readonly memory = new Map<string, LocalWindow>();
  private warnedFallback = false;

  init(options: Options) {
    this.windowMs = options.windowMs;
  }

  async increment(key: string) {
    try {
      return await redis.incrementWindow(`rate-limit:${key}`, this.windowMs);
    } catch (error) {
      this.warnRedisFallback(error);
      return this.incrementMemory(key);
    }
  }

  async decrement(key: string) {
    try {
      await redis.decrementCounter(`rate-limit:${key}`);
    } catch (error) {
      this.warnRedisFallback(error);
      this.decrementMemory(key);
    }
  }

  async resetKey(key: string) {
    try {
      await redis.del(`rate-limit:${key}`);
    } catch (error) {
      this.warnRedisFallback(error);
    }

    this.memory.delete(key);
  }

  private incrementMemory(key: string) {
    const now = Date.now();
    const existing = this.memory.get(key);

    if (!existing || existing.resetTime.getTime() <= now) {
      const resetTime = new Date(now + this.windowMs);
      const window = { totalHits: 1, resetTime };
      this.memory.set(key, window);
      return window;
    }

    existing.totalHits += 1;
    return existing;
  }

  private decrementMemory(key: string) {
    const existing = this.memory.get(key);
    if (!existing) {
      return;
    }

    existing.totalHits = Math.max(existing.totalHits - 1, 0);
  }

  private warnRedisFallback(error: unknown) {
    if (this.warnedFallback) {
      return;
    }

    this.warnedFallback = true;
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`Redis rate-limit store unavailable. Using in-memory limiter fallback. ${detail}`);
  }
}
