export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id?: number;
  email: string;
  nickname: string;
  role?: string;
  profileImageUrl?: string | null;
}

export interface AuthStatusResponse {
  expiresIn: number;
  tokenType: string;
  user: User;
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
