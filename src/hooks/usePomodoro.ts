import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "../components/common/Toast";
import type {
  PomodoroMode,
  PomodoroPreset,
  PomodoroSettings,
} from "../types/pomodoro";
import {
  createPreset,
  deletePreset,
  getPresets,
  updatePreset,
} from "../services/pomodoroPresetApi";

const STORAGE_KEY = "pomodoro-state";
const TOKEN_KEY = "accessToken";

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  breakMinutes: 5,
};

interface StoredState {
  mode: PomodoroMode;
  endAt: number | null;
  isRunning: boolean;
  settings: PomodoroSettings;
}

function isLoggedIn(): boolean {
  return typeof window !== "undefined" && !!localStorage.getItem(TOKEN_KEY);
}

function loadStoredState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("no stored state");
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      mode: parsed.mode ?? "focus",
      endAt: parsed.endAt ?? null,
      isRunning: parsed.isRunning ?? false,
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
    };
  } catch {
    return {
      mode: "focus",
      endAt: null,
      isRunning: false,
      settings: DEFAULT_SETTINGS,
    };
  }
}

function saveState(state: StoredState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function usePomodoro() {
  const initial = loadStoredState();

  const [mode, setMode] = useState<PomodoroMode>(initial.mode);
  const [endAt, setEndAt] = useState<number | null>(initial.endAt);
  const [isRunning, setIsRunning] = useState<boolean>(initial.isRunning);
  const [settings, setSettings] = useState<PomodoroSettings>(initial.settings);
  const [remaining, setRemaining] = useState<number>(() => {
    if (initial.endAt && initial.isRunning) {
      return Math.max(0, initial.endAt - Date.now());
    }
    return initial.settings.focusMinutes * 60_000;
  });

  const [presets, setPresets] = useState<PomodoroPreset[]>([]);
  const [loadingPresets, setLoadingPresets] = useState(false);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    saveState({ mode, endAt, isRunning, settings });
  }, [mode, endAt, isRunning, settings]);

  const loadPresets = useCallback(async () => {
    if (!isLoggedIn()) {
      setPresets([]);
      return;
    }
    setLoadingPresets(true);
    try {
      const data = await getPresets();
      setPresets(data);
    } catch {
      // 비로그인/네트워크 오류 시 프리셋 없이 타이머만 사용 가능
      setPresets([]);
    } finally {
      setLoadingPresets(false);
    }
  }, []);

  useEffect(() => {
    loadPresets();
  }, [loadPresets]);

  const durationFor = useCallback(
    (m: PomodoroMode) =>
      (m === "focus" ? settings.focusMinutes : settings.breakMinutes) * 60_000,
    [settings],
  );

  const switchMode = useCallback(
    (nextMode: PomodoroMode, autoStart: boolean) => {
      const duration = durationFor(nextMode);
      setMode(nextMode);
      setRemaining(duration);
      if (autoStart) {
        setEndAt(Date.now() + duration);
        setIsRunning(true);
      } else {
        setEndAt(null);
        setIsRunning(false);
      }
    },
    [durationFor],
  );

  const tick = useCallback(() => {
    if (!endAt) return;
    const diff = endAt - Date.now();
    if (diff <= 0) {
      if (mode === "focus") {
        toast.success("집중 끝! 휴식하세요 🌿");
        switchMode("break", true);
      } else {
        toast.info("휴식 끝! 다시 집중해볼까요 💪");
        switchMode("focus", true);
      }
    } else {
      setRemaining(diff);
    }
  }, [endAt, mode, switchMode]);

  // interval 관리
  useEffect(() => {
    if (!isRunning || !endAt) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    tick();
    intervalRef.current = window.setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isRunning, endAt, tick]);

  // 탭 복귀 시 즉시 재계산 (백그라운드 throttle 보정)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [tick]);

  const start = useCallback(() => {
    const duration = remaining > 0 ? remaining : durationFor(mode);
    setEndAt(Date.now() + duration);
    setIsRunning(true);
  }, [remaining, durationFor, mode]);

  const pause = useCallback(() => {
    setIsRunning(false);
    setEndAt(null);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setEndAt(null);
    setRemaining(durationFor(mode));
  }, [durationFor, mode]);

  const skip = useCallback(() => {
    switchMode(mode === "focus" ? "break" : "focus", true);
  }, [mode, switchMode]);

  const applyPreset = useCallback(
    (preset: PomodoroPreset) => {
      if (isRunning) return;
      setSettings({
        focusMinutes: preset.focusMinutes,
        breakMinutes: preset.breakMinutes,
      });
      setRemaining(preset.focusMinutes * 60_000);
    },
    [isRunning],
  );

  const updateSettings = useCallback(
    (next: Partial<PomodoroSettings>) => {
      setSettings((prev) => {
        const merged = { ...prev, ...next };
        if (!isRunning) {
          setRemaining(
            merged[mode === "focus" ? "focusMinutes" : "breakMinutes"] * 60_000,
          );
        }
        return merged;
      });
    },
    [isRunning, mode],
  );

  const saveCurrentAsPreset = useCallback(
    async (name: string, settingsOverride?: PomodoroSettings) => {
      if (!isLoggedIn()) {
        toast.error("프리셋 저장은 로그인 후 사용할 수 있습니다.");
        return;
      }
      try {
        const created = await createPreset(name, settingsOverride ?? settings);
        setPresets((prev) => [...prev, created]);
        toast.success("프리셋이 저장되었습니다.");
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : "프리셋 저장에 실패했습니다.",
        );
      }
    },
    [settings],
  );

  const removePreset = useCallback(async (id: number) => {
    if (!isLoggedIn()) return;
    try {
      await deletePreset(id);
      setPresets((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "프리셋 삭제에 실패했습니다.",
      );
    }
  }, []);

  const editPreset = useCallback(
    async (id: number, name: string, next: PomodoroSettings) => {
      if (!isLoggedIn()) return;
      try {
        const updated = await updatePreset(id, name, next);
        setPresets((prev) => prev.map((p) => (p.id === id ? updated : p)));
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : "프리셋 수정에 실패했습니다.",
        );
      }
    },
    [],
  );

  return {
    mode,
    remaining,
    isRunning,
    settings,
    presets,
    loadingPresets,
    isLoggedIn: isLoggedIn(),
    start,
    pause,
    reset,
    skip,
    applyPreset,
    updateSettings,
    saveCurrentAsPreset,
    removePreset,
    editPreset,
    refreshPresets: loadPresets,
  };
}
