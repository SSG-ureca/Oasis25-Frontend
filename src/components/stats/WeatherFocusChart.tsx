import { useState, useEffect } from "react";
import {
  CloudRain,
  Sun,
  Cloud,
  Snowflake,
  CloudFog,
  CloudLightning,
  HelpCircle,
} from "lucide-react";
import { type WeatherStatsResponse } from "../../types/stats";

interface WeatherFocusChartProps {
  getWeatherData: (cond: string) => WeatherStatsResponse | undefined;
  getBarHeight: (cond: string) => number;
}

const WEATHER_ITEMS = [
  {
    key: "맑음",
    label: "맑음",
    icon: Sun,
    gradient: "from-amber-500 to-orange-400",
    iconColor: "text-amber-500",
    shadow:
      "shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.12),_inset_2px_2px_6px_rgba(255,255,255,0.45),_0_4px_10px_rgba(245,158,11,0.2)]",
    trackBg: "bg-amber-50/50",
  },
  {
    key: "흐림",
    label: "흐림",
    icon: Cloud,
    gradient: "from-slate-500 to-gray-400",
    iconColor: "text-text-muted",
    shadow:
      "shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.12),_inset_2px_2px_6px_rgba(255,255,255,0.45),_0_4px_10px_rgba(100,116,139,0.2)]",
    trackBg: "bg-slate-100/40",
  },
  {
    key: "안개",
    label: "안개",
    icon: CloudFog,
    gradient: "from-zinc-400 to-slate-300",
    iconColor: "text-text-muted",
    shadow:
      "shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.12),_inset_2px_2px_6px_rgba(255,255,255,0.45),_0_4px_10px_rgba(161,161,170,0.2)]",
    trackBg: "bg-zinc-50/50",
  },
  {
    key: "비",
    label: "비",
    icon: CloudRain,
    gradient: "from-blue-500 to-cyan-400",
    iconColor: "text-blue-500",
    shadow:
      "shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.12),_inset_2px_2px_6px_rgba(255,255,255,0.45),_0_4px_10px_rgba(59,130,246,0.2)]",
    trackBg: "bg-blue-50/50",
  },
  {
    key: "천둥번개",
    label: "천둥번개",
    icon: CloudLightning,
    gradient: "from-violet-500 to-fuchsia-400",
    iconColor: "text-violet-500",
    shadow:
      "shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.12),_inset_2px_2px_6px_rgba(255,255,255,0.45),_0_4px_10px_rgba(139,92,246,0.2)]",
    trackBg: "bg-violet-50/50",
  },
  {
    key: "눈",
    label: "눈",
    icon: Snowflake,
    gradient: "from-sky-400 to-indigo-300",
    iconColor: "text-sky-400",
    shadow:
      "shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.12),_inset_2px_2px_6px_rgba(255,255,255,0.45),_0_4px_10px_rgba(56,189,248,0.2)]",
    trackBg: "bg-sky-50/50",
  },
  {
    key: "기타",
    label: "기타",
    icon: HelpCircle,
    gradient: "from-teal-500 to-emerald-400",
    iconColor: "text-teal-500",
    shadow:
      "shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.12),_inset_2px_2px_6px_rgba(255,255,255,0.45),_0_4px_10px_rgba(20,184,166,0.2)]",
    trackBg: "bg-teal-50/50",
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

  const allStats = WEATHER_ITEMS.map(
    (item) => getWeatherData(item.key)?.avgFocusMinutes ?? 0,
  );
  const maxFocus = Math.max(...allStats, 40);
  const gridLines = [
    Math.round(maxFocus),
    Math.round(maxFocus * 0.66),
    Math.round(maxFocus * 0.33),
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between relative">
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600">
          Weather Focus Analytics
        </span>
        <h2 className="text-base sm:text-lg font-extrabold text-text tracking-tight">
          날씨별 몰입도 비교
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-text-muted leading-relaxed break-keep max-w-[500px]">
          날씨 환경에 따른 평균 집중 시간(분)입니다. 날씨에 적합한 몰입 상태를
          확인해보세요.
        </p>
      </div>

      <div className="relative flex-1 min-h-[200px] sm:min-h-[240px] mt-4 mb-2 flex items-end justify-between px-2 sm:px-6 md:px-12">
        <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none select-none">
          {gridLines.map((val, idx) => (
            <div key={idx} className="w-full flex items-center gap-1 sm:gap-2">
              <span className="text-[7.5px] sm:text-[8px] font-bold text-text-muted/80 w-6 text-right shrink-0">
                {val}분
              </span>
              <div className="flex-1 border-b border-dashed border-gray-200/60" />
            </div>
          ))}
          <div className="w-full flex items-center gap-1 sm:gap-2">
            <span className="text-[7.5px] sm:text-[8px] font-bold text-text-muted/80 w-6 text-right shrink-0">
              0분
            </span>
            <div className="flex-1 border-b border-gray-200/80" />
          </div>
        </div>

        <div className="w-full h-[80%] flex items-end justify-around z-10">
          {WEATHER_ITEMS.map((item) => {
            const data = getWeatherData(item.key);
            const avgFocus = data?.avgFocusMinutes ?? 0;
            const percent = avgFocus > 0 ? (avgFocus / maxFocus) * 100 : 0;
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                className="flex flex-col items-center gap-1.5 w-8 sm:w-12 group relative">
                <span className="text-[8.5px] sm:text-[10px] font-extrabold text-emerald-600 tracking-tight transition-opacity duration-200 opacity-0 group-hover:opacity-100 h-4 flex items-center justify-center whitespace-nowrap">
                  {avgFocus > 0 ? `${avgFocus.toFixed(1)}분` : "기록 없음"}
                </span>

                <div
                  className={`w-4 sm:w-6 h-[140px] sm:h-[180px] ${item.trackBg} rounded-full flex items-end overflow-hidden border border-gray-200/40 relative shadow-[inset_1px_2px_4px_rgba(0,0,0,0.06)]`}>
                  <div
                    className={`w-full bg-gradient-to-t ${item.gradient} ${item.shadow} rounded-full transition-all duration-[1000ms] ease-out origin-bottom group-hover:scale-y-[1.03]`}
                    style={{
                      height: isLoaded
                        ? `${Math.min(100, Math.max(0, percent))}%`
                        : "0%",
                    }}
                  />
                </div>

                <div className="flex flex-col items-center gap-1 mt-0.5">
                  <Icon
                    className={`w-4 h-4 ${item.iconColor} transition-all group-hover:scale-115 group-hover:-translate-y-0.5 duration-300`}
                  />
                  <span className="text-[11px] font-bold text-text-muted transition-colors group-hover:text-text">
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherFocusChart;
