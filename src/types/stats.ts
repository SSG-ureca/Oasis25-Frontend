export type {
  PomodoroLogCreateRequest,
  PomodoroLogResponse,
} from "../services/pomodoroLogApi";

export interface WeatherStatsResponse {
  weatherCondition: string;
  avgFocusMinutes: number;
}
