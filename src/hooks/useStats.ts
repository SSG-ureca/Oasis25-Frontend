import { useState, useEffect } from "react";
import { getWeeklyLogs, getWeatherStats, getEmotionStats, type WeeklyLogResponse, type EmotionStatsResponse } from "../services/statsApi";
import { type WeatherStatsResponse } from "../types/stats";
import { generateSvgPath, smoothData } from "../utils/statsUtils";

export function useStats() {
  const [loading, setLoading] = useState<boolean>(true);
  const [weeklyLogs, setWeeklyLogs] = useState<WeeklyLogResponse[]>([]);
  const [weatherStats, setWeatherStats] = useState<WeatherStatsResponse[]>([]);
  const [emotionStats, setEmotionStats] = useState<EmotionStatsResponse[]>([]);

  useEffect(() => {
    async function initData() {
      try {
        setLoading(true);
        const [logsData, weatherData, emotionData] = await Promise.all([
          getWeeklyLogs(),
          getWeatherStats(),
          getEmotionStats()
        ]);
        setWeeklyLogs(logsData);
        setWeatherStats(weatherData);
        setEmotionStats(emotionData);
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

  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return getLocalDateString(d);
  });

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

  // 모든 요일 그래프가 동일한 세로 비율을 가지도록 전역 최대값(globalMax) 반영
  const weeklyHourlyPaths = dailyHourDataList.map(hours => generateSvgPath(hours, globalMax));

  const getWeatherData = (cond: string): WeatherStatsResponse | undefined => {
    return weatherStats.find(stat => stat.weatherCondition === cond);
  };

  const getBarHeight = (cond: string): number => {
    const data = getWeatherData(cond);
    if (!data || data.avgFocusMinutes === 0) return 0;
    const maxAvgFocus = Math.max(...weatherStats.map(s => s.avgFocusMinutes), 1);
    return (data.avgFocusMinutes / maxAvgFocus) * 120;
  };

  const past35Days = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    return getLocalDateString(d);
  });

  const diaryScores = past35Days.map(dateStr => {
    const stat = emotionStats.find(item => item.date === dateStr);
    return stat ? stat.emotionScore : "none";
  });

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
