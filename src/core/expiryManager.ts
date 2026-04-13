export class ExpiryManager {
  private readonly expiresAt = new Map<string, number>();

  setExpiryAt(key: string, timestampMs: number): void {
    this.expiresAt.set(key, timestampMs);
  }

  clearExpiry(key: string): void {
    this.expiresAt.delete(key);
  }

  isExpired(key: string, now = Date.now()): boolean {
    const expiresAt = this.expiresAt.get(key);
    return expiresAt !== undefined && now >= expiresAt;
  }

  getExpiredKeys(now = Date.now()): string[] {
    const expiredKeys: string[] = [];

    for (const [key, expiresAt] of this.expiresAt.entries()) {
      if (now >= expiresAt) {
        expiredKeys.push(key);
      }
    }

    return expiredKeys;
  }
}
