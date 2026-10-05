import { describe, expect, it } from 'vitest';
import { resolveApiUrl } from './environment';

describe('resolveApiUrl', () => {
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
});