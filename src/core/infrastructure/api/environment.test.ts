import { describe, expect, it, afterEach } from 'vitest';
import { resolveApiUrl } from './environment';

describe('resolveApiUrl', () => {
  afterEach(() => {
    // Reset any global window manipulation
    delete (globalThis as any).window;
  });

  it('uses localhost when no API URL is configured', () => {
    expect(resolveApiUrl()).toBe('http://localhost:5001');
  });

  it('normalizes a valid API URL', () => {
    expect(resolveApiUrl('https://api.example.test/')).toBe('https://api.example.test');
  });

  it('rejects malformed and unsupported API URLs', () => {
    expect(() => resolveApiUrl('api.example.test')).toThrow('absolute URL');
    expect(() => resolveApiUrl('ftp://api.example.test')).toThrow('http or https');
  });

  it('dynamically rewrites localhost to browser hostname when accessed from LAN IP', () => {
    (globalThis as any).window = {
      location: {
        hostname: '192.168.1.4',
      },
    };

    expect(resolveApiUrl('http://localhost:5002')).toBe('http://192.168.1.4:5002');
    expect(resolveApiUrl('http://127.0.0.1:5003')).toBe('http://192.168.1.4:5003');
  });

  it('keeps original hostname when client accesses from localhost', () => {
    (globalThis as any).window = {
      location: {
        hostname: 'localhost',
      },
    };

    expect(resolveApiUrl('http://localhost:5002')).toBe('http://localhost:5002');
  });

  it('preserves remote production domain when accessed from LAN IP', () => {
    (globalThis as any).window = {
      location: {
        hostname: '192.168.1.4',
      },
    };

    expect(resolveApiUrl('https://api.example.com')).toBe('https://api.example.com');
  });
});
