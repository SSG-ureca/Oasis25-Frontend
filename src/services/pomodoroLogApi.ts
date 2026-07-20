import { fetchCurrentWeather, type Weather } from "./weatherApi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export interface PomodoroLogCreateRequest {
  categoryId?: number;
  focusMinutes: number;
  breakMinutes: number;
  weatherCondition?: string;
  temperature?: number;
}

export interface PomodoroLogResponse {
  id: number;
  categoryId?: number;
  categoryName?: string;
  focusMinutes: number;
  breakMinutes: number;
  completed: boolean;
  endTime?: string;
  weatherCondition?: string;
  temperature?: number;
  createdAt: string;
}

function getToken(): string | null {
  return localStorage.getItem("accessToken");
}

async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response;
}

export async function createPomodoroLog(
  request: PomodoroLogCreateRequest,
  weather?: Weather | null,
): Promise<PomodoroLogResponse> {
  const w = weather ?? (await fetchCurrentWeather());
  const body: PomodoroLogCreateRequest = {
    ...request,
    weatherCondition: w?.condition ?? undefined,
    temperature: w?.temperature ?? undefined,
  };
  const res = await fetchWithAuth("/api/pomodoro", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function completePomodoroLog(id: number): Promise<PomodoroLogResponse> {
  const res = await fetchWithAuth(`/api/pomodoro/${id}/complete`, {
    method: "PATCH",
  });
  return res.json();
}
