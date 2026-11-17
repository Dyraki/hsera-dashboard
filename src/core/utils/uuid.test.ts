import { describe, it, expect, afterEach } from 'vitest';
import { generateUUID } from './uuid';

describe('generateUUID utility', () => {
  const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  it('should generate a valid RFC4122 v4 UUID with default environment', () => {
    const uuid = generateUUID();
    expect(uuid).toBeDefined();
    expect(typeof uuid).toBe('string');
    expect(uuid).toMatch(UUID_V4_REGEX);
  });

  it('should generate unique values across multiple calls', () => {
    const set = new Set<string>();
    for (let i = 0; i < 50; i++) {
      set.add(generateUUID());
    }
    expect(set.size).toBe(50);
  });

  describe('when crypto.randomUUID is undefined (Non-Secure Context / HTTP on LAN)', () => {
    const originalCrypto = globalThis.crypto;

    afterEach(() => {
      // Restore original crypto
      Object.defineProperty(globalThis, 'crypto', {
        value: originalCrypto,
        configurable: true,
        writable: true,
      });
    });

    it('should fallback gracefully when crypto.randomUUID is not a function', () => {
      // Simulate non-secure context where randomUUID is undefined but getRandomValues exists
      Object.defineProperty(globalThis, 'crypto', {
        value: {
          getRandomValues: originalCrypto?.getRandomValues?.bind(originalCrypto),
          randomUUID: undefined,
        },
        configurable: true,
        writable: true,
      });

      const uuid = generateUUID();
      expect(uuid).toBeDefined();
      expect(uuid).toMatch(UUID_V4_REGEX);
    });

    it('should fallback to Math.random when window.crypto is completely unavailable', () => {
      Object.defineProperty(globalThis, 'crypto', {
        value: undefined,
        configurable: true,
        writable: true,
      });

      const uuid = generateUUID();
      expect(uuid).toBeDefined();
      expect(uuid).toMatch(UUID_V4_REGEX);
    });
  });
});
