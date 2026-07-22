import { api } from "./api";
import type { LoginRequest, LoginResponse } from "../types/auth";

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/api/auth/login", data);
  return response.data;
};

// 로그아웃 API 호출
export const logoutApi = async (refreshToken: string): Promise<void> => {
  await api.post("/api/auth/logout", { refreshToken });
};

