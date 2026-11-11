import { describe, it, expect } from 'vitest';
import {
  validatePassword,
  generateStrongPassword,
  COMMON_PASSWORDS_BLACKLIST,
} from './passwordSecurity';

describe('International Password Security Standards (NIST & OWASP) Unit Tests', () => {
  it('should reject empty or very short passwords (< 8 chars)', () => {
    const res = validatePassword('Ab1!');
    expect(res.isValid).toBe(false);
    expect(res.score).toBeLessThanOrEqual(1);
    expect(res.errors).toContain('Password harus memiliki minimal 8 karakter.');
  });

  it('should reject passwords missing uppercase letters', () => {
    const res = validatePassword('lowercase123!@#');
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain('Password harus mengandung minimal satu huruf besar (A-Z).');
  });

  it('should reject passwords missing lowercase letters', () => {
    const res = validatePassword('UPPERCASE123!@#');
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain('Password harus mengandung minimal satu huruf kecil (a-z).');
  });

  it('should reject passwords missing numbers', () => {
    const res = validatePassword('PasswordTanpaAngka!@#');
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain('Password harus mengandung minimal satu angka (0-9).');
  });

  it('should reject passwords missing special characters / symbols', () => {
    const res = validatePassword('PasswordTanpaSimbol123');
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain('Password harus mengandung minimal satu simbol/karakter khusus (!@#$%^&*).');
  });

  it('should reject passwords containing the username (case-insensitive)', () => {
    const res = validatePassword('JonoAdmin2026!#', 'jono');
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain('Password tidak boleh mengandung nama username akun.');
  });

  it('should reject common blacklisted passwords', () => {
    for (const common of COMMON_PASSWORDS_BLACKLIST) {
      const res = validatePassword(common);
      expect(res.isValid).toBe(false);
    }
  });

  it('should reject simple repetitive characters like aaaa or 1111', () => {
    const res = validatePassword('Abc1!aaaa');
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain('Password mengandung pola berulang atau berurutan sederhana.');
  });

  it('should accept and score high for a secure international-standard password', () => {
    const res = validatePassword('Kop1Gajah#2026!', 'jono');
    expect(res.isValid).toBe(true);
    expect(res.score).toBeGreaterThanOrEqual(4);
    expect(res.strengthLabel).toMatch(/Kuat|Sangat Kuat/);
    expect(res.errors).toHaveLength(0);
    expect(res.criteria.every((c) => c.met)).toBe(true);
  });

  it('should automatically generate a valid password meeting all NIST/OWASP criteria', () => {
    for (let i = 0; i < 10; i++) {
      const generated = generateStrongPassword(14);
      expect(generated.length).toBe(14);
      const res = validatePassword(generated, 'admin');
      expect(res.isValid).toBe(true);
      expect(res.score).toBeGreaterThanOrEqual(4);
    }
  });
});
