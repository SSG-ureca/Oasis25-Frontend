interface HourlyFocusChartProps {
  username: string;
  hourlyPaths: {
    fill1: string;
    fill2: string;
  };
}

export const HourlyFocusChart = ({ username, hourlyPaths }: HourlyFocusChartProps) => {
  return (
    <div className="w-full h-full flex flex-col justify-between relative">
      <div className="z-10 space-y-1.5">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600">Peak Focus Hours</span>
        <h2 className="text-base sm:text-lg font-extrabold text-gray-800 tracking-tight">시간대별 몰입 분석</h2>
        <p className="text-xs sm:text-sm font-semibold text-gray-600 leading-relaxed max-w-[450px]">
          최근 7일간 <span className="text-emerald-600 font-extrabold">{username}</span> 님의 시간대별 총 집중 시간입니다.
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-8 h-[60%] w-full opacity-80 pointer-events-none select-none">
        <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grad-wave1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="grad-wave2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#047857" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={hourlyPaths.fill2} fill="url(#grad-wave2)" />
          <path d={hourlyPaths.fill1} fill="url(#grad-wave1)" />
        </svg>
      </div>

      <div className="z-10 flex justify-between px-1 pb-1 text-[7px] sm:text-[9px] font-semibold text-gray-400/80 w-full">
        {Array.from({ length: 24 }, (_, i) => (
          <span key={i} className="text-center flex-1">{i}시</span>
        ))}
      </div>
    </div>
  );
};

export default HourlyFocusChart;
