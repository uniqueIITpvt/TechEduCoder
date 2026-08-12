import type { Options, Store } from "express-rate-limit";
import { redis } from "./redis";

export class RedisRateLimitStore implements Store {
  localKeys = false;
  private windowMs = 60_000;

  init(options: Options) {
    this.windowMs = options.windowMs;
  }

  increment(key: string) {
    return redis.incrementWindow(`rate-limit:${key}`, this.windowMs);
  }

  decrement(key: string) {
    return redis.decrementCounter(`rate-limit:${key}`);
  }

  async resetKey(key: string) {
    await redis.del(`rate-limit:${key}`);
  }
}
