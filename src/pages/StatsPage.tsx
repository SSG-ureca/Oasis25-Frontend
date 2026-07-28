import { useState, useEffect } from "react";
import { Panel } from "../components/common/Panel";
import { clayVariants } from "../types/clayVariants";
import { cn } from "../utils/cn";
import { Clock, CloudSun, Palette, TrendingUp } from "lucide-react";
import { useStats } from "../hooks/useStats";
import { HourlyFocusChart } from "../components/stats/HourlyFocusChart";
import { WeatherFocusChart } from "../components/stats/WeatherFocusChart";
import { EmotionCalendar } from "../components/stats/EmotionCalendar";

export const StatsPage = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [trendLoaded, setTrendLoaded] = useState(false);
  const {
    loading,
    weeklyHourlyPaths,
    dailyHourDataList,
    getWeatherData,
    diaryScores,
    trendPaths,
    trendMessage,
  } = useStats();

  useEffect(() => {
    if (activeTab === 3) {
      const timer = setTimeout(() => setTrendLoaded(true), 50);
      return () => clearTimeout(timer);
    } else {
      setTrendLoaded(false);
    }
  }, [activeTab]);

  return (
    <div id="tour-stats-content" className="w-full h-full flex flex-col gap-4 min-h-0 bg-transparent">
      {/* 중앙 베이스 플레이트 패널 */}
      <div className="flex-1 min-h-0">
        <Panel
          variant="clay"
          className="w-full h-full p-3 sm:p-4 rounded-[36px] flex flex-col min-h-0">
          {/* 스플릿 레이아웃 (모바일에서는 수직, 테블릿/PC(md)에서는 수평 배치) */}
          <div className="w-full flex-1 flex flex-col md:flex-row gap-3 min-h-0">
            {/* 좌측/상단 네비게이션 독 (반응형 대응) */}
            <Panel
              variant="clay"
              inset
              className="w-full md:w-[100px] h-auto md:h-full rounded-[20px] md:rounded-[24px] flex flex-row md:flex-col items-center justify-between px-2 py-2 md:px-2 md:py-4 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-green-50 shadow-[0_0_8px_rgba(44,143,49,0.6)] hidden md:block" />

              <div className="flex flex-row md:flex-col gap-2 md:gap-3 justify-around w-full md:w-auto">
                {[
                  { id: 0, icon: Clock, label: "시간대 분석" },
                  { id: 1, icon: CloudSun, label: "날씨별 집중" },
                  { id: 2, icon: Palette, label: "감정 흐름" },
                  { id: 3, icon: TrendingUp, label: "성장 트렌드" },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      title={item.label}
                      className={cn(
                        "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center transition-all duration-300",
                        clayVariants({ variant: "clay", inset: isActive }),
                        "rounded-xl",
                        isActive
                          ? "text-green-50"
                          : "text-text-muted hover:text-text hover:scale-105"
                      )}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                    </button>
                  );
                })}
              </div>

              <div className="w-1.5 h-1.5 rounded-full bg-gray-400/40 hidden md:block" />
            </Panel>

            {/* 우측/하단 디테일 분석 캔버스 (모바일에서 넘치면 스크롤되도록 overflow-y-auto 적용) */}
            <Panel
              variant="clay"
              inset
              className="flex-1 h-full rounded-[28px] p-4 sm:p-6 md:p-8 flex flex-col min-h-0 justify-between relative overflow-y-auto md:overflow-hidden">
              {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-text-muted font-bold text-sm">
                  <span>데이터를 불러오는 중입니다...</span>
                </div>
              ) : (
                <>
                  {/* 시간대별 집중 분석 */}
                  {activeTab === 0 && (
                    <HourlyFocusChart
                      weeklyHourlyPaths={weeklyHourlyPaths}
                      dailyHourDataList={dailyHourDataList}
                    />
                  )}

                  {/* 날씨별 집중도 비교 */}
                  {activeTab === 1 && (
                    <WeatherFocusChart
                      getWeatherData={getWeatherData}
                    />
                  )}

                  {/* 감정 흐름 달력 */}
                  {activeTab === 2 && (
                    <EmotionCalendar diaryScores={diaryScores} />
                  )}

                  {/* 30일 집중력 트렌드 */}
                  {activeTab === 3 && (
                    <div
                      className={`w-full h-full flex flex-col justify-between relative transition-all duration-[800ms] ease-out ${trendLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                      <div className="z-10 space-y-1.5">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-green-50">
                          30-Day Monthly Trend
                        </span>
                        <h2 className="text-base sm:text-lg font-extrabold text-text tracking-tight">
                          30일 집중도 변화 트렌드
                        </h2>
                        <p className="text-xs sm:text-sm font-semibold text-text-muted leading-relaxed break-keep whitespace-normal lg:whitespace-nowrap">
                          {trendMessage}
                        </p>
                      </div>

                      <div className="absolute inset-x-0 bottom-8 h-[60%] w-full pointer-events-none select-none overflow-visible">
                        <svg
                          viewBox="0 0 400 150"
                          className="w-full h-full overflow-visible"
                          preserveAspectRatio="none">
                          <defs>
                            <linearGradient
                              id="premium-line-grad"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%">
                              <stop offset="0%" stopColor="#1a521d" />
                              <stop offset="50%" stopColor="#2c8f31" />
                              <stop offset="100%" stopColor="#72c877" />
                            </linearGradient>

                            <linearGradient
                              id="premium-fill-grad"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%">
                              <stop
                                offset="0%"
                                stopColor="#72c877"
                                stopOpacity="0.2"
                              />
                              <stop
                                offset="50%"
                                stopColor="#2c8f31"
                                stopOpacity="0.05"
                              />
                              <stop
                                offset="100%"
                                stopColor="#1a521d"
                                stopOpacity="0"
                              />
                            </linearGradient>

                            <filter
                              id="neon-glow"
                              x="-10%"
                              y="-10%"
                              width="120%"
                              height="120%">
                              <feDropShadow
                                dx="0"
                                dy="3"
                                stdDeviation="5"
                                floodColor="#72c877"
                                floodOpacity="0.35"
                              />
                            </filter>
                          </defs>

                          <line
                            x1="0"
                            y1="35"
                            x2="400"
                            y2="35"
                            stroke="#e2e8f0"
                            strokeOpacity="0.25"
                            strokeDasharray="3, 3"
                            strokeWidth="1"
                          />
                          <line
                            x1="0"
                            y1="80"
                            x2="400"
                            y2="80"
                            stroke="#e2e8f0"
                            strokeOpacity="0.25"
                            strokeDasharray="3, 3"
                            strokeWidth="1"
                          />
                          <line
                            x1="0"
                            y1="125"
                            x2="400"
                            y2="125"
                            stroke="#e2e8f0"
                            strokeOpacity="0.25"
                            strokeDasharray="3, 3"
                            strokeWidth="1"
                          />

                          <path
                            d={trendPaths.fill}
                            fill="url(#premium-fill-grad)"
                            className="transition-opacity duration-[1000ms] ease-out"
                            style={{
                              opacity: trendLoaded ? 1 : 0,
                              transitionDelay: "800ms",
                            }}
                          />

                          <path
                            d={trendPaths.line}
                            fill="none"
                            stroke="url(#premium-line-grad)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#neon-glow)"
                            className="transition-all duration-[2000ms] ease-out"
                            style={{
                              strokeDasharray: 1200,
                              strokeDashoffset: trendLoaded ? 0 : 1200,
                              transitionDelay: "100ms",
                            }}
                          />
                        </svg>
                      </div>

                      <div className="z-10 flex justify-between px-1 pb-1 text-[8.5px] sm:text-[9px] font-bold text-text-muted/80">
                        <span>1일</span>
                        <span>3일</span>
                        <span>6일</span>
                        <span>9일</span>
                        <span>12일</span>
                        <span>15일</span>
                        <span>18일</span>
                        <span>21일</span>
                        <span>24일</span>
                        <span>27일</span>
                        <span>30일</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Panel>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default StatsPage;
