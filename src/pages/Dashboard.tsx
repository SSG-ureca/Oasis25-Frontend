// [pages] 대시보드, 로그인 등 독립된 개별 화면 페이지들을 담는 공간입니다.

import { useState } from "react";
import { Panel } from "../components/common/Panel";
import PomodoroTimer from "../components/pomodoro/PomodoroTimer";

import { AnalogClock } from "../components/clock/AnalogClock";
import { WeatherPanel } from "../components/weather/WeatherPanel";
import { Todo } from "../components/todo/Todo";
import { QuoteCard } from "../components/splash/QuoteCard";
import { WaterCaffeinePanel } from "../components/waterCaffeine/WaterCaffeinePanel";

export default function Dashboard() {
  const [isFocusMode, setIsFocusMode] = useState(false);

  return (
    <div
      className={`grid min-h-full w-full gap-6 pb-4 transition-all duration-300 ${
        isFocusMode
          ? "grid-cols-1 680:grid-cols-[1fr_300px]"
          : "grid-cols-1 max-880:h-auto max-880:content-start 680:grid-cols-[290px_minmax(290px,1fr)] 880:grid-cols-[290px_minmax(290px,2fr)_minmax(175px,1fr)]"
      }`}>
      {/* 왼쪽 열 : 날씨랑 할일목록 */}
      <div
        className={`min-h-0 min-w-[290px] flex-col gap-6 ${
          isFocusMode ? "hidden" : "flex"
        }`}>
        <Panel variant="clay" className="shrink-0 p-4">
          <WeatherPanel />
        </Panel>
        <Panel variant="clay" className="min-h-0 flex-1 p-4">
          <Todo />
        </Panel>
      </div>
      <div className="order-first flex flex-col gap-6 880:order-0">
        <Panel
          variant="clay"
          className={`order-first flex-1 p-2 880:order-0 transition-all duration-300 ${
            isFocusMode
              ? "flex min-h-[480px] p-4"
              : "min-h-[380px] min-w-[290px]"
          }`}>
          <PomodoroTimer onFocusModeChange={setIsFocusMode} />
        </Panel>
        {!isFocusMode && (
          <Panel variant="clay" className="min-w-[290px] h-auto shrink-0 p-2">
            <div className="background-container">
              <div className="liquid-glass">
                <QuoteCard />
              </div>
            </div>
          </Panel>
        )}
      </div>
      <div
        className={`flex min-h-0 flex-col gap-6 ${
          isFocusMode
            ? "min-w-[300px]"
            : "min-w-[175px] 680:col-span-2 880:col-span-1"
        }`}>
        {!isFocusMode && (
          <Panel variant="clay" className="p-2 shrink-0 flex flex-col">
            <AnalogClock />
          </Panel>
        )}
        <Panel variant="clay" className="flex-1 p-4">
          <WaterCaffeinePanel />
        </Panel>
      </div>
    </div>
  );
}
