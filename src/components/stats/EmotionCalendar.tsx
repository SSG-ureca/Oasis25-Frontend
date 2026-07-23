import { useState } from "react";

interface EmotionCalendarProps {
  diaryScores: (number | string)[];
}

export const EmotionCalendar = ({ diaryScores }: EmotionCalendarProps) => {
  const [hoveredCell, setHoveredCell] = useState<{
    idx: number;
    x: number;
    y: number;
  } | null>(null);

  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const past35Days = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    return getLocalDateString(d);
  });

  const emotionMap: Record<number | string, string> = {
    1: "스트레스",
    2: "불안/슬픔",
    3: "보통",
    4: "차분함",
    5: "행복",
    "none": "기록 없음"
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const parentRect = e.currentTarget.closest(".emotion-calendar-container")?.getBoundingClientRect();
    if (parentRect) {
      const x = e.clientX - parentRect.left;
      const y = e.clientY - parentRect.top;
      setHoveredCell({ idx, x, y });
    }
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row justify-between gap-6 relative emotion-calendar-container">
      <div className="flex flex-col justify-between h-full py-1 z-10 space-y-4 md:w-[32%] shrink-0">
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600">
            30-Day Emotion Trend
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-gray-800 tracking-tight">
            감정 흐름 달력
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 leading-relaxed break-keep">
            최근 30일간 작성한 일기 기록에 근거한 감정 변화 추이입니다.
          </p>
        </div>

        <div className="flex flex-wrap md:flex-col gap-2.5 pt-4 md:border-t border-gray-150/40 text-[9px] sm:text-[10px] font-bold text-gray-500/80">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e65959]/80 shadow-[0_0_6px_rgba(230,89,89,0.3)]" />
            <span>스트레스</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f19a6c]/80 shadow-[0_0_6px_rgba(241,154,108,0.3)]" />
            <span>불안/슬픔</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fcdb94]/80 shadow-[0_0_6px_rgba(252,219,148,0.3)]" />
            <span>보통</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b3c69f]/80 shadow-[0_0_6px_rgba(179,198,159,0.3)]" />
            <span>차분함</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7d9c68]/80 shadow-[0_0_6px_rgba(125,156,104,0.3)]" />
            <span>행복</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-1 z-10 w-full min-h-0">
        <div className="w-full max-w-[300px] md:max-w-[480px] aspect-[7/5] grid grid-cols-7 gap-0 rounded-[16px] overflow-hidden bg-[#e5e9f0]/45 shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] border border-gray-200/30 p-1">
          {diaryScores.map((score, idx) => {
            let colorClass = "";
            if (score === 1) {
              colorClass = "bg-[#e65959]/35";
            } else if (score === 2) {
              colorClass = "bg-[#f19a6c]/35";
            } else if (score === 3) {
              colorClass = "bg-[#fcdb94]/35";
            } else if (score === 4) {
              colorClass = "bg-[#b3c69f]/35";
            } else if (score === 5) {
              colorClass = "bg-[#7d9c68]/35";
            }
            return (
              <div
                key={idx}
                className="relative w-full h-full flex items-center justify-center overflow-visible cursor-pointer"
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {colorClass && (
                  <div
                    className={`absolute w-[220%] h-[220%] rounded-full filter blur-[12px] sm:blur-[16px] pointer-events-none ${colorClass}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {hoveredCell !== null && (
        <div
          className="absolute pointer-events-none bg-white/35 backdrop-blur-md border border-white/40 text-gray-800 rounded-xl px-3 py-1.5 text-[9px] font-bold shadow-[0_8px_20px_rgba(0,0,0,0.06)] z-50 flex flex-col items-center whitespace-nowrap transition-[left,top] duration-150 ease-out"
          style={{
            left: `${hoveredCell.x}px`,
            top: `${hoveredCell.y - 28}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span className="text-gray-400 font-semibold">
            {(() => {
              const dateStr = past35Days[hoveredCell.idx];
              const dateObj = new Date(dateStr);
              return `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;
            })()}
          </span>
          <span className="text-gray-700 mt-0.5 font-extrabold text-[10px]">
            {emotionMap[diaryScores[hoveredCell.idx]] ?? "기록 없음"}
          </span>
        </div>
      )}
    </div>
  );
};

export default EmotionCalendar;
