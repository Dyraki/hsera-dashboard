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

  return parsedUrl.toString().replace(/\/$/, '');
};

export const API_URL = resolveApiUrl(import.meta.env.VITE_API_URL);
