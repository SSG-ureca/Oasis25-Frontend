import { api } from "./api";
import type { WeatherStatsResponse, PomodoroLogResponse } from "../types/stats";
import type { RetrospectResponse } from "../types/retrospect";

export const getWeatherStats = async (): Promise<WeatherStatsResponse[]> => {
  const response = await api.get<WeatherStatsResponse[]>("/api/stats/weather");
  return response.data;
};

export const getPomodoroLogs = async (date: string): Promise<PomodoroLogResponse[]> => {
  const response = await api.get<PomodoroLogResponse[]>("/api/pomodoro", {
    params: {
      date,
    },
  });
  return response.data;
};

export const getAllDiaries = async (): Promise<RetrospectResponse[]> => {
  const response = await api.get<RetrospectResponse[]>("/api/diaries");
  return response.data;
};
