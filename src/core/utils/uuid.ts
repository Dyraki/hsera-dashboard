/**
 * Utility untuk menghasilkan UUID v4 yang kompatibel di semua konteks browser.
 * 
 * Catatan penting:
 * `crypto.randomUUID()` adalah Web API yang hanya tersedia di Secure Context (HTTPS atau localhost).
 * Ketika aplikasi diakses dari komputer lain melalui jaringan lokal via HTTP (contoh: http://192.168.x.x:5175),
 * browser menonaktifkan `crypto.randomUUID()` (bernilai undefined).
 * Fungsi ini menyediakan fallback otomatis sesuai standar RFC4122 v4 sehingga tidak akan throw error.
 */
export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10xx
    return Array.from(bytes, (b, i) =>
      ([4, 6, 8, 10].includes(i) ? '-' : '') + b.toString(16).padStart(2, '0')
    ).join('');
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

