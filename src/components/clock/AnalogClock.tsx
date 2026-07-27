import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Panel } from "../common/Panel";
import { getDailyPomodoroLogs } from "../../services/pomodoroLogApi";

export const AnalogClock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadTotals = async () => {
    setIsRefreshing(true);
    try {
      const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
      const logs = await getDailyPomodoroLogs(today);
      if (Array.isArray(logs)) {
        const total = logs.reduce((acc, log) => acc + (log.elapsedFocusSeconds || 0), 0);
        setFocusSeconds(total);
      } else {
        setFocusSeconds(0);
      }
    } catch (e) {
      console.error("Failed to fetch daily logs:", e);
      // API 호출 실패 시 로컬스토리지 값으로 폴백
      try {
        const raw = localStorage.getItem("pomodoro-today-totals");
        if (raw) {
          const parsed = JSON.parse(raw);
          const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
          if (parsed.date === today && typeof parsed.focusSeconds === "number") {
            setFocusSeconds(parsed.focusSeconds);
          }
        }
      } catch {}
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    let animationFrameId: number;
    const updateTime = () => {
      setTime(new Date());
      animationFrameId = requestAnimationFrame(updateTime);
    };
    animationFrameId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    loadTotals();
    const handleUpdate = () => loadTotals();
    window.addEventListener("pomodoro-today-totals-updated", handleUpdate);
    return () => window.removeEventListener("pomodoro-today-totals-updated", handleUpdate);
  }, []);

  // 각도 계산
  const ms = time.getMilliseconds();
  const seconds = time.getSeconds() + ms / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;

  // 디지털 '시 : 분'
  const digitalTime = time.toLocaleTimeString("ko-KR", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  // 집중 시간 계산
  const focusHours = Math.floor(focusSeconds / 3600);
  const focusMinutes = Math.floor((focusSeconds % 3600) / 60);
  const focusSecs = Math.floor(focusSeconds % 60);

  return (
    <>
      <div className="flex items-center justify-center gap-6 p-2 w-full">
        <Panel
          variant="clay"
          inset
          className="relative w-14 h-14 rounded-full p-1 flex items-center justify-center">
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-gray-30 rounded-sm z-10" />
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-gray-30 rounded-sm z-10" />
          <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-gray-30 rounded-sm z-10" />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-gray-30 rounded-sm z-10" />

          <div className="absolute w-1 h-1 bg-text rounded-full z-30 shadow-md" />

          <div
            className="absolute bottom-1/2 left-1/2 w-0.5 h-2 bg-text rounded-full origin-bottom z-10 -translate-x-1/2"
            style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
          />
          <div
            className="absolute bottom-1/2 left-1/2 w-0.5 h-4 bg-slate-600 rounded-full origin-bottom z-10 -translate-x-1/2"
            style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
          />
          <div
            className="absolute bottom-1/2 left-1/2 w-px h-5 bg-red-500 rounded-full origin-bottom z-20 -translate-x-1/2"
            style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }}
          />
        </Panel>

        <div className="text-3xl font-bold tracking-wider">
          {digitalTime}
        </div>
      </div>

      <div className="h-px w-full bg-black/5 dark:bg-white/5 mx-auto my-1" />
      
      <div className="flex flex-col items-center justify-center h-[80px] gap-0.5 p-2 relative overflow-hidden group select-none">
        <div className="flex items-center gap-1.5 ml-4">
          <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider">
            오늘의 총 집중시간
          </span>
          <button
            onClick={loadTotals}
            className="p-1 rounded-full text-text-muted hover:text-primary transition-all active:scale-95 cursor-pointer"
            title="새로고침"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-3xl font-black text-text tracking-tighter">
            {focusHours}
          </span>
          <span className="text-xs font-bold text-text-muted mr-1.5 mb-1">h</span>
          <span className="text-3xl font-black text-text tracking-tighter">
            {String(focusMinutes).padStart(2, "0")}
          </span>
          <span className="text-xs font-bold text-text-muted mr-1.5 mb-1">m</span>
          <span className="text-3xl font-black text-text tracking-tighter">
            {String(focusSecs).padStart(2, "0")}
          </span>
          <span className="text-xs font-bold text-text-muted mb-1">s</span>
        </div>
      </div>
    </>
  );
};
