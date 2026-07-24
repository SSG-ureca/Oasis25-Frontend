import { useState, useEffect } from "react";

interface EmotionCalendarProps {
  diaryScores: (number | string)[];
}

export const EmotionCalendar = ({ diaryScores }: EmotionCalendarProps) => {
  const [hoveredCell, setHoveredCell] = useState<{
    idx: number;
    gridX: number;
    gridY: number;
    parentX: number;
    parentY: number;
  } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
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
    none: "기록 없음",
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    idx: number,
  ) => {
    const gridEl = e.currentTarget.closest(".emotion-grid-container");
    const parentEl = e.currentTarget.closest(".emotion-calendar-container");
    if (gridEl && parentEl) {
      const gridRect = gridEl.getBoundingClientRect();
      const parentRect = parentEl.getBoundingClientRect();
      setHoveredCell({
        idx,
        gridX: e.clientX - gridRect.left,
        gridY: e.clientY - gridRect.top,
        parentX: e.clientX - parentRect.left,
        parentY: e.clientY - parentRect.top,
      });
    }
  };

  const getSpotlightColor = (score: number | string) => {
    if (score === 1)
      return "bg-[#e65959]/40 shadow-[0_0_20px_rgba(230,89,89,0.7)]";
    if (score === 2)
      return "bg-[#f19a6c]/40 shadow-[0_0_20px_rgba(241,154,108,0.7)]";
    if (score === 3)
      return "bg-[#fcdb94]/45 shadow-[0_0_20px_rgba(252,219,148,0.7)]";
    if (score === 4)
      return "bg-[#b3c69f]/45 shadow-[0_0_20px_rgba(179,198,159,0.7)]";
    if (score === 5)
      return "bg-[#7d9c68]/40 shadow-[0_0_20px_rgba(125,156,104,0.7)]";
    return "bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.4)]";
  };

  const getEmotionSummary = () => {
    const validScores = diaryScores.filter(
      (s): s is number => typeof s === "number",
    );
    if (validScores.length === 0) {
      return {
        text: "최근 기록된 감정이 없어 한줄평이 준비 중입니다. 감정 일기를 작성해 보세요.",
        labelColor: "text-gray-500",
        label: "분석 대기 중",
      };
    }
    const sum = validScores.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / validScores.length;

    if (avg >= 3.8) {
      return {
        text: "행복하고 차분한 긍정적 에너지가 주를 이루는 아주 맑고 안정적인 한 달을 보냈습니다.",
        labelColor: "text-emerald-600",
        label: "긍정 & 평온",
      };
    } else if (avg >= 2.8) {
      return {
        text: "보통 수준의 정서적 흐름을 유지하며 무난하고 균형 잡힌 한 달의 나날들을 보냈습니다.",
        labelColor: "text-amber-600",
        label: "평온 & 조화",
      };
    } else {
      return {
        text: "평소보다 스트레스나 슬픈 지표가 감지되었으니 따뜻한 쉼과 마음 충전을 추천합니다.",
        labelColor: "text-rose-500",
        label: "쉼과 충전 필요",
      };
    }
  };

  const summary = getEmotionSummary();

  return (
    <div className="w-full h-auto md:h-full grid grid-cols-1 md:grid-cols-[29%_66%] md:grid-rows-[auto_1fr] justify-between gap-6 relative emotion-calendar-container">
      {/* 1. 타이틀 영역 (좌측 상단 고정) */}
      <div className="space-y-1.5 md:col-start-1 md:row-start-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600">
          30-Day Emotion Trend
        </span>
        <h2 className="text-base sm:text-lg font-extrabold text-gray-800 tracking-tight">
          감정 흐름 달력
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-gray-500 leading-relaxed break-keep whitespace-normal lg:whitespace-nowrap">
          최근 30일간 작성한 회고 기록에 따른 감정 달력입니다.
        </p>
      </div>

      {/* 2. 감정달력 그리드판 (모바일에서는 타이틀 바로 아래(2번째), 데스크톱에서는 우측 전체 영역 차지) */}
      <div className="flex-1 flex items-center justify-center py-1 z-10 w-full min-h-0 md:col-start-2 md:row-span-2 md:self-center">
        <div className="w-full max-w-[300px] md:max-w-[480px] aspect-[7/5] grid grid-cols-7 gap-0 rounded-[16px] overflow-hidden bg-[#e5e9f0]/45 shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] border border-gray-200/30 p-1 relative emotion-grid-container">
          {hoveredCell !== null && (
            <div
              className={`absolute w-14 h-14 rounded-full pointer-events-none blur-lg mix-blend-overlay transition-all duration-[400ms] ease-out z-20 ${getSpotlightColor(diaryScores[hoveredCell.idx])}`}
              style={{
                left: `${hoveredCell.gridX}px`,
                top: `${hoveredCell.gridY}px`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}

          {diaryScores.map((score, idx) => {
            let colorHex = "";
            if (score === 1) {
              colorHex = "bg-[#e65959]";
            } else if (score === 2) {
              colorHex = "bg-[#f19a6c]";
            } else if (score === 3) {
              colorHex = "bg-[#fcdb94]";
            } else if (score === 4) {
              colorHex = "bg-[#b3c69f]";
            } else if (score === 5) {
              colorHex = "bg-[#7d9c68]";
            }

            return (
              <div
                key={idx}
                className="relative w-full h-full flex items-center justify-center overflow-visible cursor-pointer"
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {colorHex && (
                  <div
                    className={`absolute w-[220%] h-[220%] rounded-full filter blur-[12px] sm:blur-[16px] pointer-events-none transition-all duration-[800ms] ease-out ${colorHex} ${
                      isLoaded ? "opacity-35 scale-100" : "opacity-0 scale-50"
                    }`}
                    style={{ transitionDelay: `${idx * 20}ms` }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 하단 영역: 한줄평 요약과 범례 (모바일에서는 맨 마지막(3번째), 데스크톱에서는 좌측 하단 고정) */}
      <div className="space-y-4 md:col-start-1 md:row-start-2 md:self-end">
        {/* 한 달 감정 요약 순수 텍스트 */}
        <div className="pt-5 border-t border-black/10 space-y-1.5 pb-3">
          <span
            className={`text-[10px] font-extrabold uppercase tracking-wider block ${summary.labelColor}`}
          >
            {summary.label}
          </span>
          <p className="text-xs sm:text-sm font-semibold text-gray-700 leading-relaxed break-keep">
            {summary.text}
          </p>
        </div>

        {/* 감정 범례 목록 */}
        <div className="flex flex-wrap md:flex-col gap-2.5 pt-4 md:border-t border-black/10 text-[9px] sm:text-[10px] font-bold text-gray-500/80">
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

      {hoveredCell !== null && (
        <div
          className="absolute pointer-events-none bg-white/35 backdrop-blur-md border border-white/40 text-gray-800 rounded-xl px-3 py-1.5 text-[9px] font-bold shadow-[0_8px_20px_rgba(0,0,0,0.06)] z-50 flex flex-col items-center whitespace-nowrap transition-[left,top] duration-[400ms] ease-out"
          style={{
            left: `${hoveredCell.parentX}px`,
            top: `${hoveredCell.parentY - 28}px`,
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
