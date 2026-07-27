import { api } from "./api";
import type { PomodoroPreset, PomodoroSettings } from "../types/pomodoro";

export async function getPresets(): Promise<PomodoroPreset[]> {
  const res = await api.get("/api/pomodoro/presets");
  return res.data;
}

export async function createPreset(
  name: string,
  settings: PomodoroSettings,
): Promise<PomodoroPreset> {
  const res = await api.post("/api/pomodoro/presets", {
    name,
    focusMinutes: settings.focusMinutes,
    breakMinutes: settings.breakMinutes,
  });
  return res.data;
}

export async function updatePreset(
  id: number,
  name: string,
  settings: PomodoroSettings,
): Promise<PomodoroPreset> {
  const res = await api.patch(`/api/pomodoro/presets/${id}`, {
    name,
    focusMinutes: settings.focusMinutes,
    breakMinutes: settings.breakMinutes,
  });
  return res.data;
}

export async function deletePreset(id: number): Promise<void> {
  await api.delete(`/api/pomodoro/presets/${id}`);
}
