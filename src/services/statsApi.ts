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

export interface EmotionStatsResponse {
  date: string;
  emotionScore: number;
}

export const getEmotionStats = async (): Promise<EmotionStatsResponse[]> => {
  const response = await api.get<EmotionStatsResponse[]>("/api/stats/emotions");
  return response.data;
};
export interface FocusTrendResponse {
  date: string;
  totalFocusMinutes: number;
}

export const getFocusTrend = async (): Promise<FocusTrendResponse[]> => {
  const response = await api.get<FocusTrendResponse[]>("/api/stats/trend");
  return response.data;
};
