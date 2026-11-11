/**
 * Password Security Utility
 * Sesuai Standar Internasional NIST SP 800-63B & OWASP ASVS 4.0
 */

export interface PasswordCriterion {
  id: string;
  label: string;
  met: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0 (Sangat Lemah) sampai 5 (Sangat Kuat)
  strengthLabel: 'Sangat Lemah' | 'Lemah' | 'Sedang' | 'Kuat' | 'Sangat Kuat';
  strengthColor: string; // Tailwind color class / hex
  criteria: PasswordCriterion[];
  errors: string[];
}

// Daftar kata sandi umum / pasaran yang dilarang (Common Passwords Blacklist)
export const COMMON_PASSWORDS_BLACKLIST = new Set([
  'password',
  'password123',
  'admin123',
  'administrator',
  '12345678',
  '123456789',
  '1234567890',
  'qwertyuiop',
  'qwerty123',
  'hsera123',
  'indonesia',
  'secret123',
  'welcome123',
  'root1234',
]);

const SPECIAL_CHARS_REGEX = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?~`'"]/;

/**
 * Memeriksa apakah password mengandung karakter berulang/berurutan sederhana
 */
function hasSequentialOrRepeatedPattern(password: string): boolean {
  if (password.length < 4) return false;
  // Cek 4 karakter berulang yang sama persis (misal: aaaa, 1111)
  if (/(.)\1{3,}/.test(password)) return true;

  // Cek urutan alfabetik atau numerik 4 karakter (misal: 1234, abcd)
  const lower = password.toLowerCase();
  for (let i = 0; i <= lower.length - 4; i++) {
    const c1 = lower.charCodeAt(i);
    const c2 = lower.charCodeAt(i + 1);
    const c3 = lower.charCodeAt(i + 2);
    const c4 = lower.charCodeAt(i + 3);
    if (c2 === c1 + 1 && c3 === c2 + 1 && c4 === c3 + 1) return true;
    if (c2 === c1 - 1 && c3 === c2 - 1 && c4 === c3 - 1) return true;
  }

  return false;
}

/**
 * Validasi password komprehensif standar internasional
 */
export function validatePassword(password: string, username?: string): PasswordValidationResult {
  const pwd = password || '';
  const trimmedUser = (username || '').trim().toLowerCase();

  const hasMinLength = pwd.length >= 8;
  const isRecommendedLength = pwd.length >= 10;
  const hasUppercase = /[A-Z]/.test(pwd);
  const hasLowercase = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = SPECIAL_CHARS_REGEX.test(pwd);

  // Tidak boleh mengandung username (case-insensitive) jika username >= 3 karakter
  const isNotUsername =
    trimmedUser.length < 3 || !pwd.toLowerCase().includes(trimmedUser);

  // Bukan kata sandi pasaran
  const isNotCommon = !COMMON_PASSWORDS_BLACKLIST.has(pwd.toLowerCase());

  // Tidak berpola sekuensial sederhana
  const hasNoSequence = !hasSequentialOrRepeatedPattern(pwd);

  // Daftar kriteria untuk UI Checklist
  const criteria: PasswordCriterion[] = [
    {
      id: 'length',
      label: 'Minimal 8 karakter (disarankan ≥ 10 karakter)',
      met: hasMinLength,
    },
    {
      id: 'cases',
      label: 'Mengandung huruf besar (A-Z) dan huruf kecil (a-z)',
      met: hasUppercase && hasLowercase,
    },
    {
      id: 'number',
      label: 'Mengandung minimal 1 angka (0-9)',
      met: hasNumber,
    },
    {
      id: 'special',
      label: 'Mengandung karakter khusus / simbol (!@#$%^&*)',
      met: hasSpecial,
    },
    {
      id: 'context',
      label: 'Tidak mengandung username & bukan kata sandi pasaran',
      met: isNotUsername && isNotCommon && hasNoSequence,
    },
  ];

  const errors: string[] = [];
  if (!hasMinLength) errors.push('Password harus memiliki minimal 8 karakter.');
  if (!hasUppercase) errors.push('Password harus mengandung minimal satu huruf besar (A-Z).');
  if (!hasLowercase) errors.push('Password harus mengandung minimal satu huruf kecil (a-z).');
  if (!hasNumber) errors.push('Password harus mengandung minimal satu angka (0-9).');
  if (!hasSpecial) errors.push('Password harus mengandung minimal satu simbol/karakter khusus (!@#$%^&*).');
  if (!isNotUsername) errors.push('Password tidak boleh mengandung nama username akun.');
  if (!isNotCommon) errors.push('Password terlalu umum dan mudah ditebak, gunakan variasi lain.');
  if (!hasNoSequence) errors.push('Password mengandung pola berulang atau berurutan sederhana.');

  // Kalkulasi Skor Kekuatan (0 - 5)
  let score = 0;
  if (pwd.length === 0) {
    score = 0;
  } else {
    if (hasMinLength) score += 1;
    if (isRecommendedLength) score += 1;
    if (hasUppercase && hasLowercase) score += 1;
    if (hasNumber && hasSpecial) score += 1;
    if (isNotUsername && isNotCommon && hasNoSequence && pwd.length >= 12) score += 1;

    // Penalty jika panjang di bawah 8 karakter, melanggar blacklist, atau mengandung username
    if (!hasMinLength || !isNotCommon || !isNotUsername) {
      score = Math.min(score, 1);
    }
  }

  score = Math.max(0, Math.min(5, score));

  let strengthLabel: PasswordValidationResult['strengthLabel'] = 'Sangat Lemah';
  let strengthColor = '#ef4444'; // red-500

  switch (score) {
    case 0:
    case 1:
      strengthLabel = 'Sangat Lemah';
      strengthColor = '#ef4444'; // red-500
      break;
    case 2:
      strengthLabel = 'Lemah';
      strengthColor = '#f97316'; // orange-500
      break;
    case 3:
      strengthLabel = 'Sedang';
      strengthColor = '#eab308'; // yellow-500
      break;
    case 4:
      strengthLabel = 'Kuat';
      strengthColor = '#10b981'; // emerald-500
      break;
    case 5:
      strengthLabel = 'Sangat Kuat';
      strengthColor = '#059669'; // emerald-600
      break;
  }

  const isValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial &&
    isNotUsername &&
    isNotCommon &&
    hasNoSequence;

  return {
    isValid,
    score,
    strengthLabel,
    strengthColor,
    criteria,
    errors,
  };
}

/**
 * Menghasilkan kata sandi acak yang aman dan memenuhi semua standar NIST/OWASP
 */
export function generateStrongPassword(length = 14): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // tanpa I dan O untuk menghindari kerancuan
  const lower = 'abcdefghijkmnopqrstuvwxyz'; // tanpa l
  const numbers = '23456789'; // tanpa 0 dan 1
  const symbols = '!@#$%^&*_-+=';

  const allChars = upper + lower + numbers + symbols;

  // Pastikan minimal 1 karakter dari masing-masing kategori
  const getRandomChar = (charset: string) => {
    const randomIndex = Math.floor(Math.random() * charset.length);
    return charset[randomIndex];
  };

  const passwordChars: string[] = [
    getRandomChar(upper),
    getRandomChar(lower),
    getRandomChar(numbers),
    getRandomChar(symbols),
  ];

  // Sisa karakter diambil secara acak
  for (let i = 4; i < length; i++) {
    passwordChars.push(getRandomChar(allChars));
  }

  // Acak posisi dengan Fisher-Yates Shuffle
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join('');
}
