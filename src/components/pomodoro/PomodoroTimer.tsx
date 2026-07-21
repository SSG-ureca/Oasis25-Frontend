import { useState } from "react";
import { Clock, ChevronDown, Plus, X } from "lucide-react";
import { Button } from "../common/Button";
import { usePomodoro } from "../../hooks/usePomodoro";
import { MAX_CUSTOM_PRESETS } from "../../types/pomodoro";
import ProgressRing from "./ProgressRing";

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function PomodoroTimer() {
  const {
    mode,
    remaining,
    isRunning,
    settings,
    isLoggedIn,
    presets,
    loadingPresets,
    start,
    pause,
    reset,
    skip,
    updateSettings,
    applyPreset,
    saveCurrentAsPreset,
    removePreset,
  } = usePomodoro();

  const [showSettings, setShowSettings] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");

  const customPresetCount = presets.filter((p) => !p.isDefault).length;
  const canAddPreset = customPresetCount < MAX_CUSTOM_PRESETS;

  const totalMs =
    (mode === "focus" ? settings.focusMinutes : settings.breakMinutes) * 60_000;
  const progress = totalMs > 0 ? remaining / totalMs : 0;
  const isFocus = mode === "focus";

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <button
        type="button"
        onClick={() => setShowSettings((v) => !v)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-30 uppercase tracking-wide">
        <Clock className="w-4 h-4" />
        Pomodoro Timer
        <ChevronDown
          className={`w-4 h-4 transition-transform ${showSettings ? "rotate-180" : ""}`}
        />
      </button>

      <ProgressRing
        progress={progress}
        size={240}
        strokeWidth={10}
        progressClassName={isFocus ? "stroke-primary" : "stroke-green-50"}
        dotClassName={isFocus ? "fill-primary" : "fill-green-50"}>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold tabular-nums text-gray-10">
            {formatTime(remaining)}
          </span>
          <span className="text-sm text-gray-30 mt-1">
            {isFocus ? "집중 세션" : "휴식 세션"}
          </span>
        </div>
      </ProgressRing>

      <div className="flex gap-3">
        <Button
          variant="neumorphism"
          onClick={isRunning ? pause : start}
          className="rounded-full px-6 py-2 text-sm font-semibold text-primary">
          {isRunning ? "일시정지" : "시작"}
        </Button>
        <Button
          variant="neumorphism"
          onClick={skip}
          className="rounded-full px-6 py-2 text-sm font-semibold text-gray-20">
          휴식
        </Button>
        <Button
          variant="neumorphism"
          onClick={reset}
          className="rounded-full px-6 py-2 text-sm font-semibold text-gray-20">
          종료
        </Button>
      </div>

      {showSettings && (
        <div className="flex flex-col gap-3 mt-2 text-sm w-full max-w-md">
          <div className="flex gap-4 justify-center">
            <label className="flex items-center gap-2">
              집중(분)
              <input
                type="number"
                min={1}
                max={120}
                value={settings.focusMinutes}
                onChange={(e) =>
                  updateSettings({ focusMinutes: Number(e.target.value) || 1 })
                }
                className="w-16 px-2 py-1 rounded-md border border-gray-300 text-center"
              />
            </label>
            <label className="flex items-center gap-2">
              휴식(분)
              <input
                type="number"
                min={1}
                max={60}
                value={settings.breakMinutes}
                onChange={(e) =>
                  updateSettings({ breakMinutes: Number(e.target.value) || 1 })
                }
                className="w-16 px-2 py-1 rounded-md border border-gray-300 text-center"
              />
            </label>
          </div>

          {isLoggedIn && (
            <div className="flex flex-col gap-2 border-t border-gray-200 pt-3">
              <span className="font-medium text-gray-700">프리셋</span>
              {loadingPresets ? (
                <span className="text-gray-400">불러오는 중...</span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {presets.map((preset) => (
                    <div
                      key={preset.id}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-xs">
                      <button
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className="hover:underline">
                        {preset.name} ({preset.focusMinutes}/
                        {preset.breakMinutes})
                      </button>
                      {!preset.isDefault && (
                        <button
                          type="button"
                          onClick={() => removePreset(preset.id)}
                          className="text-gray-500 hover:text-red-500"
                          aria-label="프리셋 삭제">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {canAddPreset ? (
                <div className="flex gap-2 items-center justify-center">
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="프리셋 이름"
                    className="px-2 py-1 rounded-md border border-gray-300 text-xs w-32"
                  />
                  <Button
                    variant="neumorphism"
                    onClick={() => {
                      if (!newPresetName.trim()) return;
                      saveCurrentAsPreset(newPresetName.trim());
                      setNewPresetName("");
                    }}
                    className="px-2 py-1 text-xs rounded-md flex items-center gap-1">
                    <Plus className="w-3 h-3" />
                    현재 설정 저장
                  </Button>
                </div>
              ) : (
                <span className="text-xs text-gray-400">
                  커스텀 프리셋은 최대 {MAX_CUSTOM_PRESETS}개까지 저장할 수
                  있습니다.
                </span>
              )}
            </div>
          )}

          {!isLoggedIn && (
            <p className="text-xs text-center text-gray-400">
              프리셋 저장/통계 등은 로그인 후 사용할 수 있습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
