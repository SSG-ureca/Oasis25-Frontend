import { api } from "./api";

export interface WeeklyLogResponse {
  createdAt: string;
  focusMinutes: number;
}

export const getWeeklyLogs = async (): Promise<WeeklyLogResponse[]> => {
  const response = await api.get<WeeklyLogResponse[]>("/api/stats/weekly-logs");
  return response.data;
};
