import { api } from "./api";
import { fetchCurrentWeather, type Weather } from "./weatherApi";

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
  elapsedFocusSeconds: number;
  elapsedBreakSeconds: number;
  createdAt: string;
}

export interface PomodoroElapsedRequest {
  elapsedFocusSeconds: number;
  elapsedBreakSeconds: number;
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
  const res = await api.post<PomodoroLogResponse>("/api/pomodoro", body);
  return res.data;
}

export async function updatePomodoroElapsed(
  id: number,
  request: PomodoroElapsedRequest,
): Promise<PomodoroLogResponse> {
  const res = await api.patch<PomodoroLogResponse>(
    `/api/pomodoro/${id}/elapsed`,
    request,
  );
  return res.data;
}

export async function getDailyPomodoroLogs(dateStr: string): Promise<PomodoroLogResponse[]> {
  const res = await api.get<PomodoroLogResponse[]>(`/api/pomodoro?date=${dateStr}`);
  return res.data;
}

export async function completePomodoroLog(
  id: number,
): Promise<PomodoroLogResponse> {
  const res = await api.patch<PomodoroLogResponse>(
    `/api/pomodoro/${id}/complete`,
  );
  return res.data;
}
