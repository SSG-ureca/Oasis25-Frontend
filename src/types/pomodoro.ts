export type PomodoroMode = "focus" | "break";

export interface PomodoroSettings {
  focusMinutes: number;
  breakMinutes: number;
}

export interface PomodoroPreset {
  id: number;
  name: string;
  focusMinutes: number;
  breakMinutes: number;
  isDefault: boolean;
  createdAt: string;
}

export const MAX_CUSTOM_PRESETS = 2;

// state: { mode, endAt (timestamp), isRunning, settings }
// localStorage에 endAt/mode 저장 -> 새로고침/재접속해도 이어짐
