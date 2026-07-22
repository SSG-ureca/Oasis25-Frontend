import { api } from "./api";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types/auth";

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/api/auth/login", data);
  return response.data;
};

// 로그아웃 API 호출
export const logoutApi = async (refreshToken: string): Promise<void> => {
  await api.post("/api/auth/logout", { refreshToken });
};

// 회원가입 API 호출
export const registerApi = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/api/auth/register", data);
  return response.data;
};


