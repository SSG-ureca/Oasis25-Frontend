export type {
  PomodoroLogCreateRequest,
  PomodoroLogResponse,
} from "../services/pomodoroLogApi";

export interface WeatherStatsResponse {
  weatherCondition: string;
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  avgFocusMinutes: number;
}
