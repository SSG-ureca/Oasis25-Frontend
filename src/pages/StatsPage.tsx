import { Panel } from "../components/common/Panel";
import { CloudRain, Sun, Cloud, Snowflake } from "lucide-react";

export const StatsPage = () => {
  const username = "오아시스";
  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <Panel
        variant="neumorphism"
        className="w-full h-full p-4 rounded-[32px] flex flex-col min-h-0"
      >
        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 min-h-0">
          {/* 1. 시간대별 통계 */}
          <Panel
            variant="neumorphism"
            inset
            className="p-4 rounded-[20px] flex flex-col justify-between relative overflow-hidden h-full min-h-0"
          >
            <div className="z-10 space-y-1">
              <p className="text-[11px] md:text-xs font-semibold text-gray-700 leading-normal">
                <span className="text-primary font-bold">{username}</span> 님은
                최근 새벽 1시에서 2시 사이의 집중도가 가장 높네요!
              </p>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-[75%] w-full opacity-80 pointer-events-none select-none">
              <svg
                viewBox="0 0 400 150"
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="grad-wave1"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#72c877" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#72c877" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="grad-wave2"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#2c8f31" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2c8f31" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,90 C120,60 200,120 280,75 C340,40 380,95 400,85 L400,150 L0,150 Z"
                  fill="url(#grad-wave2)"
                />
                <path
                  d="M0,105 C80,80 150,130 220,95 C290,60 330,100 400,80 L400,150 L0,150 Z"
                  fill="url(#grad-wave1)"
                />
              </svg>
            </div>
          </Panel>

          {/* 2. 날씨별 통계 */}
          <Panel
            variant="neumorphism"
            inset
            className="p-4 rounded-[20px] flex flex-col justify-between h-full min-h-0"
          >
            <div className="space-y-1">
              <p className="text-[11px] md:text-xs font-semibold text-gray-700 leading-normal">
                <span className="text-emerald-600 font-bold">{username}</span>{" "}
                님은 최근 비오는 날의 집중도가 가장 높네요!
                <br />
                역시 빗소리가 집중력 향상에 도움이 되나봐요!
              </p>
            </div>

            <div className="flex items-end justify-around h-[68%] pb-1">
              {/* 비 */}
              <div className="flex flex-col items-center gap-1 w-12">
                <div className="w-4 bg-gradient-to-t from-emerald-600 to-[#72c877] rounded-full h-24 shadow-[0_4px_12px_rgba(44,143,49,0.15)] animate-pulse" />
                <CloudRain className="w-4 h-4 text-emerald-600" />
                <span className="text-[9px] font-bold text-gray-500">비</span>
              </div>
              {/* 맑음 */}
              <div className="flex flex-col items-center gap-1 w-12">
                <div className="w-4 bg-gray-200/80 rounded-full h-12" />
                <Sun className="w-4 h-4 text-gray-400" />
                <span className="text-[9px] font-bold text-gray-500">맑음</span>
              </div>
              {/* 흐림 */}
              <div className="flex flex-col items-center gap-1 w-12">
                <div className="w-4 bg-gradient-to-t from-emerald-600 to-[#72c877] rounded-full h-18 opacity-80" />
                <Cloud className="w-4 h-4 text-emerald-600" />
                <span className="text-[9px] font-bold text-gray-500">흐림</span>
              </div>
              {/* 눈 */}
              <div className="flex flex-col items-center gap-1 w-12">
                <div className="w-4 bg-gray-200/80 rounded-full h-8" />
                <Snowflake className="w-4 h-4 text-gray-400" />
                <span className="text-[9px] font-bold text-gray-500">눈</span>
              </div>
            </div>
          </Panel>

          {/* 3. 기분별 통계 */}
          <Panel
            variant="neumorphism"
            inset
            className="p-4 rounded-[20px] flex flex-col justify-between h-full min-h-0 relative overflow-hidden"
          >
            <div className="space-y-0.5 z-10">
              <p className="text-[11px] md:text-xs font-bold text-gray-800 leading-normal">
                이번 달 감정 달력
              </p>
              <p className="text-[9px] text-gray-500 font-medium">
                회고가 기록된 날짜를 따라 감정 물감이 부드럽게 스며듭니다.
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center py-2 min-h-0 z-10">
              <div className="w-[238px] aspect-[7/5] md:w-[266px] mx-auto grid grid-cols-7 gap-0 rounded-[10px] overflow-hidden bg-[#e5e9f0]/40 shadow-inner">
                {[
                  { score: 5 },
                  { score: 5 },
                  { score: 2 },
                  { score: "none" },
                  { score: 4 },
                  { score: 4 },
                  { score: 5 },

                  { score: "none" },
                  { score: 3 },
                  { score: 3 },
                  { score: 1 },
                  { score: 4 },
                  { score: 4 },
                  { score: "none" },

                  { score: 5 },
                  { score: 1 },
                  { score: "none" },
                  { score: 2 },
                  { score: 2 },
                  { score: "none" },
                  { score: 5 },

                  { score: "none" },
                  { score: 4 },
                  { score: 4 },
                  { score: 3 },
                  { score: "none" },
                  { score: 4 },
                  { score: "none" },

                  { score: "none" },
                  { score: "none" },
                  { score: 5 },
                  { score: 5 },
                  { score: 2 },
                  { score: "none" },
                  { score: "none" },
                ].map((item, idx) => {
                  let colorClass = "";
                  if (item.score === 1) {
                    colorClass = "bg-[#ef4444]/30";
                  } else if (item.score === 2) {
                    colorClass = "bg-[#6366f1]/30";
                  } else if (item.score === 3) {
                    colorClass = "bg-[#94a3b8]/35";
                  } else if (item.score === 4) {
                    colorClass = "bg-[#10b981]/30";
                  } else if (item.score === 5) {
                    colorClass = "bg-[#f59e0b]/30";
                  }
                  return (
                    <div
                      key={idx}
                      className="relative w-full h-full flex items-center justify-center overflow-visible"
                    >
                      {colorClass && (
                        <div
                          className={`absolute w-[240%] h-[240%] rounded-full filter blur-[14px] md:blur-[18px] pointer-events-none ${colorClass}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 설명 범례 */}
            <div className="flex justify-around items-center text-[7px] font-bold text-gray-500/80 border-t border-black/5 pt-2 shrink-0 z-10 w-full px-1">
              <div className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                <span>😡 1점</span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                <span>😢 2점</span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]" />
                <span>😐 3점</span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                <span>😊 4점</span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                <span>😀 5점</span>
              </div>
            </div>
          </Panel>

          {/* 4. 한 달 집중력 추이 */}
          <Panel
            variant="neumorphism"
            inset
            className="p-4 rounded-[20px] flex flex-col justify-between relative overflow-hidden h-full min-h-0"
          >
            <div className="z-10 space-y-1">
              <p className="text-[11px] md:text-xs font-semibold text-gray-700 leading-normal">
                이번 달{" "}
                <span className="text-emerald-600 font-bold">
                  집중 몰입도가 꾸준히 우상향
                </span>
                하고 있어요! 대단합니다.
              </p>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-[75%] w-full opacity-80 pointer-events-none select-none">
              <svg
                viewBox="0 0 400 150"
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="grad-upward-wave1"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#72c877" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#72c877" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="grad-upward-wave2"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#2c8f31" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2c8f31" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,120 C80,110 160,95 240,65 C320,35 360,25 400,10 L400,150 L0,150 Z"
                  fill="url(#grad-upward-wave2)"
                />
                <path
                  d="M0,135 C80,125 160,110 240,75 C320,40 360,20 400,5 L400,150 L0,150 Z"
                  fill="url(#grad-upward-wave1)"
                />
              </svg>
            </div>

            <div className="z-10 flex justify-between px-2 pb-1 text-[8px] font-bold text-gray-400/80">
              <span>1일</span>
              <span>1주차</span>
              <span>2주차</span>
              <span>3주차</span>
              <span>4주차</span>
              <span>30일</span>
            </div>
          </Panel>
        </div>
      </Panel>
    </div>
  );
};

export default StatsPage;
