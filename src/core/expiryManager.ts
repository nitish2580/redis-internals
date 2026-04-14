export class ExpiryManager {
  private readonly expiresAt = new Map<string, number>();
  private activeExpireCycleInterval: NodeJS.Timeout | null = null;
  private readonly activeExpireCycleFrequencyMs = 1000;
  private readonly maxKeysPerActiveExpireCycle = 20;
  private readonly ttlArray: string[] = [];
  private readonly keyToIndex = new Map<string, number>();

  setExpiryAt(key: string, timestampMs: number): void {
    if (this.expiresAt.has(key)) {
      this.expiresAt.set(key, timestampMs);
      return;
    }
    this.expiresAt.set(key, timestampMs);
    this.ttlArray.push(key);
    this.keyToIndex.set(key, this.ttlArray.length - 1);
  }

  clearExpiry(key: string): void {
    this.expiresAt.delete(key);
    const index = this.keyToIndex.get(key);
    if (index !== undefined) {
      const lastIndex = this.ttlArray.length - 1;
      const lastKey = this.ttlArray[lastIndex];

      // Swap the key to be removed with the last key in the array
      this.ttlArray[index] = lastKey;
      this.keyToIndex.set(lastKey, index);

      // Remove the last key (which is now the key to be removed)
      this.ttlArray.pop();
      this.keyToIndex.delete(key);
    }
  }

  isExpired(key: string, now = Date.now()): boolean {
    const expiresAt = this.expiresAt.get(key);
    return expiresAt !== undefined && now >= expiresAt;
  }

  start(): void {
    if (this.activeExpireCycleInterval !== null) {
      return;
    }

    this.activeExpireCycleInterval = setInterval(() => {
      this.activeExpireCycle();
    }, this.activeExpireCycleFrequencyMs);
  }

  stop(): void {
    if (!this.activeExpireCycleInterval) return;
    clearInterval(this.activeExpireCycleInterval);
    this.activeExpireCycleInterval = null;
  }

  // getExpiredKeys(now = Date.now()): string[] {
  //     const expiredKeys: string[] = [];

  //     for (const [key, expiresAt] of this.expiresAt.entries()) {
  //         if (now >= expiresAt) {
  //             expiredKeys.push(key);
  //         }
  //     }

  //     return expiredKeys;
  // }

  activeExpireCycle(): void {
    if(this.ttlArray.length === 0) {
      return;
    }
    let checked = 0;
    let expired = 0;
    const now = Date.now();

    while (checked < this.maxKeysPerActiveExpireCycle && expired < this.maxKeysPerActiveExpireCycle) {
      const key = this.ttlArray[Math.floor(Math.random() * this.ttlArray.length)];
      const expiresAt = this.expiresAt.get(key);

      if (expiresAt !== undefined && now >= expiresAt) {
        this.clearExpiry(key);
        expired++;
      }
      checked++;
    }

        // adaptive behavior (very important)
    if (checked > 0 && expired / checked > 0.25) {
      setImmediate(() => this.activeExpireCycle());
    }

  }
}
