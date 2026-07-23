// [pages] 대시보드, 로그인 등 독립된 개별 화면 페이지들을 담는 공간입니다.

import { Panel } from "../components/common/Panel";
import PomodoroTimer from "../components/pomodoro/PomodoroTimer";
import { useEffect, useState } from "react";
import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Loader2,
  Snowflake,
  Sun,
  Thermometer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useWeather } from "../services/weatherApi";

const ICONS: Record<string, LucideIcon> = {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  Loader2,
};

function WeatherPanel() {
  const [coords, setCoords] = useState({ lat: 37.5665, lon: 126.978 });

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {},
      { timeout: 8000 },
    );
  }, []);

  const weather = useWeather(coords.lat, coords.lon);
  const Icon = ICONS[weather.iconName] ?? Cloud;

  return (
    <div className="flex h-full w-full flex-col justify-between p-1">
      <div className="text-sm font-medium text-slate-500">서울, 대한민국</div>
      <div className="flex items-center justify-between p-2">
        {weather.loading ? (
          <Loader2 className="h-10 w-10 animate-spin text-slate-500" />
        ) : (
          <>
            <Panel variant="clay" inset className="p-2 rounded-full">
              <Icon className="h-14 w-14 text-slate-700" />
            </Panel>

            <div className="text-3xl font-bold text-slate-800">
              {weather.temp !== null ? `${weather.temp}°` : "--"}
              <span className="text-sm text-slate-600">{weather.skyText}</span>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-between p-2 text-xs text-slate-600">
        <div className="flex items-center">
          <Droplets className="h-4 w-4" />
          <span>
            습도 {weather.humidity !== null ? `${weather.humidity}%` : "--"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Thermometer className="h-4 w-4" />
          <span>
            체감 {weather.feelsLike !== null ? `${weather.feelsLike}°` : "--"}
          </span>
        </div>
      </div>
      {weather.error && (
        <div className="max-w-full truncate text-xs text-red-500">
          {weather.error}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div
      className="grid h-full w-full grid-cols-1 gap-6
        max-820:h-auto max-820:content-start
        600:grid-cols-[290px_minmax(0px,1fr)]
        820:grid-cols-4">
      {/* 왼쪽 열  : 날씨랑 할일목록 */}
      <div className="flex min-h-0 flex-col gap-6">
        <Panel variant="clay" className="min-h-0 flex-1 p-4">
          <WeatherPanel />
        </Panel>
        <Panel variant="clay" className="min-h-0 flex-1 p-4">
          할일목록
        </Panel>
      </div>
      {/* 가운데 열 : 뽀모도로 타이머랑 위에 는 미정 */}
      {/* 820px 미만(단일 컬럼)에서는 이 열을 최상단으로 이동 */}
      <div
        className="order-first flex min-h-[284px] flex-col gap-6
          820:order-0 820:col-span-2">
        {/* 820px 미만에서는 뽀모도로 타이머를 먼저 표시 */}
        <Panel
          variant="clay"
          className="order-first min-h-[380px] min-w-[290px] flex-1 p-2
            820:order-0">
          <PomodoroTimer />
        </Panel>
        <Panel variant="clay" className="min-h-0 flex-1 p-4">
          <div className="background-container">
            <div className="liquid-glass">
              {/* 텍스트나 아이콘을 넣을 수 있습니다 */}
              <span>Drop</span>
            </div>
          </div>
        </Panel>
      </div>
      {/* 오른쪽 열 : 잔디심기랑 밸런스 케어 (카페인 수분) + 선인장 */}
      <div
        className="flex min-h-0 flex-col gap-6
          max-820:col-span-2 max-600:col-span-1">
        <Panel variant="clay" className="min-h-0 flex-1 p-4">
          잔디심기
        </Panel>
        <Panel variant="clay" className="min-h-0 flex-1 p-4">
          선인장
        </Panel>
      </div>
    </div>
  );
}
