import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Panel } from "../common/Panel";

interface TimePickerProps {
  value: string; // "HH:MM" 24시간제
  onChange: (val: string) => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

export function TimePicker({ value, onChange, onClose, anchorEl }: TimePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: -9999, left: -9999 });

  // 내부 상태로만 관리하여 클릭 중 리스트가 재정렬(점프)되는 현상 방지
  const [localValue, setLocalValue] = useState(value);
  const [hourStr, minuteStr] = localValue.split(":");

  useEffect(() => {
    const updatePosition = () => {
      if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        setPosition({
          top: rect.top - 10, // 클릭한 텍스트의 약간 위쪽
          left: rect.right + 20, // 텍스트 우측으로 여백을 두고 배치
        });
      }
    };
    
    updatePosition();
    
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [anchorEl]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (anchorEl && anchorEl.contains(e.target as Node)) {
        return;
      }
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        // 닫힐 때 최종 값을 부모에게 전달
        onChange(localValue);
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, anchorEl, localValue, onChange]);

  if (!anchorEl) return null;

  return createPortal(
    <div
      ref={containerRef}
      style={{ top: position.top, left: position.left, position: "fixed" }}
      className="z-[9999]"
      onMouseDown={(e) => e.preventDefault()}
    >
      <Panel variant="clay" className="flex w-[120px] h-[160px] p-2 gap-1 rounded-xl shadow-xl bg-[#EBE5D9]">
        
        {/* 시간 컬럼 (00~23) */}
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto min-h-0 h-full custom-scrollbar pr-1">
          {Array.from({ length: 24 }, (_, i) => i).map((h) => {
            const hFormatted = h.toString().padStart(2, "0");
            const selected = hFormatted === hourStr;
            return (
              <button
                key={hFormatted}
                onClick={() => setLocalValue(`${hFormatted}:${minuteStr}`)}
                className={`w-full py-1.5 shrink-0 rounded-lg text-xs font-bold transition-colors ${
                  selected ? "bg-gray-20 text-white" : "text-gray-20 hover:bg-black/5"
                }`}>
                {hFormatted}시
              </button>
            );
          })}
        </div>

        <div className="w-px bg-gray-400/20 my-2" />

        {/* 분 컬럼 (00, 30) */}
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto min-h-0 h-full custom-scrollbar pr-1">
          {["00", "30"].map((m) => {
            const selected = m === minuteStr;
            return (
              <button
                key={m}
                onClick={() => {
                  const finalValue = `${hourStr}:${m}`;
                  setLocalValue(finalValue);
                  onChange(finalValue);
                  onClose();
                }}
                className={`w-full py-1.5 shrink-0 rounded-lg text-xs font-bold transition-colors ${
                  selected ? "bg-gray-20 text-white" : "text-gray-20 hover:bg-black/5"
                }`}>
                {m}분
              </button>
            );
          })}
        </div>
      </Panel>
    </div>,
    document.body
  );
}
