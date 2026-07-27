import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 재발급 진행 중 상태 및 대기 대기열
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null);
    }
  });
  failedQueue = [];
};

// 401 Unauthorized 에러 시 토큰 재발급 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRequest =
      originalRequest.url?.includes("/api/auth/login") ||
      originalRequest.url?.includes("/api/auth/register");
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !isAuthRequest &&
      !originalRequest._retry
    ) {
      // 재발급 요청 자체가 실패한 경우 리프레시 토큰 만료로 판단하고 로그인 화면으로
      if (originalRequest.url === "/api/auth/reissue") {
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/api/auth/reissue");

        processQueue(null);
        return api(originalRequest);
      } catch (reissueError) {
        processQueue(reissueError);
        if (!(originalRequest as any).__noRedirect) {
          window.location.href = "/login";
        }
        return Promise.reject(reissueError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
