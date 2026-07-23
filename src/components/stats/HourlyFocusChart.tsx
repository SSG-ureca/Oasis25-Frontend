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

export const HourlyFocusChart = ({ weeklyHourlyPaths, dailyHourDataList }: HourlyFocusChartProps) => {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
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
  const peakHour = maxHourVal > 0 ? hourlySums.indexOf(maxHourVal) : null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const hour = Math.min(23, Math.max(0, Math.round(percentage * 23)));
    setHoveredHour(hour);
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
    const dayLabel = idx === 6 ? "오늘" : idx === 5 ? "어제" : `${6 - idx}일 전`;
    
    const dayData = dailyHourDataList[idx];
    const totalFocusMin = dayData ? dayData.reduce((sum, val) => sum + val, 0) : 0;
    
    return { dayLabel, dateString, totalFocusMin };
  };

  const selectedDayInfo = getSelectedDayInfo(selectedDayIdx);

  return (
    <div className="w-full h-full flex flex-col justify-between relative select-none">
      <div className="z-10 space-y-1.5">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600">
          Peak Focus Hours
        </span>
        <h2 className="text-base sm:text-lg font-extrabold text-gray-800 tracking-tight flex items-center justify-between">
          <span>시간대별 몰입 분석</span>
          {peakHour !== null && (
            <span className="text-[9px] sm:text-[10px] font-extrabold text-gray-500 bg-gray-100/80 px-2 py-0.5 rounded-md tracking-wider">
              PEAK: {peakHour}시 - {peakHour + 1}시
            </span>
          )}
        </h2>
        
        <div className="text-xs sm:text-sm font-semibold text-gray-600 leading-relaxed max-w-[500px]">
          <p>
            최근 7일간 사용자님의 <span className="text-emerald-600 font-extrabold">시간대별 총 집중 시간</span>입니다.
            {peakHour !== null && (
              <span className="text-gray-800 block mt-0.5">
                하루 중 몰입 효율은 <span className="text-emerald-600 font-extrabold">{peakHour}시 ~ {peakHour + 1}시</span> 사이에 가장 높게 나타납니다.
              </span>
            )}
          </p>
        </div>
      </div>

      <div 
        className="absolute inset-x-0 bottom-[52px] h-[62%] w-full cursor-pointer z-20"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredHour(null)}
        onClick={handleChartClick}
      >
        <svg 
          viewBox="0 0 400 150" 
          className={`w-full h-full pointer-events-none select-none transition-all duration-[800ms] ease-out ${
            isLoaded ? "opacity-80 translate-y-0" : "opacity-0 translate-y-4"
          }`} 
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
              <g key={idx} className="transition-all duration-300">
                <path d={paths.fill} fill={fillColor} fillOpacity={fillOpacity} />
              </g>
            );
          })}
        </svg>

        {hoveredHour !== null && (
          <div
            className="absolute top-0 bottom-0 border-l-2 border-dashed border-emerald-500/50 pointer-events-none transition-[left] duration-75 ease-out"
            style={{ left: `${(hoveredHour / 23) * 100}%` }}
          />
        )}

        {hoveredHour !== null && (
          <div
            className="absolute top-2 pointer-events-none bg-white/15 backdrop-blur-sm border border-white/10 text-gray-800 rounded-lg px-2 py-0.5 text-[8px] font-medium shadow-[0_4px_12px_rgba(0,0,0,0.02)] z-30 flex flex-col items-center whitespace-nowrap transition-[left] duration-75 ease-out"
            style={{
              left: `${(hoveredHour / 23) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            <span className="text-gray-600 font-semibold text-[8px]">{hoveredHour}시 - {hoveredHour + 1}시</span>
            <span className="text-emerald-700 font-bold text-[9px] mt-0.5">
              {selectedDayIdx !== null ? (
                `선택일 ${dailyHourDataList[selectedDayIdx]?.[hoveredHour] ?? 0}분 몰입`
              ) : (
                `7일 총 ${hourlySums[hoveredHour]}분 몰입`
              )}
            </span>
          </div>
        )}
      </div>

      <div className="z-10 w-full space-y-1.5 pt-1">
        <div className="flex justify-between px-1 text-[7px] sm:text-[9px] font-semibold text-gray-400/80 w-full select-none pointer-events-none pb-0.5">
          {Array.from({ length: 24 }, (_, i) => (
            <span key={i} className="text-center flex-1">
              {i}시
            </span>
          ))}
        </div>

        <div className="text-[10px] sm:text-[11px] text-gray-400 font-medium text-center select-none">
          {selectedDayInfo ? (
            <span className="cursor-pointer hover:text-emerald-600 transition-colors" onClick={handleChartClick}>
              {selectedDayInfo.dayLabel} ({selectedDayInfo.dateString})의 곡선을 강조 표시 중입니다. (총 {selectedDayInfo.totalFocusMin}분 몰입)
            </span>
          ) : (
            <span className="cursor-pointer hover:text-gray-500 transition-colors" onClick={handleChartClick}>
              그래프 영역을 클릭하면 요일별 몰입 곡선을 차례대로 분리하여 탐색할 수 있습니다.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HourlyFocusChart;
