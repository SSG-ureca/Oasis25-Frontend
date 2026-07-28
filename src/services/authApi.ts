import { api } from "./api";
import type {
  AuthStatusResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth";

export const loginApi = async (
  data: LoginRequest,
): Promise<AuthStatusResponse> => {
  const response = await api.post<AuthStatusResponse>("/api/auth/login", data);
  return response.data;
};

export const logoutApi = async (): Promise<void> => {
  await api.post("/api/auth/logout");
};

export const registerApi = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/api/auth/register", data);
  return response.data;
};

export const reissueApi = async (): Promise<AuthStatusResponse> => {
  const response = await api.post<AuthStatusResponse>("/api/auth/reissue");
  return response.data;
};
