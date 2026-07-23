import { useState, useEffect } from "react";
import { getWeeklyLogs, type WeeklyLogResponse } from "../services/statsApi";
import { generateSvgPath, smoothData } from "../utils/statsUtils";

export function useStats() {
  const [loading, setLoading] = useState<boolean>(true);
  const [weeklyLogs, setWeeklyLogs] = useState<WeeklyLogResponse[]>([]);

  useEffect(() => {
    async function initData() {
      try {
        setLoading(true);
        const data = await getWeeklyLogs();
        setWeeklyLogs(data);
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 오늘을 포함한 최근 7일의 로컬 날짜 문자열 배열 생성 (연대기 순)
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return getLocalDateString(d);
  });

  // 최근 7일 각각의 24시간 몰입 누적 시간(분) 계산
  const dailyHourDataList = past7Days.map(dateStr => {
    const hours = Array(24).fill(0);
    weeklyLogs.forEach(log => {
      if (log.createdAt) {
        const logDate = new Date(log.createdAt);
        const logDateStr = getLocalDateString(logDate);
        if (logDateStr === dateStr) {
          const hour = logDate.getHours();
          hours[hour] += log.focusMinutes;
        }
      }
    });
    return hours;
  });

  const smoothedDailyHourDataList = dailyHourDataList.map(hours => smoothData(hours));
  const globalMax = Math.max(...smoothedDailyHourDataList.flatMap(h => h), 1);

  // 모든 요일이 일관된 스케일로 렌더링되도록 전역 최대치(globalMax)를 반영하여 SVG 경로 생성
  const weeklyHourlyPaths = dailyHourDataList.map(hours => generateSvgPath(hours, globalMax));

  const getWeatherData = (_cond: string): any => undefined;
  const getBarHeight = (_cond: string): number => 10;
  const diaryScores = Array(35).fill("none");
  const trendPaths = { fill1: "M 0,130 L 400,130", fill2: "M 0,130 L 400,130" };

  return {
    loading,
    weeklyHourlyPaths,
    dailyHourDataList,
    getWeatherData,
    getBarHeight,
    diaryScores,
    trendPaths,
  };
}
export default useStats;
