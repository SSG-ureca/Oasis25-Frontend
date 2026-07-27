import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API 요청 시 자동으로 Access Token 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 토큰 재발급 진행 중 상태 표시 및 대기 대기열
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 401 Unauthorized 에러 시 토큰 재발급 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 혹은 403 에러가 발생했고 로그인/회원가입 요청이 아니며 기존 재시도한 요청이 아닌 경우
    const isAuthRequest = originalRequest.url?.includes("/api/auth/login") || originalRequest.url?.includes("/api/auth/register");
    if ((error.response?.status === 401 || error.response?.status === 403) && !isAuthRequest && !originalRequest._retry) {
      // 재발급 요청 자체가 실패한 경우 리프레시 토큰 만료로 판단하고 로그아웃 처리
      if (originalRequest.url === "/api/auth/reissue") {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // 동시 다발적인 401 에러(예: Promise.all) 발생 시, 
      // 이미 다른 요청이 토큰을 갱신했는지 확인 (로컬스토리지의 토큰과 요청에 사용된 토큰 비교)
      const currentAccessToken = localStorage.getItem("accessToken");
      if (currentAccessToken && originalRequest.headers.Authorization !== `Bearer ${currentAccessToken}`) {
        // 이미 갱신된 토큰이 있다면 굳이 재발급하지 않고 새 토큰으로 바로 재시도
        originalRequest.headers.Authorization = `Bearer ${currentAccessToken}`;
        return api(originalRequest);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      const isGuest = localStorage.getItem("isGuest") === "true";

      if (!refreshToken) {
        if (!isGuest) {
          localStorage.clear();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        // Axios 기본 인스턴스를 통해 직접 재발급 API 호출
        const response = await axios.post(`${BASE_URL}/api/auth/reissue`, {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (reissueError) {
        processQueue(reissueError, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(reissueError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
