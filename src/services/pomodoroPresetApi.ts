import type { PomodoroPreset, PomodoroSettings } from "../types/pomodoro";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function getToken(): string | null {
  return localStorage.getItem("accessToken");
}

async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response;
}

export async function getPresets(): Promise<PomodoroPreset[]> {
  const res = await fetchWithAuth("/api/pomodoro/presets");
  return res.json();
}

export async function createPreset(
  name: string,
  settings: PomodoroSettings,
): Promise<PomodoroPreset> {
  const res = await fetchWithAuth("/api/pomodoro/presets", {
    method: "POST",
    body: JSON.stringify({
      name,
      focusMinutes: settings.focusMinutes,
      breakMinutes: settings.breakMinutes,
    }),
  });
  return res.json();
}

export async function updatePreset(
  id: number,
  name: string,
  settings: PomodoroSettings,
): Promise<PomodoroPreset> {
  const res = await fetchWithAuth(`/api/pomodoro/presets/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name,
      focusMinutes: settings.focusMinutes,
      breakMinutes: settings.breakMinutes,
    }),
  });
  return res.json();
}

export async function deletePreset(id: number): Promise<void> {
  await fetchWithAuth(`/api/pomodoro/presets/${id}`, { method: "DELETE" });
}
