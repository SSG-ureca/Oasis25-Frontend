import { api } from "./api";
import { type WeatherStatsResponse } from "../types/stats";

export interface WeeklyLogResponse {
  createdAt: string;
  focusMinutes: number;
}

export const getWeeklyLogs = async (): Promise<WeeklyLogResponse[]> => {
  const response = await api.get<WeeklyLogResponse[]>("/api/stats/weekly-logs");
  return response.data;
};

export const getWeatherStats = async (): Promise<WeatherStatsResponse[]> => {
  const response = await api.get<WeatherStatsResponse[]>("/api/stats/weather");
  return response.data;
};

