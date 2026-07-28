import { useState, useEffect } from "react";

interface HourlyFocusChartProps {
  weeklyHourlyPaths: Array<{
    line: string;
    fill: string;
  }>;
  dailyHourDataList: number[][];
}

const GREEN_THEME_COLOR = "#2c8f31";
const PRIMARY_PINK_COLOR = "#ff3776";

export const HourlyFocusChart = ({
  weeklyHourlyPaths,
  dailyHourDataList,
}: HourlyFocusChartProps) => {
  // const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const hourlySums = Array(24).fill(0);
  dailyHourDataList?.forEach((dayData) => {
    if (dayData) {
      dayData.forEach((val, hour) => {
        hourlySums[hour] += val;
      });
    }
  });

  const maxHourVal = Math.max(...hourlySums);
  let peakStart: number | null = null;
  let peakEnd: number | null = null;

  if (maxHourVal > 0) {
    const maxHour = hourlySums.indexOf(maxHourVal);
    const threshold = maxHourVal * 0.5;

    let left = maxHour;
    let right = maxHour;

    while (true) {
      const nextLeft = (left - 1 + 24) % 24;
      if (nextLeft === right) break;
      if (hourlySums[nextLeft] >= threshold) {
        left = nextLeft;
      } else {
        break;
      }
    }

    while (true) {
      const nextRight = (right + 1) % 24;
      if (nextRight === left) break;
      if (hourlySums[nextRight] >= threshold) {
        right = nextRight;
      } else {
        break;
      }
    }

    peakStart = left;
    peakEnd = (right + 1) % 24;
  }

  const handleMouseMove = () => {
    // const rect = e.currentTarget.getBoundingClientRect();
    // const x = e.clientX - rect.left;
    // const percentage = x / rect.width;
    // const hour = Math.min(23, Math.max(0, Math.round(percentage * 23)));
    // setHoveredHour(hour);
  };

  const handleChartClick = () => {
    setSelectedDayIdx((prev) => {
      if (prev === null) return 6;
      if (prev === 0) return null;
      return prev - 1;
    });
  };

  const getSelectedDayInfo = (idx: number | null) => {
    if (idx === null) return null;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - (6 - idx));
    const dateString = `${targetDate.getMonth() + 1}월 ${targetDate.getDate()}일`;
    const dayLabel =
      idx === 6 ? "오늘" : idx === 5 ? "어제" : `${6 - idx}일 전`;

    const dayData = dailyHourDataList[idx];
    const totalFocusMin = dayData
      ? dayData.reduce((sum, val) => sum + val, 0)
      : 0;

    return { dayLabel, dateString, totalFocusMin };
  };

  const selectedDayInfo = getSelectedDayInfo(selectedDayIdx);

  return (
    <div className="w-full h-full flex flex-col justify-between relative select-none">
      <div className="z-10 space-y-1.5">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-green-50">
          Peak Focus Hours
        </span>
        <h2 className="text-base sm:text-lg font-extrabold tracking-tight flex items-center justify-between">
          <span>시간대별 집중 분석</span>
          {peakStart !== null && peakEnd !== null && (
            <span className="text-[10px] sm:text-xs font-extrabold text-text bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-md tracking-wider">
              PEAK: {peakStart}시 - {peakEnd}시
            </span>
          )}
        </h2>

        <div className="text-xs sm:text-sm font-semibold text-text-muted leading-relaxed max-w-[500px]">
          <p>
            최근 7일간 사용자님의{" "}
            <span className="text-green-50 font-extrabold">
              시간대별 총 집중 시간
            </span>
            입니다.
            {peakStart !== null && peakEnd !== null && (
              <span className=" block mt-0.5">
                하루 중 집중 효율은{" "}
                <span className="text-green-50 font-extrabold">
                  {peakStart}시 ~ {peakEnd}시
                </span>{" "}
                사이에 가장 높게 나타납니다.
              </span>
            )}
          </p>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-[52px] h-[62%] w-full cursor-pointer z-20"
        onMouseMove={handleMouseMove}
        // onMouseLeave={() => setHoveredHour(null)}
        onClick={handleChartClick}
      >
        <svg
          viewBox="0 0 400 150"
          className="w-full h-full pointer-events-none select-none opacity-80"
          preserveAspectRatio="none"
        >
          {weeklyHourlyPaths.map((paths, idx) => {
            const isSelected = selectedDayIdx === idx;
            const isAnySelected = selectedDayIdx !== null;

            let fillColor = GREEN_THEME_COLOR;
            let fillOpacity = 0.25;

            if (isAnySelected) {
              if (isSelected) {
                fillColor = PRIMARY_PINK_COLOR;
                fillOpacity = 0.55;
              } else {
                fillColor = GREEN_THEME_COLOR;
                fillOpacity = 0.25;
              }
            }

            return (
              <g
                key={idx}
                className="transition-all duration-[750ms] ease-out origin-bottom"
                style={{
                  transform: isLoaded ? "scaleY(1)" : "scaleY(0)",
                  opacity: isLoaded ? 1 : 0,
                  transitionDelay: `${idx * 80}ms`,
                }}
              >
                <path
                  d={paths.fill}
                  fill={fillColor}
                  fillOpacity={fillOpacity}
                />
              </g>
            );
          })}
        </svg>

        {/* {hoveredHour !== null && (
          <div
            className="absolute top-0 bottom-0 border-l-2 border-dashed border-green-50/50 pointer-events-none transition-[left] duration-75 ease-out"
            style={{ left: `${(hoveredHour / 23) * 100}%` }}
          />
        )} 
        {hoveredHour !== null && (
          <div
            className="absolute top-2 pointer-events-none bg-bg-light/70 backdrop-blur-sm border border-white/10 text-text rounded-lg px-2 py-0.5 text-[8px] font-medium shadow-[0_4px_12px_rgba(0,0,0,0.02)] z-30 flex flex-col items-center whitespace-nowrap transition-[left] duration-75 ease-out"
            style={{
              left: `${(hoveredHour / 23) * 100}%`,
              transform: "translateX(-50%)",
            }}>
            <span className="text-text-muted font-semibold text-[8px]">
              {hoveredHour}시 - {hoveredHour + 1}시
            </span>
            <span className="text-green-90 font-bold text-[9px] mt-0.5">
              {selectedDayIdx !== null
                ? `선택일 ${dailyHourDataList[selectedDayIdx]?.[hoveredHour] ?? 0}분 집중`
                : `7일 총 ${hourlySums[hoveredHour]}분 집중`}
            </span>
          </div>
        )}
        */}
      </div>

      <div className="z-10 w-full space-y-1.5 pt-1">
        <div className="flex justify-between px-1 text-[9px] sm:text-xs font-semibold text-text-muted/80 w-full select-none pointer-events-none pb-0.5">
          {Array.from({ length: 24 }, (_, i) => {
            let displayClass = "inline-block whitespace-nowrap";
            if (i % 2 !== 0) {
              displayClass = "hidden lg:inline-block whitespace-nowrap";
            }
            return (
              <span key={i} className="text-center flex-1">
                <span className={displayClass}>{i}시</span>
              </span>
            );
          })}
        </div>

        <div className="text-xs sm:text-sm text-text font-semibold text-center select-none mt-2">
          {selectedDayInfo ? (
            <span
              className="cursor-pointer hover:text-green-50 transition-colors"
              onClick={handleChartClick}
            >
              {selectedDayInfo.totalFocusMin > 0
                ? `${selectedDayInfo.dayLabel} (${selectedDayInfo.dateString})의 곡선을 강조 표시 중입니다. (총 ${selectedDayInfo.totalFocusMin}분 집중)`
                : `${selectedDayInfo.dayLabel} (${selectedDayInfo.dateString})에는 기록된 집중 데이터가 없습니다.`}
            </span>
          ) : (
            <span
              className="cursor-pointer hover:text-text-muted transition-colors"
              onClick={handleChartClick}
            >
              <span className="text-[var(--color-green-50)] font-extrabold">
                그래프 영역을 클릭
              </span>
              하면 요일별 집중 곡선을 차례대로 분리하여 탐색할 수 있습니다.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HourlyFocusChart;
