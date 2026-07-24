import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "../components/common/Toast";
import type {
  PomodoroMode,
  PomodoroPreset,
  PomodoroSettings,
} from "../types/pomodoro";
import {
  createPomodoroLog,
  updatePomodoroElapsed,
  completePomodoroLog,
} from "../services/pomodoroLogApi";
import type { PomodoroElapsedRequest } from "../services/pomodoroLogApi";
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
  sessionId: number | null;
  modeStartAt: number | null;
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
      sessionId: parsed.sessionId ?? null,
      modeStartAt: parsed.modeStartAt ?? null,
    };
  } catch {
    return {
      mode: "focus",
      endAt: null,
      isRunning: false,
      settings: DEFAULT_SETTINGS,
      sessionId: null,
      modeStartAt: null,
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
  const [sessionId, setSessionId] = useState<number | null>(initial.sessionId);

  const intervalRef = useRef<number | null>(null);
  const modeStartAtRef = useRef<number | null>(initial.modeStartAt);

  useEffect(() => {
    saveState({
      mode,
      endAt,
      isRunning,
      settings,
      sessionId,
      modeStartAt: modeStartAtRef.current,
    });
  }, [mode, endAt, isRunning, settings, sessionId]);

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

  const flushElapsed = useCallback(
    async (now: number) => {
      const start = modeStartAtRef.current;
      if (sessionId == null || start == null || endAt == null) return;
      const maxElapsedMs = endAt - start;
      const elapsedMs = Math.min(maxElapsedMs, now - start);
      const seconds = Math.max(0, Math.round(elapsedMs / 1000));
      if (seconds <= 0) return;
      const request: PomodoroElapsedRequest =
        mode === "focus"
          ? { elapsedFocusSeconds: seconds, elapsedBreakSeconds: 0 }
          : { elapsedFocusSeconds: 0, elapsedBreakSeconds: seconds };
      try {
        await updatePomodoroElapsed(sessionId, request);
      } catch {
        toast.error("시간 저장에 실패했습니다.");
      }
    },
    [mode, endAt, sessionId],
  );

  const tick = useCallback(() => {
    if (!endAt) return;
    const now = Date.now();
    const diff = endAt - now;
    if (diff <= 0) {
      void flushElapsed(now);
      if (mode === "focus") {
        toast.success("집중 끝! 휴식하세요 🌿");
        switchMode("break", true);
      } else {
        toast.info("휴식 끝! 다시 집중해볼까요 💪");
        switchMode("focus", true);
      }
      modeStartAtRef.current = Date.now();
    } else {
      setRemaining(diff);
    }
  }, [endAt, mode, switchMode, flushElapsed]);

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

  const start = useCallback(async () => {
    const now = Date.now();
    const duration = remaining > 0 ? remaining : durationFor(mode);
    setEndAt(now + duration);
    setIsRunning(true);
    modeStartAtRef.current = now;
    if (!isLoggedIn() || sessionId != null) return;
    try {
      const log = await createPomodoroLog({
        focusMinutes: settings.focusMinutes,
        breakMinutes: settings.breakMinutes,
      });
      setSessionId(log.id);
    } catch {
      toast.error("세션 생성에 실패했습니다. 타이머는 로컬에서 계속됩니다.");
    }
  }, [remaining, durationFor, mode, sessionId, settings]);

  const pause = useCallback(async () => {
    const now = Date.now();
    await flushElapsed(now);
    const currentRemaining =
      endAt != null ? Math.max(0, endAt - now) : remaining;
    setRemaining(currentRemaining);
    setIsRunning(false);
    setEndAt(null);
    modeStartAtRef.current = null;
  }, [endAt, remaining, flushElapsed]);

  const reset = useCallback(async () => {
    const now = Date.now();
    await flushElapsed(now);
    if (sessionId != null) {
      try {
        await completePomodoroLog(sessionId);
      } catch {
        toast.error("세션 완료 처리에 실패했습니다.");
      }
    }
    setIsRunning(false);
    setEndAt(null);
    setRemaining(durationFor(mode));
    setSessionId(null);
    modeStartAtRef.current = null;
  }, [durationFor, mode, sessionId, flushElapsed]);

  const skip = useCallback(async () => {
    const now = Date.now();
    await flushElapsed(now);
    const nextMode = mode === "focus" ? "break" : "focus";
    switchMode(nextMode, true);
    modeStartAtRef.current = Date.now();
  }, [mode, switchMode, flushElapsed]);

  const applyPreset = useCallback(
    (preset: PomodoroPreset) => {
      if (isRunning) return;
      setSessionId(null);
      modeStartAtRef.current = null;
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
