import axios from 'axios';
import { API_URL } from './environment';
import { AppError } from '../../domain/errors/AppError';

export { API_URL } from './environment';

export const AxiosHttpClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyuntikkan token JWT secara otomatis ke header otorisasi
AxiosHttpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

AxiosHttpClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const originalRequest = error.config as any;

      // Jika response 401 dan bukan dari endpoint auth login/refresh
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/api/auth/login') &&
        !originalRequest.url?.includes('/api/auth/refresh')
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return AxiosHttpClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Melakukan rotasi refresh token otomatis menggunakan HttpOnly Cookie
          const refreshRes = await axios.post(
            `${API_URL}/api/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const newAccessToken = refreshRes.data.accessToken;
          localStorage.setItem('token', newAccessToken);

          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return AxiosHttpClient(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('auth:unauthorized'));
          return Promise.reject(
            new AppError('Sesi Anda telah kedaluwarsa. Silakan masuk kembali.', 401)
          );
        } finally {
          isRefreshing = false;
        }
      }

      const message =
        error.response?.data?.message ||
        (error.response
          ? 'Permintaan ke server gagal.'
          : 'Gagal menghubungi server. Periksa koneksi Anda.');
      return Promise.reject(new AppError(message, error.response?.status, error.code));
    }
    return Promise.reject(
      error instanceof Error ? error : new AppError('Terjadi kesalahan yang tidak diketahui.')
    );
  }
);
