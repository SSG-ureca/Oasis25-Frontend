import React, { useState, useEffect } from "react";
import { Panel } from "../common/Panel";

export const AnalogClock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    let animationFrameId: number;

    // 매 프레임(약 60fps)마다 시간을 업데이트하여 부드러운 움직임 구현
    const updateTime = () => {
      setTime(new Date());
      animationFrameId = requestAnimationFrame(updateTime);
    };

    animationFrameId = requestAnimationFrame(updateTime);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // 1. 각도 계산 (밀리초까지 포함하여 연속적인 각도 생성)
  const ms = time.getMilliseconds();
  const seconds = time.getSeconds() + ms / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const secondDeg = seconds * 6; // 360도 / 60초 = 초당 6도
  const minuteDeg = minutes * 6; // 360도 / 60분 = 분당 6도
  const hourDeg = hours * 30; // 360도 / 12시간 = 시간당 30도

  // 2. 디지털 '시 : 분' 포맷팅 (예: 14:05)
  const digitalTime = time.toLocaleTimeString("ko-KR", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-center justify-evenly p-2">
      {/* 아날로그 시계 본체 */}
      <Panel
        variant="clay"
        inset
        className="relative w-14 h-14 rounded-full p-1 flex items-center justify-center">
        {/* === 12, 3, 6, 9시 눈금 (원에서 밖으로 조금 튀어나옴) === */}
        {/* 12시 */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-gray-30 rounded-sm z-10" />
        {/* 6시 */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-gray-30 rounded-sm z-10" />
        {/* 9시 */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-gray-30 rounded-sm z-10" />
        {/* 3시 */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-gray-30 rounded-sm z-10" />

        {/* === 중앙 핀 (바늘들이 모이는 중심) === */}
        <div className="absolute w-1 h-1 bg-text rounded-full z-30 shadow-md" />

        {/* === 시침 (Hour Hand) === */}
        <div
          className="absolute bottom-1/2 left-1/2 w-0.5 h-2 bg-text rounded-full origin-bottom z-10 -translate-x-1/2"
          style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
        />

        {/* === 분침 (Minute Hand) === */}
        <div
          className="absolute bottom-1/2 left-1/2 w-0.5 h-4 bg-slate-600 rounded-full origin-bottom z-10 -translate-x-1/2"
          style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
        />

        {/* === 초침 (Second Hand) === */}
        <div
          className="absolute bottom-1/2 left-1/2 w-px h-5 bg-red-500 rounded-full origin-bottom z-20 -translate-x-1/2"
          style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }}
        />
      </Panel>

      {/* 디지털 시간 표시 (시 : 분) */}
      <div className="text-3xl font-bold font-mono tracking-wider ">
        {digitalTime}
      </div>
    </div>
  );
};
