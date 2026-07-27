// [pages] 대시보드, 로그인 등 독립된 개별 화면 페이지들을 담는 공간입니다.

import { Panel } from "../components/common/Panel";
import PomodoroTimer from "../components/pomodoro/PomodoroTimer";

import { AnalogClock } from "../components/clock/AnalogClock";
import { WeatherPanel } from "../components/weather/WeatherPanel";
import { Todo } from "../components/todo/Todo";
import { QuoteCard } from "../components/splash/QuoteCard";
import { WaterCaffeinePanel } from "../components/waterCaffeine/WaterCaffeinePanel";

export default function Dashboard() {
  return (
    <div
      className="grid h-full w-full grid-cols-1 gap-6
        max-880:h-auto max-880:content-start
        680:grid-cols-[290px_minmax(290px,1fr)]
        880:grid-cols-[290px_minmax(290px,2fr)_minmax(175px,1fr)]">
      {/* 왼쪽 열  : 날씨랑 할일목록 */}
      <div className="flex min-h-0 min-w-[290px] flex-col gap-6">
        <Panel variant="clay" className="shrink-0 p-4">
          <WeatherPanel />
        </Panel>
        <Panel variant="clay" className="min-h-0 flex-1 p-4">
          <Todo />
        </Panel>
      </div>
      {/* 가운데 열 : 뽀모도로 타이머랑 위에 는 미정 */}
      {/* 820px 미만(단일 컬럼)에서는 이 열을 최상단으로 이동 */}
      <div
        className="order-first flex flex-col gap-6
          880:order-0">
        {/* 820px 미만에서는 뽀모도로 타이머를 먼저 표시 */}
        <Panel
          variant="clay"
          className="order-first min-h-[380px] min-w-[290px] flex-1 p-2
            880:order-0">
          <PomodoroTimer />
        </Panel>
        <Panel variant="clay" className="min-w-[290px] flex-1 p-4">
          <div className="background-container">
            <div className="liquid-glass">
              {/* 텍스트나 아이콘을 넣을 수 있습니다 */}
              <QuoteCard />
            </div>
          </div>
        </Panel>
      </div>
      {/* 오른쪽 열 : 시계, 밸런스 케어 (카페인 수분) + 선인장 */}
      <div
        className="flex min-h-0 min-w-[175px] flex-col gap-6
          680:col-span-2 880:col-span-1">
        <Panel variant="clay" className="p-2">
          <AnalogClock />
        </Panel>
        <Panel variant="clay" className="flex-1 p-4">
          <WaterCaffeinePanel />
        </Panel>
      </div>
    </div>
  );
}
