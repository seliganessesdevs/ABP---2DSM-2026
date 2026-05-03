import axios from "axios";
import { env } from "@/config/env";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = String(error.config?.url ?? "");
    const isLoginRequest = requestUrl.includes("/auth/login");
    const isAlreadyOnLoginPage = window.location.pathname === "/login";

    if (
      error.response?.status === 401 &&
      !isLoginRequest &&
      !isAlreadyOnLoginPage
    ) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
