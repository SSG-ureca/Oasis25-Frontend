import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
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

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  breakMinutes: 5,
};

const TODAY_TOTALS_KEY = "pomodoro-today-totals";

// [동작 설정] 추후 조정 지점
// true로 바꾸면 토글 스위치로 모드 전환 시 타이머가 바로 시작됩니다.
const AUTO_START_ON_MANUAL_SWITCH = false;
// true로 바꾸면 타이머 종료 시 반대 모드로 자동 전환 + 자동 시작됩니다.
const AUTO_SWITCH_ON_COMPLETE = false;

interface TodayTotals {
  date: string;
  focusSeconds: number;
  breakSeconds: number;
}

function getTodayKey() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}

function loadTodayTotals(): TodayTotals {
  try {
    const raw = localStorage.getItem(TODAY_TOTALS_KEY);
    if (!raw) throw new Error("no stored totals");
    const parsed = JSON.parse(raw) as Partial<TodayTotals>;
    if (parsed.date !== getTodayKey()) throw new Error("stale date");
    return {
      date: parsed.date ?? getTodayKey(),
      focusSeconds: parsed.focusSeconds ?? 0,
      breakSeconds: parsed.breakSeconds ?? 0,
    };
  } catch {
    return { date: getTodayKey(), focusSeconds: 0, breakSeconds: 0 };
  }
}

interface StoredState {
  mode: PomodoroMode;
  endAt: number | null;
  isRunning: boolean;
  settings: PomodoroSettings;
  sessionId: number | null;
  modeStartAt: number | null;
  remaining?: number | null;
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
      remaining: parsed.remaining ?? null,
    };
  } catch {
    return {
      mode: "focus",
      endAt: null,
      isRunning: false,
      settings: DEFAULT_SETTINGS,
      sessionId: null,
      modeStartAt: null,
      remaining: null,
    };
  }
}

