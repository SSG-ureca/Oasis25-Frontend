import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Clock,
  Pencil,
  Plus,
  Settings,
  X,
} from "lucide-react";
import { Button } from "../common/Button";
import { usePomodoro } from "../../hooks/usePomodoro";
import { MAX_CUSTOM_PRESETS } from "../../types/pomodoro";
import type { PomodoroPreset } from "../../types/pomodoro";
import PomodoroOrb from "./PomodoroOrb";
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

export default function PomodoroTimer() {
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
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);
  const [manageMenuOpen, setManageMenuOpen] = useState(false);

  const [newPresetName, setNewPresetName] = useState("");
  const [newFocusMinutes, setNewFocusMinutes] = useState(25);
  const [newBreakMinutes, setNewBreakMinutes] = useState(5);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editFocusMinutes, setEditFocusMinutes] = useState(25);
  const [editBreakMinutes, setEditBreakMinutes] = useState(5);

  const presetMenuRef = useRef<HTMLDivElement>(null);
  const manageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        presetMenuRef.current &&
        !presetMenuRef.current.contains(e.target as Node)
      ) {
        setPresetMenuOpen(false);
      }
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
  const selectablePresets = [DEFAULT_PRESET, ...customPresets];

  const isFocus = mode === "focus";

  function handleSelectPreset(preset: PomodoroPreset) {
    if (isRunning) return;
    applyPreset(preset);
    setSelectedPresetName(preset.name);
    setPresetMenuOpen(false);
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

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex items-center gap-2">
        {/* 프리셋 선택 드롭다운 */}
        <div ref={presetMenuRef} className="relative">
          <Button
            variant="clayFlat"
            type="button"
            disabled={isRunning}
            onClick={() => {
              setPresetMenuOpen((v) => !v);
              setManageMenuOpen(false);
            }}
            className="flex items-center gap-2 text-sm font-semibold text-gray-30 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed border-none">
            <Clock className="w-4 h-4" />
            {selectedPresetName}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${presetMenuOpen ? "rotate-180" : ""}`}
            />
          </Button>

          {presetMenuOpen && (
            <Panel
              variant="clayFlat"
              className="absolute left-0 top-full mt-2 z-30 w-56 rounded-xl p-1">
              {selectablePresets.map((preset) => (
                <Button
                  variant="clay"
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`border-none flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-gray-70 ${
                    preset.name === selectedPresetName
                      ? "text-primary font-semibold"
                      : "text-gray-10"
                  }`}>
                  <span>{preset.name}</span>
                  <span className="text-xs text-gray-30">
                    {preset.focusMinutes}/{preset.breakMinutes}분
                  </span>
                </Button>
              ))}
              {loadingPresets && (
                <div className="px-3 py-2 text-xs text-gray-30">
                  불러오는 중...
                </div>
              )}
            </Panel>
          )}
        </div>

        {/* 프리셋 설정(추가/수정/삭제) 드롭다운 */}
        <div ref={manageMenuRef} className="relative">
          <Button
            variant="clay"
            type="button"
            aria-label="프리셋 설정"
            onClick={() => {
              setManageMenuOpen((v) => !v);
              setPresetMenuOpen(false);
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full text-gray-30 hover:bg-gray-70">
            <Settings className="w-4 h-4" />
          </Button>

          {manageMenuOpen && (
            <div className="absolute right-0 top-full mt-2 z-30 w-72 rounded-xl border border-gray-100 bg-white shadow-lg p-3 text-sm">
              {!isLoggedIn ? (
                <p className="text-xs text-center text-gray-400 py-2">
                  프리셋 저장/수정은 로그인 후 사용할 수 있습니다.
                </p>
              ) : (
                <>
                  <span className="font-medium text-gray-700">프리셋 관리</span>

                  <div className="flex flex-col gap-1 mt-2">
                    {/* 기본 프리셋: 수정/삭제 불가 */}
                    <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-gray-70">
                      <span className="text-gray-10">
                        {DEFAULT_PRESET.name}
                      </span>
                      <span className="text-xs text-gray-30">
                        {DEFAULT_PRESET.focusMinutes}/
                        {DEFAULT_PRESET.breakMinutes}분
                      </span>
                    </div>

                    {loadingPresets ? (
                      <span className="text-gray-400 text-xs py-1">
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
                                  setEditFocusMinutes(
                                    Number(e.target.value) || 1,
                                  )
                                }
                                className="w-14 px-2 py-1 rounded-md border border-gray-300 text-center text-xs"
                              />
                              <span className="text-xs text-gray-30">/</span>
                              <input
                                type="number"
                                min={1}
                                max={60}
                                value={editBreakMinutes}
                                onChange={(e) =>
                                  setEditBreakMinutes(
                                    Number(e.target.value) || 1,
                                  )
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
                                className="text-gray-30 hover:text-gray-10"
                                aria-label="편집 취소">
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={preset.id}
                            className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-70">
                            <span className="text-gray-10">{preset.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-30">
                                {preset.focusMinutes}/{preset.breakMinutes}분
                              </span>
                              <Button
                                variant="clay"
                                type="button"
                                onClick={() => startEdit(preset)}
                                className="text-gray-30 hover:text-primary"
                                aria-label="프리셋 수정">
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="clay"
                                type="button"
                                onClick={() => handleRemovePreset(preset)}
                                className="text-gray-30 hover:text-red-500"
                                aria-label="프리셋 삭제">
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ),
                      )
                    )}
                  </div>

                  {canAddPreset ? (
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
                        <span className="text-xs text-gray-30">/</span>
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
                    <span className="block text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                      커스텀 프리셋은 최대 {MAX_CUSTOM_PRESETS}개까지 저장할 수
                      있습니다.
                    </span>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <PomodoroOrb
        timeLabel={formatTime(remaining)}
        subLabel={isFocus ? "집중 모드" : "휴식 모드"}
        isFocus={isFocus}
        isRunning={isRunning}
      />

      <div className="flex gap-3">
        <Button
          variant="clay"
          onClick={isRunning ? pause : start}
          className="rounded-full px-6 py-2 text-sm font-semibold text-primary">
          {isRunning ? "일시정지" : "시작"}
        </Button>
        <Button
          variant="clay"
          onClick={skip}
          className="rounded-full px-6 py-2 text-sm font-semibold text-gray-20">
          {isFocus ? "휴식" : "집중"}
        </Button>
        <Button
          variant="clay"
          onClick={reset}
          className="rounded-full px-6 py-2 text-sm font-semibold text-gray-20">
          종료
        </Button>
      </div>
    </div>
  );
}
