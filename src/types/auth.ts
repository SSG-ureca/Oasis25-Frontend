export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  nickname: string;
  role: string;
}