function saveState(state: StoredState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function usePomodoro() {
  const { isAuthenticated } = useAuth();
  const initial = loadStoredState();

  const [mode, setMode] = useState<PomodoroMode>(initial.mode);
  const [endAt, setEndAt] = useState<number | null>(initial.endAt);
  const [isRunning, setIsRunning] = useState<boolean>(initial.isRunning);
  const [settings, setSettings] = useState<PomodoroSettings>(initial.settings);
  const [remaining, setRemaining] = useState<number>(() => {
    if (initial.endAt && initial.isRunning) {
      return Math.max(0, initial.endAt - Date.now());
    }
    if (initial.remaining != null && initial.remaining > 0) {
      return initial.remaining;
    }
    return (
      (initial.mode === "focus"
        ? initial.settings.focusMinutes
        : initial.settings.breakMinutes) * 60_000
    );
  });

  const [presets, setPresets] = useState<PomodoroPreset[]>([]);
  const [loadingPresets, setLoadingPresets] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(initial.sessionId);
  const [completedAt, setCompletedAt] = useState<number | null>(null);

  const intervalRef = useRef<number | null>(null);
  const modeStartAtRef = useRef<number | null>(initial.modeStartAt);
  const todayTotalsRef = useRef<TodayTotals>(loadTodayTotals());

  /* remaining은 1초마다 변하므로 의도적으로 의존성에서 제외; pause/언마운트 시 isRunning 변경으로 저장 */
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    saveState({
      mode,
      endAt,
      isRunning,
      settings,
      sessionId,
      modeStartAt: modeStartAtRef.current,
      remaining: isRunning ? null : remaining,
    });
  }, [mode, endAt, isRunning, settings, sessionId]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const loadPresets = useCallback(async () => {
    if (!isAuthenticated) {
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
  }, [isAuthenticated]);

  useEffect(() => {
    // eslint-disable-next-line -- 마운트 시 프리셋 불러오기는 의도된 useEffect 사용
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
      if (start == null || endAt == null) return;
      const maxElapsedMs = endAt - start;
      const elapsedMs = Math.min(maxElapsedMs, now - start);
      const seconds = Math.max(0, Math.round(elapsedMs / 1000));
      if (seconds <= 0) return;

      const today = getTodayKey();
      const base =
        todayTotalsRef.current.date === today
          ? { ...todayTotalsRef.current }
          : { date: today, focusSeconds: 0, breakSeconds: 0 };
      if (mode === "focus") {
        base.focusSeconds += seconds;
      } else {
        base.breakSeconds += seconds;
      }
      todayTotalsRef.current = base;
      localStorage.setItem(TODAY_TOTALS_KEY, JSON.stringify(base));
      window.dispatchEvent(new Event("pomodoro-today-totals-updated"));

      if (!isAuthenticated || sessionId == null) return;
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
    [mode, endAt, sessionId, isAuthenticated],
  );

  const tick = useCallback(() => {
    if (!endAt) return;
    const now = Date.now();
    const diff = endAt - now;
    if (diff <= 0) {
      void flushElapsed(now);
      if (mode === "focus") {
        toast.success("집중 끝! 휴식하세요 🌿");
      } else {
        toast.info("휴식 끝! 다시 집중해볼까요 💪");
      }

      setCompletedAt(Date.now());

      if (AUTO_SWITCH_ON_COMPLETE) {
        switchMode(mode === "focus" ? "break" : "focus", true);
        modeStartAtRef.current = Date.now();
      } else {
        // 자동 전환 없이 현재 모드에서 정지 (다음 세션은 사용자가 직접 시작)
        setIsRunning(false);
        setEndAt(null);
        setRemaining(durationFor(mode));
        modeStartAtRef.current = null;
      }
    } else {
      setRemaining(diff);
    }
  }, [endAt, mode, switchMode, flushElapsed, durationFor]);

  // 최신 상태/콜백을 unmount cleanup에서 참조하기 위한 ref
  const runningStateRef = useRef({
    isRunning,
    endAt,
    remaining,
    mode,
    settings,
    sessionId,
  });
  useEffect(() => {
    runningStateRef.current = {
      isRunning,
      endAt,
      remaining,
      mode,
      settings,
      sessionId,
    };
  }, [isRunning, endAt, remaining, mode, settings, sessionId]);

  const flushElapsedRef = useRef(flushElapsed);
  useEffect(() => {
    flushElapsedRef.current = flushElapsed;
  }, [flushElapsed]);

  // interval 관리
  useEffect(() => {
    if (!isRunning || !endAt) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = window.setInterval(tick, 1000);
    // 마운트/복귀 직후 endAt이 이미 지난 경우 다음 tick에서 자동 전환이 처리되도록 스케줄
    if (endAt <= Date.now()) {
      window.setTimeout(tick, 0);
    }
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
    if (!isAuthenticated || sessionId != null) return;
    try {
      const log = await createPomodoroLog({
        focusMinutes: settings.focusMinutes,
        breakMinutes: settings.breakMinutes,
      });
      setSessionId(log.id);
    } catch {
      toast.error("세션 생성에 실패했습니다. 타이머는 로컬에서 계속됩니다.");
    }
  }, [remaining, durationFor, mode, sessionId, settings, isAuthenticated]);

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
    if (isAuthenticated && sessionId != null) {
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
    return todayTotalsRef.current;
  }, [durationFor, mode, sessionId, flushElapsed, isAuthenticated]);

  const skip = useCallback(async () => {
    const now = Date.now();
    await flushElapsed(now);
    const nextMode = mode === "focus" ? "break" : "focus";
    switchMode(nextMode, AUTO_START_ON_MANUAL_SWITCH);
    modeStartAtRef.current = AUTO_START_ON_MANUAL_SWITCH ? Date.now() : null;
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
      setRemaining(
        (mode === "focus" ? preset.focusMinutes : preset.breakMinutes) * 60_000,
      );
    },
    [isRunning, mode],
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
      if (!isAuthenticated) {
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
    [isAuthenticated, settings],
  );

  const removePreset = useCallback(
    async (id: number) => {
      if (!isAuthenticated) return;
      try {
        await deletePreset(id);
        setPresets((prev) => prev.filter((p) => p.id !== id));
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : "프리셋 삭제에 실패했습니다.",
        );
      }
    },
    [isAuthenticated],
  );

  const editPreset = useCallback(
    async (id: number, name: string, next: PomodoroSettings) => {
      if (!isAuthenticated) return;
      try {
        const updated = await updatePreset(id, name, next);
        setPresets((prev) => prev.map((p) => (p.id === id ? updated : p)));
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : "프리셋 수정에 실패했습니다.",
        );
      }
    },
    [isAuthenticated],
  );

  // 언마운트(로그인 페이지 강제 이동 등) 시 타이머를 일시정지하고 저장
  useEffect(() => {
    return () => {
      const state = runningStateRef.current;
      if (!state.isRunning) return;
      const now = Date.now();
      const currentRemaining =
        state.endAt != null ? Math.max(0, state.endAt - now) : state.remaining;
      void flushElapsedRef.current(now);
      saveState({
        mode: state.mode,
        endAt: null,
        isRunning: false,
        settings: state.settings,
        sessionId: state.sessionId,
        modeStartAt: null,
        remaining: currentRemaining,
      });
    };
  }, []);

  return {
    mode,
    remaining,
    isRunning,
    settings,
    presets,
    loadingPresets,
    isLoggedIn: isAuthenticated,
    completedAt,
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
