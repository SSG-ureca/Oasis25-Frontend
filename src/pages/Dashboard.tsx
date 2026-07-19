// [pages] 대시보드, 로그인 등 독립된 개별 화면 페이지들을 담는 공간입니다.

import { Panel } from "../components/common/Panel";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {/* 왼쪽 열  : 날씨랑 할일목록 */}
      <div className="flex flex-col col-span-2 gap-4">
        <Panel variant="neumorphism" className="p-4">
          날씨
        </Panel>
        <Panel variant="neumorphism" className="p-4">
          할일목록
        </Panel>
      </div>
      {/* 가운데 열 : 뽀모도로 타이머랑 위에 는 미정 */}
      <div className="flex flex-col col-span-3 gap-4">
        <Panel variant="neumorphism" className="p-4">
          미정
        </Panel>
        <Panel variant="neumorphism" className="p-4">
          뽀모도로 타이머
        </Panel>
      </div>
      {/* 오른쪽 열 : 잔디심기랑 밸런스 케어 (카페인 수분) + 선인장 */}
      <div className="flex flex-col col-span-2 gap-4">
        <Panel variant="neumorphism" className="p-4">
          잔디심기
        </Panel>
        <Panel variant="neumorphism" className="p-4">
          선인장
        </Panel>
      </div>

      {/* 뮤직 플레이어 */}
      <div className="col-span-7">
        <Panel variant="neumorphism" className="p-4">
          뮤직 플레이어
        </Panel>
      </div>
    </div>
  );
}
