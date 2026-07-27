import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Clock, Pencil, Plus, X } from "lucide-react";
import { Button } from "../common/Button";
import { usePomodoro } from "../../hooks/usePomodoro";
import { MAX_CUSTOM_PRESETS } from "../../types/pomodoro";
import type { PomodoroPreset } from "../../types/pomodoro";
import PomodoroOrb from "./PomodoroOrb";
import PomodoroAlarm from "./PomodoroAlarm";
import { Panel } from "../common/Panel";

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// 수정/삭제가 불가능한 기본 프리셋 (백엔드에 저장되지 않는 로컬 항목)
const DEFAULT_PRESET: PomodoroPreset = {
  id: -1,
  name: "POMODORO TIMER",
  focusMinutes: 25,
  breakMinutes: 5,
  isDefault: true,
  createdAt: "",
};

interface PomodoroTimerProps {
  onFocusModeChange?: (isFocusMode: boolean) => void;
}

export default function PomodoroTimer({
  onFocusModeChange,
}: PomodoroTimerProps = {}) {
  const {
    mode,
    remaining,
    isRunning,
    isLoggedIn,
    presets,
    loadingPresets,
    start,
    pause,
    reset,
    skip,
    applyPreset,
    saveCurrentAsPreset,
    removePreset,
    editPreset,
  } = usePomodoro();

  const [selectedPresetName, setSelectedPresetName] = useState(
    DEFAULT_PRESET.name,
  );
  const [manageMenuOpen, setManageMenuOpen] = useState(false);

  const [newPresetName, setNewPresetName] = useState("");
  const [newFocusMinutes, setNewFocusMinutes] = useState(25);
  const [newBreakMinutes, setNewBreakMinutes] = useState(5);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editFocusMinutes, setEditFocusMinutes] = useState(25);
  const [editBreakMinutes, setEditBreakMinutes] = useState(5);
  const [summary, setSummary] = useState<{
    focusSeconds: number;
    breakSeconds: number;
  } | null>(null);

  const manageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        manageMenuRef.current &&
        !manageMenuRef.current.contains(e.target as Node)
      ) {
        setManageMenuOpen(false);
        setEditingId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const customPresets = presets.filter((p) => !p.isDefault);
  const canAddPreset = customPresets.length < MAX_CUSTOM_PRESETS;

  const isFocus = mode === "focus";
  const isFocusMode = isFocus && isRunning;

  useLayoutEffect(() => {
    onFocusModeChange?.(isFocusMode);
  }, [isFocusMode, onFocusModeChange]);

  function handleSelectPreset(preset: PomodoroPreset) {
    if (isRunning) return;
    applyPreset(preset);
    setSelectedPresetName(preset.name);
    setManageMenuOpen(false);
  }

  function startEdit(preset: PomodoroPreset) {
    setEditingId(preset.id);
    setEditName(preset.name);
    setEditFocusMinutes(preset.focusMinutes);
    setEditBreakMinutes(preset.breakMinutes);
  }

  async function handleSaveEdit() {
    if (editingId == null || !editName.trim()) return;
    await editPreset(editingId, editName.trim(), {
      focusMinutes: editFocusMinutes,
      breakMinutes: editBreakMinutes,
    });
    if (selectedPresetName === presets.find((p) => p.id === editingId)?.name) {
      setSelectedPresetName(editName.trim());
    }
    setEditingId(null);
  }

  async function handleRemovePreset(preset: PomodoroPreset) {
    await removePreset(preset.id);
    if (selectedPresetName === preset.name) {
      setSelectedPresetName(DEFAULT_PRESET.name);
    }
  }

  async function handleAddPreset() {
    if (!newPresetName.trim() || !canAddPreset) return;
    await saveCurrentAsPreset(newPresetName.trim(), {
      focusMinutes: newFocusMinutes,
      breakMinutes: newBreakMinutes,
    });
    setNewPresetName("");
    setNewFocusMinutes(25);
    setNewBreakMinutes(5);
  }

  async function handleReset() {
    const totals = await reset();
    setSummary({
      focusSeconds: totals.focusSeconds,
      breakSeconds: totals.breakSeconds,
    });
    setTimeout(() => setSummary(null), 3000);
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div ref={manageMenuRef} className="relative flex items-center gap-2">
        {/* 현재 프리셋 표시 */}
        <Button
          variant="clayFlat"
          type="button"
          onClick={() => setManageMenuOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-semibold text-text-muted uppercase tracking-wide border-none">
          <Clock className="w-4 h-4" />
          {selectedPresetName}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${manageMenuOpen ? "rotate-180" : ""}`}
          />
        </Button>

        <button
          type="button"
          role="switch"
          aria-checked={isFocus}
          aria-label="집중/휴식 모드 전환"
          onClick={() => void skip()}
          className="relative flex h-8 w-28 items-center rounded-full bg-gray-70 p-1 cursor-pointer">
          <span
            className={`flex-1 rounded-full px-2 py-1 text-xs font-semibold text-center transition-colors ${
              isFocus ? "bg-primary text-gray-80" : "text-text-muted"
            }`}>
            집중
          </span>
          <span
            className={`flex-1 rounded-full px-2 py-1 text-xs font-semibold text-center transition-colors ${
              !isFocus ? "bg-primary text-gray-80" : "text-text-muted"
            }`}>
            휴식
          </span>
        </button>

        {manageMenuOpen && (
          <div className="absolute right-0 top-full mt-2 z-30 w-72 rounded-xl border border-gray-100 bg-clay-bg shadow-lg p-3 text-sm">
            <span className="font-medium text-text">프리셋</span>

            <div className="flex flex-col gap-1 mt-2">
              {/* 기본 프리셋 */}
              <Button
                variant="clay"
                type="button"
                disabled={isRunning}
                onClick={() => handleSelectPreset(DEFAULT_PRESET)}
                className={`border-none flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-gray-70 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedPresetName === DEFAULT_PRESET.name
                    ? "text-primary font-semibold"
                    : ""
                }`}>
                <span className="flex items-center gap-2">
                  {selectedPresetName === DEFAULT_PRESET.name && (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  {DEFAULT_PRESET.name}
                </span>
                <span className="text-xs text-text-muted">
                  {DEFAULT_PRESET.focusMinutes}/{DEFAULT_PRESET.breakMinutes}분
                </span>
              </Button>

              {loadingPresets ? (
                <span className="text-text-muted text-xs py-1">
                  불러오는 중...
                </span>
              ) : (
                customPresets.map((preset) =>
                  editingId === preset.id ? (
                    <div
                      key={preset.id}
                      className="flex flex-col gap-1 px-2 py-1.5 rounded-lg border border-gray-100">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2 py-1 rounded-md border border-gray-300 text-xs"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          max={120}
                          value={editFocusMinutes}
                          onChange={(e) =>
                            setEditFocusMinutes(Number(e.target.value) || 1)
                          }
                          className="w-14 px-2 py-1 rounded-md border border-gray-300 text-center text-xs"
                        />
                        <span className="text-xs text-text-muted">/</span>
                        <input
                          type="number"
                          min={1}
                          max={60}
                          value={editBreakMinutes}
                          onChange={(e) =>
                            setEditBreakMinutes(Number(e.target.value) || 1)
                          }
                          className="w-14 px-2 py-1 rounded-md border border-gray-300 text-center text-xs"
                        />
                        <Button
                          variant="clay"
                          type="button"
                          onClick={handleSaveEdit}
                          className="ml-auto text-primary hover:opacity-80"
                          aria-label="프리셋 저장">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="clay"
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-text-muted hover:text-text"
                          aria-label="편집 취소">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={preset.id}
                      className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg">
                      <Button
                        variant="clay"
                        type="button"
                        disabled={isRunning}
                        onClick={() => handleSelectPreset(preset)}
                        className={`border-none flex-1 text-left px-2 py-1.5 rounded-lg text-sm hover:bg-gray-70 disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedPresetName === preset.name
                            ? "text-primary font-semibold"
                            : ""
                        }`}>
                        <span className="flex items-center gap-2">
                          {selectedPresetName === preset.name && (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          {preset.name}
                        </span>
                      </Button>
                      <span className="text-xs text-text-muted">
                        {preset.focusMinutes}/{preset.breakMinutes}분
                      </span>
                      <Button
                        variant="clay"
                        type="button"
                        onClick={() => startEdit(preset)}
                        className="text-text-muted hover:text-primary"
                        aria-label="프리셋 수정">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="clay"
                        type="button"
                        onClick={() => handleRemovePreset(preset)}
                        className="text-text-muted hover:text-red-500"
                        aria-label="프리셋 삭제">
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ),
                )
              )}
            </div>

            {isLoggedIn ? (
              canAddPreset ? (
                <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-gray-100">
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="프리셋 이름"
                    className="px-2 py-1 rounded-md border border-gray-300 text-xs"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={newFocusMinutes}
                      onChange={(e) =>
                        setNewFocusMinutes(Number(e.target.value) || 1)
                      }
                      className="w-14 px-2 py-1 rounded-md border border-gray-300 text-center text-xs"
                    />
                    <span className="text-xs text-text-muted">/</span>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={newBreakMinutes}
                      onChange={(e) =>
                        setNewBreakMinutes(Number(e.target.value) || 1)
                      }
                      className="w-14 px-2 py-1 rounded-md border border-gray-300 text-center text-xs"
                    />
                    <Button
                      variant="clay"
                      onClick={handleAddPreset}
                      className="ml-auto px-2 py-1 text-xs rounded-md flex items-center gap-1">
                      <Plus className="w-3 h-3" />
                      추가
                    </Button>
                  </div>
                </div>
              ) : (
                <span className="block text-xs text-text-muted mt-3 pt-3 border-t border-gray-100">
                  커스텀 프리셋은 최대 {MAX_CUSTOM_PRESETS}개까지 저장할 수
                  있습니다.
                </span>
              )
            ) : (
              <p className="text-xs text-center text-text-muted py-2 mt-2 border-t border-gray-100">
                프리셋 저장/수정은 로그인 후 사용할 수 있습니다.
              </p>
            )}
          </div>
        )}
      </div>

      <PomodoroAlarm mode={mode} />

      {summary &&
        createPortal(
          <Panel
            variant="clay"
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 rounded-2xl px-6 py-4 text-center">
            <p className="text-(--color-text) font-semibold">
              오늘의 총 집중시간 : {formatTime(summary.focusSeconds * 1000)}
            </p>
            <p className="text-(--color-text) mt-1">
              휴식시간 : {formatTime(summary.breakSeconds * 1000)}
            </p>
          </Panel>,
          document.body,
        )}

      <PomodoroOrb
        timeLabel={formatTime(remaining)}
        subLabel={isFocus ? "집중 모드" : "휴식 모드"}
        isFocus={isFocus}
        isRunning={isRunning}
      />

      <div className="flex gap-3">
        <Button
          variant="clay"
          onClick={() => {
            if (isRunning) void pause();
            else void start();
          }}
          className="rounded-full px-6 py-2 text-sm font-semibold text-primary">
          {isRunning ? "일시정지" : "시작"}
        </Button>
        <Button
          variant="clay"
          onClick={() => void handleReset()}
          className="rounded-full px-6 py-2 text-sm font-semibold">
          종료
        </Button>
      </div>
    </div>
  );
}
