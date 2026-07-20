import { useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings,
  Plus,
  X,
} from "lucide-react";
import { Button } from "../common/Button";
import { usePomodoro } from "../../hooks/usePomodoro";
import { MAX_CUSTOM_PRESETS } from "../../types/pomodoro";

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

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <span
        className={
          "px-3 py-1 rounded-full text-sm font-semibold " +
          (mode === "focus"
            ? "bg-pink-90 text-pink-10"
            : "bg-green-90 text-green-10")
        }>
        {mode === "focus" ? "🍅 집중 시간" : "☕ 휴식 시간"}
      </span>

      <span className="text-5xl font-bold tabular-nums">
        {formatTime(remaining)}
      </span>

      <div className="flex gap-2">
        {isRunning ? (
          <Button
            variant="neumorphism"
            onClick={pause}
            className="rounded-full w-12 h-12 p-0">
            <Pause className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            variant="neumorphism"
            onClick={start}
            className="rounded-full w-12 h-12 p-0">
            <Play className="w-5 h-5" />
          </Button>
        )}
        <Button
          variant="neumorphism"
          onClick={reset}
          className="rounded-full w-12 h-12 p-0">
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button
          variant="neumorphism"
          onClick={skip}
          className="rounded-full w-12 h-12 p-0">
          <SkipForward className="w-5 h-5" />
        </Button>
        <Button
          variant="neumorphism"
          onClick={() => setShowSettings((v) => !v)}
          className="rounded-full w-12 h-12 p-0">
          <Settings className="w-5 h-5" />
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
