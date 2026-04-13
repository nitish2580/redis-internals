import { ExpiryManager } from './expiryManager';
import { RedisObject } from './redisObject';

export class KeySpace {
  private readonly data = new Map<string, RedisObject<unknown>>();

  constructor(private readonly expiryManager = new ExpiryManager()) {}

  get(key: string): RedisObject<unknown> | null {
    this.evictIfExpired(key);
    return this.data.get(key) ?? null;
  }

  set(key: string, value: RedisObject<unknown>): void {
    this.data.set(key, value);
  }

  setWithExpiry(key: string, value: RedisObject<unknown>, ttlMs: number): void {
    this.data.set(key, value);
    this.expiryManager.setExpiryAt(key, Date.now() + ttlMs);
  }

  delete(key: string): boolean {
    this.expiryManager.clearExpiry(key);
    return this.data.delete(key);
  }

  persist(key: string): boolean {
    const existing = this.data.get(key);

    if (existing === undefined) {
      return false;
    }

    this.expiryManager.clearExpiry(key);
    return true;
  }

  sweepExpiredKeys(): number {
    const expiredKeys = this.expiryManager.getExpiredKeys();

    for (const key of expiredKeys) {
      this.delete(key);
    }

    return expiredKeys.length;
  }

  private evictIfExpired(key: string): void {
    if (this.expiryManager.isExpired(key)) {
      this.delete(key);
    }
  }
}
