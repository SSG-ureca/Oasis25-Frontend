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

export interface WeatherStatsResponse {
  weatherCondition: string;
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  avgFocusMinutes: number;
}
