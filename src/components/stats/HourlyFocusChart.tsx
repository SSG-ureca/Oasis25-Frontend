interface HourlyFocusChartProps {
  username: string;
  weeklyHourlyPaths: Array<{
    line: string;
    fill: string;
  }>;
  dailyHourDataList: number[][];
}

const THEME_COLOR = "#10b981"; // 에메랄드 브랜드 테마 컬러로 통일

export const HourlyFocusChart = ({ username, weeklyHourlyPaths, dailyHourDataList }: HourlyFocusChartProps) => {
  // 24시간 중 누적 집중 분이 가장 높은 피크 시간 계산 (7일 전체 기준)
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

  return (
    <div className="w-full h-full flex flex-col justify-between relative">
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

      <div className="absolute inset-x-0 bottom-8 h-[72%] w-full opacity-80 pointer-events-none select-none">
        <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="none">
          {weeklyHourlyPaths.map((paths, idx) => {
            return (
              <g
                key={idx}
                className="hover:opacity-100 transition-opacity duration-300"
              >
                {/* 각 요일별 투명도(opacity)가 들어간 완만한 몰입 영역 채우기 */}
                <path d={paths.fill} fill={THEME_COLOR} opacity={0.35} />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="z-10 flex justify-between px-1 pb-1 text-[7px] sm:text-[9px] font-semibold text-gray-400/80 w-full">
        {Array.from({ length: 24 }, (_, i) => (
          <span key={i} className="text-center flex-1">
            {i}시
          </span>
        ))}
      </div>
    </div>
  );
};

export default HourlyFocusChart;
