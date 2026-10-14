const fallbackApiUrl = 'http://localhost:5001';

export const resolveApiUrl = (configuredUrl?: string): string => {
  const value = configuredUrl?.trim() || fallbackApiUrl;
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error(`VITE_API_URL must be an absolute URL. Received: "${value}"`);
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('VITE_API_URL must use http or https.');
  }

  // Jika aplikasi diakses via browser pada host/IP selain localhost (misal: LAN IP 192.168.x.x),
  // dan configuredUrl mengarah ke localhost/127.0.0.1, otomatis sesuaikan hostname API
  // ke hostname yang sedang diakses di browser agar request dari perangkat lain di LAN
  // tidak keliru menghubungi localhost miliknya sendiri.
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const currentHost = window.location.hostname;
    const isLocalhostTarget = parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1';
    const isClientOnDifferentHost = currentHost !== 'localhost' && currentHost !== '127.0.0.1';

    if (isLocalhostTarget && isClientOnDifferentHost) {
      parsedUrl.hostname = currentHost;
    }
  }

  return parsedUrl.toString().replace(/\/$/, '');
};

export const API_URL = resolveApiUrl(import.meta.env.VITE_API_URL);
export const SALESMANSHIP_API_URL = resolveApiUrl(import.meta.env.VITE_SALESMANSHIP_API_URL || 'http://localhost:5003');
