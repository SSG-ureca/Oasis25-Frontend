// [pages] 대시보드, 로그인 등 독립된 개별 화면 페이지들을 담는 공간입니다.

import { Panel } from "../components/common/Panel";
import PomodoroTimer from "../components/pomodoro/PomodoroTimer";

export default function Dashboard() {
  return (
    <div className="grid w-full h-full grid-cols-1 gap-6 max-[819px]:h-auto max-[819px]:content-start min-[600px]:grid-cols-[290px_minmax(0px,1fr)] min-[820px]:grid-cols-4">
      {/* 왼쪽 열  : 날씨랑 할일목록 */}
      <div className="flex min-h-0 flex-col gap-6 ">
        <Panel variant="neumorphism" className="min-h-0 flex-1 p-4">
          날씨
        </Panel>
        <Panel variant="neumorphism" className="min-h-0 flex-1 p-4">
          할일목록
        </Panel>
      </div>
      {/* 가운데 열 : 뽀모도로 타이머랑 위에 는 미정 */}
      {/* 820px 미만(단일 컬럼)에서는 이 열을 최상단으로 이동 */}
      <div className="flex min-h-[284px] flex-col gap-6 order-first min-[820px]:order-none min-[820px]:col-span-2">
        {/* 820px 미만에서는 뽀모도로 타이머를 먼저 표시 */}
        <Panel
          variant="neumorphism"
          className="min-h-[380px] min-w-[290px] flex-1 p-2 order-first min-[820px]:order-none">
          <PomodoroTimer />
        </Panel>
        <Panel variant="neumorphism" className="min-h-0 flex-1 p-4">
          <div className="background-container">
            <div className="liquid-glass">
              {/* 텍스트나 아이콘을 넣을 수 있습니다 */}
              <span>Drop</span>
            </div>
          </div>
        </Panel>
      </div>
      {/* 오른쪽 열 : 잔디심기랑 밸런스 케어 (카페인 수분) + 선인장 */}
      <div className="flex min-h-0 flex-col gap-6 max-[819px]:col-span-2 max-[599px]:col-span-1">
        <Panel variant="neumorphism" className="min-h-0 flex-1 p-4">
          잔디심기
        </Panel>
        <Panel variant="neumorphism" className="min-h-0 flex-1 p-4">
          선인장
        </Panel>
      </div>
    </div>
  );
}
