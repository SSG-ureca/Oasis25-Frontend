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
import { cn } from "../../utils/cn";
import { clayVariants } from "../../types/clayVariants";

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
    <div className="flex flex-col w-full h-full relative">
      {/* 상단 컨트롤 영역 (프리셋, 모드 토글) */}
      <div className="flex items-center justify-center w-full relative z-30 h-[38px]">
        <div ref={manageMenuRef} className="relative flex flex-col items-center">
          {/* 현재 프리셋 표시 */}
          <Button
            id="tour-preset"
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

          {/* 프리셋 관리 메뉴 (글래스 모피즘) */}
          {manageMenuOpen && (
            <div className="absolute top-full mt-3 z-40 w-72 md:w-80 rounded-2xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-4 text-sm backdrop-blur-xl bg-[#e8e2d3]/85 dark:bg-[#342e27]/85">
              <span className="font-bold text-text mb-3 block px-1">프리셋 설정</span>

              <div className="flex flex-col gap-1.5">
              {/* 기본 프리셋 */}
              <div title={isRunning ? "타이머가 실행 중일 때는 프리셋을 변경할 수 없습니다" : undefined}>
                <button
                  type="button"
                  disabled={isRunning}
                  onClick={() => handleSelectPreset(DEFAULT_PRESET)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedPresetName === DEFAULT_PRESET.name
                      ? "bg-black/5 dark:bg-white/10 font-bold"
                      : "text-text hover:bg-black/5 dark:hover:bg-white/5"
                  }`}>
                  <span className="flex items-center gap-2">
                    {selectedPresetName === DEFAULT_PRESET.name && (
                      <Check className="w-4 h-4 text-text" />
                    )}
                    {DEFAULT_PRESET.name}
                  </span>
                  <span className={`text-xs font-medium ${selectedPresetName === DEFAULT_PRESET.name ? "text-text" : "text-text-muted"}`}>
                    {DEFAULT_PRESET.focusMinutes}/{DEFAULT_PRESET.breakMinutes}분
                  </span>
                </button>
              </div>

              {loadingPresets ? (
                <span className="text-text-muted text-xs py-1">
                  불러오는 중...
                </span>
              ) : (
                customPresets.map((preset) =>
                  editingId === preset.id ? (
                    <div
                      key={preset.id}
                      className="flex flex-col gap-2 p-3 rounded-xl border border-white/20 bg-white/40 dark:bg-black/20 shadow-sm backdrop-blur-sm">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-white/30 bg-white/60 dark:bg-black/40 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-text-muted/50"
                        placeholder="프리셋 이름"
                      />
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white/60 dark:bg-black/40 rounded-lg px-2 py-1 border border-white/30">
                          <input
                            type="number"
                            min={1}
                            max={120}
                            value={editFocusMinutes}
                            onChange={(e) =>
                              setEditFocusMinutes(Number(e.target.value) || 1)
                            }
                            className="w-12 bg-transparent text-center text-sm outline-none font-medium"
                          />
                          <span className="text-xs text-text-muted/60 font-bold">/</span>
                          <input
                            type="number"
                            min={1}
                            max={60}
                            value={editBreakMinutes}
                            onChange={(e) =>
                              setEditBreakMinutes(Number(e.target.value) || 1)
                            }
                            className="w-12 bg-transparent text-center text-sm outline-none font-medium"
                          />
                        </div>
                        <div className="flex gap-1 ml-auto">
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="p-1.5 rounded-lg bg-black/10 dark:bg-white/10 text-text hover:bg-black/20 dark:hover:bg-white/20 transition-colors shadow-sm"
                            aria-label="프리셋 저장">
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-text hover:bg-black/15 dark:hover:bg-white/15 transition-colors"
                            aria-label="편집 취소">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={preset.id}
                      title={isRunning ? "타이머가 실행 중일 때는 프리셋을 변경할 수 없습니다" : undefined}
                      className={`flex items-center justify-between gap-2 px-1 py-1 rounded-xl transition-all duration-200 ${
                        selectedPresetName === preset.name
                          ? "bg-black/5 dark:bg-white/10"
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                      }`}>
                      <button
                        type="button"
                        disabled={isRunning}
                        onClick={() => handleSelectPreset(preset)}
                        className={`flex-1 text-left px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedPresetName === preset.name
                            ? "font-bold text-text"
                            : "text-text"
                        }`}>
                        <span className="flex items-center gap-2">
                          {selectedPresetName === preset.name && (
                            <Check className="w-4 h-4 text-text" />
                          )}
                          {preset.name}
                        </span>
                      </button>
                      <span className={`text-xs font-medium px-2 ${selectedPresetName === preset.name ? "text-text" : "text-text-muted"}`}>
                        {preset.focusMinutes}/{preset.breakMinutes}분
                      </span>
                      <div className="flex items-center pr-2 opacity-60 hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => startEdit(preset)}
                          className="p-1.5 text-text-muted hover:text-primary transition-colors rounded-md hover:bg-white/50 dark:hover:bg-black/50"
                          aria-label="프리셋 수정">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePreset(preset)}
                          className="p-1.5 text-text-muted hover:text-red-500 transition-colors rounded-md hover:bg-white/50 dark:hover:bg-black/50"
                          aria-label="프리셋 삭제">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ),
                )
              )}
            </div>

            {isLoggedIn ? (
              canAddPreset ? (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/20 dark:border-white/10 relative">
                  <div className="absolute -top-[1px] left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="새 프리셋 이름"
                    className="px-3 py-2 rounded-xl border border-white/30 bg-white/50 dark:bg-black/30 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-text-muted/60"
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white/50 dark:bg-black/30 rounded-xl px-2 py-1.5 border border-white/30 flex-1 justify-center gap-0.5">
                      <div className="flex items-center">
                        <input
                          type="number"
                          min={1}
                          max={120}
                          value={newFocusMinutes}
                          onChange={(e) =>
                            setNewFocusMinutes(Number(e.target.value) || 1)
                          }
                          className="w-12 bg-transparent text-center text-sm outline-none font-semibold text-text"
                        />
                        <span className="text-xs text-text-muted">분</span>
                      </div>
                      <span className="text-xs text-text-muted font-bold mx-1">/</span>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min={1}
                          max={60}
                          value={newBreakMinutes}
                          onChange={(e) =>
                            setNewBreakMinutes(Number(e.target.value) || 1)
                          }
                          className="w-12 bg-transparent text-center text-sm outline-none font-semibold text-text"
                        />
                        <span className="text-xs text-text-muted">분</span>
                      </div>
                    </div>
                    <button
                      onClick={handleAddPreset}
                      className="px-3 py-2 bg-black/10 dark:bg-white/10 text-text text-sm font-semibold rounded-xl flex items-center gap-1 hover:bg-black/20 dark:hover:bg-white/20 transition-colors shadow-sm shrink-0">
                      <Plus className="w-4 h-4" />
                      추가
                    </button>
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

        {/* 집중/휴식 모드 토글 스위치 (오른쪽 고정) */}
        <div className="absolute right-0 top-0">
          <Panel
            variant="clay"
            inset
            role="switch"
            aria-checked={isFocus}
            onClick={() => void skip()}
            className="relative flex h-[38px] w-[140px] items-center rounded-full p-1 cursor-pointer shrink-0 shadow-inner">
            <div
              className={cn(
                "absolute top-1 left-1 h-[30px] w-[64px] rounded-full transition-transform duration-300 ease-out z-0",
                clayVariants({ variant: "clay" }),
                isFocus ? "translate-x-0" : "translate-x-[68px]"
              )}
            />
            <span
              className={`relative z-10 flex-1 text-center text-xs font-bold transition-colors duration-300 ${
                isFocus ? "text-primary drop-shadow-sm" : "text-text-muted"
              }`}>
              집중
            </span>
            <span
              className={`relative z-10 flex-1 text-center text-xs font-bold transition-colors duration-300 ${
                !isFocus ? "text-green-50 drop-shadow-sm" : "text-text-muted"
              }`}>
              휴식
            </span>
          </Panel>
        </div>
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

      {/* 중앙 타이머 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-10 pb-4 pt-6">
        <PomodoroOrb
          timeLabel={formatTime(remaining)}
          subLabel={isFocus ? "집중 모드" : "휴식 모드"}
          isFocus={isFocus}
          isRunning={isRunning}
        />

        <div className="flex gap-4">
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
    </div>
  );
}
