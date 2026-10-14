import axios from "axios";
import { SALESMANSHIP_API_URL, API_URL } from "./environment";
import { AppError } from "../../domain/errors/AppError";

export const SalesmanshipHttpClient = axios.create({
  baseURL: SALESMANSHIP_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

SalesmanshipHttpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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

SalesmanshipHttpClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const originalRequest = error.config as any;

      // Jika response 401, otomatis refresh token via auth backend
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return SalesmanshipHttpClient(originalRequest);
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
          localStorage.setItem("token", newAccessToken);

          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return SalesmanshipHttpClient(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          localStorage.removeItem("token");
          window.dispatchEvent(new Event("auth:unauthorized"));
          return Promise.reject(
            new AppError("Sesi Anda telah kedaluwarsa. Silakan masuk kembali.", 401)
          );
        } finally {
          isRefreshing = false;
        }
      }

      const message =
        error.response?.data?.message ||
        (error.response
          ? "Permintaan ke server salesmanship gagal."
          : "Gagal menghubungi server salesmanship. Periksa koneksi Anda.");
      return Promise.reject(new AppError(message, error.response?.status, error.code));
    }
    return Promise.reject(
      error instanceof Error ? error : new AppError("Terjadi kesalahan yang tidak diketahui.")
    );
  }
);
