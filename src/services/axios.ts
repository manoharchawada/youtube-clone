import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    console.log("Axios Interceptor - Setting Token:", token ? "Token exists (starts with " + token.substring(0, 10) + ")" : "NULL or UNDEFINED");
    if (token) {
      if (typeof config.headers.set === 'function') {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: { resolve: (val: string | null) => void; reject: (err: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.set("Authorization", `Bearer ${token}`);
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken } = useAuthStore.getState();
        if (!refreshToken) throw new Error("No refresh token");

        const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
          refreshToken,
        }, {
          withCredentials: true
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        if (typeof originalRequest.headers.set === 'function') {
          originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
        }
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().logout();
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    const message = (error.response?.data as { message?: string })?.message || error.message;
    toast.error(message);
    return Promise.reject(error);
  }
);
