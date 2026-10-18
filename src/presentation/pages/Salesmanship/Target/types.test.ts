import { describe, it, expect } from 'vitest';
import { getHariLabel, JENIS_TARGET_OPTIONS, HARI_KUNJUNGAN_OPTIONS } from './types';

describe('Target Page Types & Helpers', () => {
  it('correctly maps hari number to label', () => {
    expect(getHariLabel(null)).toBe('Semua Hari');
    expect(getHariLabel(undefined)).toBe('Semua Hari');
    expect(getHariLabel(1)).toBe('Senin');
    expect(getHariLabel(2)).toBe('Selasa');
    expect(getHariLabel(3)).toBe('Rabu');
    expect(getHariLabel(4)).toBe('Kamis');
    expect(getHariLabel(5)).toBe('Jumat');
    expect(getHariLabel(6)).toBe('Sabtu');
  });

  it('contains all required jenis target options', () => {
    const values = JENIS_TARGET_OPTIONS.map((o) => o.value);
    expect(values).toContain('KUNJUNGAN');
    expect(values).toContain('BD');
    expect(values).toContain('EC');
    expect(values).toContain('FACEUP');
    expect(values).toContain('VOLUME');
  });

  it('contains full 6-day coverage and Senin - Jumat in hari kunjungan options', () => {
    expect(HARI_KUNJUNGAN_OPTIONS.length).toBe(8); // 1 empty + 1 weekdays + 6 days
    expect(HARI_KUNJUNGAN_OPTIONS[0].value).toBe('');
    expect(HARI_KUNJUNGAN_OPTIONS[1].value).toBe('7');
    expect(HARI_KUNJUNGAN_OPTIONS[1].label).toBe('Senin - Jumat');
    expect(getHariLabel(7)).toBe('Senin - Jumat');
    expect(HARI_KUNJUNGAN_OPTIONS[2].value).toBe('1');
    expect(HARI_KUNJUNGAN_OPTIONS[7].value).toBe('6');
  });
});
