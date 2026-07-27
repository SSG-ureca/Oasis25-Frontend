import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain } from "lucide-react";
import { type WeatherStatsResponse } from "../../types/stats";

interface WeatherFocusChartProps {
  getWeatherData: (cond: string) => WeatherStatsResponse | undefined;
}

const WEATHER_CATEGORIES = [
  {
    key: "맑음",
    label: "맑음",
    icon: Sun,
    keys: ["맑음"],
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500",
    gradient: "bg-gradient-to-br from-amber-500/10 to-orange-400/5",
    border: "border-amber-200/40 dark:border-amber-500/20",
  },
  {
    key: "흐림",
    label: "흐림",
    icon: Cloud,
    keys: ["흐림", "안개", "알수없음", "기타"],
    iconColor: "text-slate-500",
    bgColor: "bg-slate-500",
    gradient: "bg-gradient-to-br from-slate-500/10 to-gray-400/5",
    border: "border-slate-200/40 dark:border-slate-500/20",
  },
  {
    key: "눈비",
    label: "눈/비",
    icon: CloudRain,
    keys: ["비", "눈", "천둥번개"],
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500",
    gradient: "bg-gradient-to-br from-blue-500/10 to-cyan-400/5",
    border: "border-blue-200/40 dark:border-blue-500/20",
  },
];

export const WeatherFocusChart = ({
  getWeatherData,
}: WeatherFocusChartProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const categoryStats = WEATHER_CATEGORIES.map((cat) => {
    let totalFocus = 0;
    let validCategoriesCount = 0;

    cat.keys.forEach((k) => {
      const d = getWeatherData(k);
      if (d && d.avgFocusMinutes > 0) {
        totalFocus += d.avgFocusMinutes;
        validCategoriesCount += 1;
      }
    });

    const avgFocus =
      validCategoriesCount > 0 ? totalFocus / validCategoriesCount : 0;
    return { ...cat, avgFocus };
  });

  const maxAvgFocus = Math.max(...categoryStats.map((s) => s.avgFocus));

  return (
    <div className="w-full h-full flex flex-col relative select-none">
      <div className="space-y-1.5 mb-2 sm:mb-4">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--color-green-50)]">
          Weather Focus Analytics
        </span>
        <h2 className="text-base sm:text-lg font-extrabold text-text tracking-tight">
          날씨별 평균 집중 시간
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-text-muted leading-relaxed break-keep">
          다양한 날씨 상태를 3가지 주요 카테고리로 묶어, 어떤 날씨에 집중 효율이 더 좋은지 직관적으로 보여줍니다.
        </p>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row justify-center items-center gap-4 w-full px-2 sm:px-6">
        {categoryStats.map((item, i) => {
          const Icon = item.icon;
          const displayAvg =
            item.avgFocus > 0 ? `${Math.round(item.avgFocus)}분` : "기록 없음";
          const ratio = maxAvgFocus > 0 ? (item.avgFocus / maxAvgFocus) * 100 : 0;

          return (
            <div
              key={item.key}
              className={`relative flex-1 w-full sm:w-auto h-52 sm:h-60 flex flex-col justify-between items-center p-6 rounded-[28px] border ${item.border} ${item.gradient} overflow-hidden transition-all duration-300 hover:scale-[1.03] ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* 은은한 배경 글로우 */}
              <div className={`absolute -top-6 -right-6 w-32 h-32 rounded-full blur-[40px] opacity-30 ${item.bgColor} pointer-events-none`} />
              
              <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 mt-2 z-10">
                <div className={`p-3 rounded-2xl bg-white/40 dark:bg-black/20 shadow-sm backdrop-blur-md border ${item.border}`}>
                  <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${item.iconColor}`} />
                </div>
                <span className="text-sm sm:text-base font-extrabold text-text-muted mt-2">
                  {item.label}
                </span>
              </div>

              <div className="flex flex-col items-center w-full z-10">
                <span
                  className={`text-2xl sm:text-4xl font-black tracking-tight ${item.avgFocus > 0 ? "text-text" : "text-text-muted/60"}`}
                >
                  {displayAvg}
                </span>

                {/* 프로그레스 바 (가장 높은 날씨 대비 비율) */}
                {maxAvgFocus > 0 && (
                  <div className="w-full mt-4 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-text-muted px-1">
                      <span>비율</span>
                      <span>{Math.round(ratio)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${item.bgColor}`} 
                        style={{ width: `${isLoaded ? ratio : 0}%`, transitionDelay: `${400 + i * 100}ms` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherFocusChart;
