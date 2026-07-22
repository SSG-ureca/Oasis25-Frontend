import { useState } from "react";
import { Panel } from "../components/common/Panel";
import { MusicPlayer } from "../components/common/MusicPlayer";
import { 
  CloudRain, 
  Sun, 
  Cloud, 
  Snowflake, 
  Clock, 
  CloudSun, 
  Palette, 
  TrendingUp 
} from "lucide-react";

export const StatsPage = () => {
  const username = "오아시스";
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="w-full h-full flex flex-col gap-4 min-h-0 bg-transparent">
      
      {/* 중앙 베이스 플레이트 패널 */}
      <div className="flex-1 min-h-0">
        <Panel
          variant="neumorphism"
          className="w-full h-full p-3 sm:p-4 rounded-[36px] flex flex-col min-h-0"
        >
          {/* 스플릿 레이아웃 */}
          <div className="w-full flex-1 flex gap-3 min-h-0">
            
            {/* 좌측 수직 네비게이션 독 */}
            <Panel
              variant="neumorphism"
              inset
              className="w-[76px] sm:w-[90px] h-full rounded-[24px] flex flex-col items-center justify-between py-6 shrink-0"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />

              <div className="flex flex-col gap-6">
                {[
                  { id: 0, icon: Clock, label: "시간대 분석" },
                  { id: 1, icon: CloudSun, label: "날씨별 몰입" },
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
                      className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-bg-light text-emerald-600 shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.7),_inset_2px_2px_5px_rgba(0,0,0,0.08)]"
                          : "bg-bg-light text-gray-400 hover:text-gray-600 shadow-[-3px_-3px_7px_rgba(255,255,255,0.8),_3px_3px_7px_rgba(0,0,0,0.08)] hover:scale-105 active:shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.7),_inset_1px_1px_3px_rgba(0,0,0,0.08)]"
                      }`}
                    >
                      <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                    </button>
                  );
                })}
              </div>

              <div className="w-1.5 h-1.5 rounded-full bg-gray-400/40" />
            </Panel>

            {/* 우측 디테일 분석 캔버스 */}
            <Panel
              variant="neumorphism"
              inset
              className="flex-1 h-full rounded-[28px] p-6 sm:p-8 flex flex-col min-h-0 justify-between relative overflow-hidden"
            >
              
              {/* 시간대별 몰입 분석 */}
              {activeTab === 0 && (
                <div className="w-full h-full flex flex-col justify-between relative">
                  <div className="z-10 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600">Peak Focus Hours</span>
                    <h2 className="text-base sm:text-lg font-extrabold text-gray-800 tracking-tight">시간대별 몰입 분석</h2>
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 leading-relaxed max-w-[450px]">
                      <span className="text-emerald-600 font-extrabold">{username}</span> 님은 최근 <span className="text-gray-900 font-extrabold">새벽 1시 - 2시</span> 사이의 집중도가 가장 높은 경향을 보였습니다.
                    </p>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-[60%] w-full opacity-80 pointer-events-none select-none">
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
                      <path d="M0,90 C120,60 200,120 280,75 C340,40 380,95 400,85 L400,150 L0,150 Z" fill="url(#grad-wave2)" />
                      <path d="M0,105 C80,80 150,130 220,95 C290,60 330,100 400,80 L400,150 L0,150 Z" fill="url(#grad-wave1)" />
                    </svg>
                  </div>

                  <div className="z-10 flex justify-between px-2 pb-1 text-[9px] font-bold text-gray-400/80">
                    <span>00시</span>
                    <span>06시</span>
                    <span>12시</span>
                    <span>18시</span>
                    <span>24시</span>
                  </div>
                </div>
              )}

              {/* 날씨별 몰입도 비교 */}
              {activeTab === 1 && (
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600">Weather Focus Analytics</span>
                    <h2 className="text-base sm:text-lg font-extrabold text-gray-800 tracking-tight">날씨별 몰입도 비교</h2>
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 leading-relaxed max-w-[450px]">
                      <span className="text-emerald-600 font-extrabold">{username}</span> 님은 비오는 날 가장 짙은 몰입 상태를 기록했습니다. 빗소리가 천연 집중 보조제 역할을 해줍니다.
                    </p>
                  </div>

                  <div className="flex items-end justify-around h-[58%] pb-2">
                    <div className="flex flex-col items-center gap-2 w-14">
                      <div className="w-5 bg-gradient-to-t from-emerald-600 to-[#10b981] rounded-full h-32 shadow-[0_4px_12px_rgba(16,185,129,0.2)] animate-pulse" />
                      <CloudRain className="w-5 h-5 text-emerald-600" />
                      <span className="text-[11px] font-bold text-gray-700">비</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-14">
                      <div className="w-5 bg-gray-300/60 rounded-full h-16" />
                      <Sun className="w-5 h-5 text-gray-400" />
                      <span className="text-[11px] font-bold text-gray-400">맑음</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-14">
                      <div className="w-5 bg-gradient-to-t from-emerald-600 to-[#10b981] rounded-full h-24 opacity-80" />
                      <Cloud className="w-5 h-5 text-emerald-600" />
                      <span className="text-[11px] font-bold text-gray-700">흐림</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-14">
                      <div className="w-5 bg-gray-300/60 rounded-full h-10" />
                      <Snowflake className="w-5 h-5 text-gray-400" />
                      <span className="text-[11px] font-bold text-gray-400">눈</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 감정 흐름 달력 */}
              {activeTab === 2 && (
                <div className="w-full h-full flex flex-col justify-between relative">
                  <div className="space-y-1.5 z-10">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600">Watercolor Emotion Flow</span>
                    <h2 className="text-base sm:text-lg font-extrabold text-gray-800 tracking-tight">감정 흐름 달력</h2>
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 leading-relaxed max-w-[450px]">
                      회고가 기록된 일자를 중심으로 감정 상태의 수채화 번짐 틴트가 유기적으로 흘러 다닙니다.
                    </p>
                  </div>

                  <div className="flex-1 flex items-center justify-center py-2 min-h-0 z-10">
                    <div className="w-[280px] aspect-[7/5] md:w-[322px] mx-auto grid grid-cols-7 gap-0 rounded-[12px] overflow-hidden bg-[#e5e9f0]/40 shadow-inner">
                      {[
                        { score: 5 }, { score: 5 }, { score: 2 }, { score: "none" }, { score: 4 }, { score: 4 }, { score: 5 },
                        { score: "none" }, { score: 3 }, { score: 3 }, { score: 1 }, { score: 4 }, { score: 4 }, { score: "none" },
                        { score: 5 }, { score: 1 }, { score: "none" }, { score: 2 }, { score: 2 }, { score: "none" }, { score: 5 },
                        { score: "none" }, { score: 4 }, { score: 4 }, { score: 3 }, { score: "none" }, { score: 4 }, { score: "none" },
                        { score: "none" }, { score: "none" }, { score: 5 }, { score: 5 }, { score: 2 }, { score: "none" }, { score: "none" },
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
                          <div key={idx} className="relative w-full h-full flex items-center justify-center overflow-visible">
                            {colorClass && (
                              <div
                                  className={`absolute w-[240%] h-[240%] rounded-full filter blur-[12px] sm:blur-[18px] pointer-events-none ${colorClass}`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 설명 범례 */}
                  <div className="flex justify-around items-center text-[9px] sm:text-[10px] font-bold text-gray-500/80 border-t border-black/5 pt-2.5 shrink-0 w-full px-1 z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80 shadow-[0_0_6px_rgba(239,68,68,0.3)]" />
                      <span>스트레스</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]/80 shadow-[0_0_6px_rgba(99,102,241,0.3)]" />
                      <span>불안/슬픔</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]/80 shadow-[0_0_6px_rgba(148,163,184,0.3)]" />
                      <span>보통</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]/80 shadow-[0_0_6px_rgba(16,185,129,0.3)]" />
                      <span>차분함</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80 shadow-[0_0_6px_rgba(245,158,11,0.3)]" />
                      <span>행복</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 30일 집중력 트렌드 */}
              {activeTab === 3 && (
                <div className="w-full h-full flex flex-col justify-between relative">
                  <div className="z-10 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600">30-Day Monthly Trend</span>
                    <h2 className="text-base sm:text-lg font-extrabold text-gray-800 tracking-tight">30일 몰입도 변화 트렌드</h2>
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 leading-relaxed max-w-[450px]">
                      최근 30일 동안의 평균 집중 지표 추이가 점진적인 우상향의 안정적인 성장을 나타내고 있습니다.
                    </p>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-[60%] w-full opacity-80 pointer-events-none select-none">
                    <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="grad-upward-wave1" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="grad-upward-wave2" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#047857" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#047857" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,120 C80,110 160,95 240,65 C320,35 360,25 400,10 L400,150 L0,150 Z" fill="url(#grad-upward-wave2)" />
                      <path d="M0,135 C80,125 160,110 240,75 C320,40 360,20 400,5 L400,150 L0,150 Z" fill="url(#grad-upward-wave1)" />
                    </svg>
                  </div>

                  <div className="z-10 flex justify-between px-2 pb-1 text-[9px] font-bold text-gray-400/80">
                    <span>1일</span>
                    <span>1주차</span>
                    <span>2주차</span>
                    <span>3주차</span>
                    <span>4주차</span>
                    <span>30일</span>
                  </div>
                </div>
              )}

            </Panel>
          </div>
        </Panel>
      </div>

      {/* 하단 뮤직 플레이어 */}
      <div className="shrink-0 z-10">
        <MusicPlayer />
      </div>

    </div>
  );
};

export default StatsPage;
