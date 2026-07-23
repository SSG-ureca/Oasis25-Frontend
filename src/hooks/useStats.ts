import { useState, useEffect } from "react";
import { getPomodoroLogs, getWeatherStats, getAllDiaries } from "../services/statsApi";
import { generateSvgPath } from "../utils/statsUtils";
import type { WeatherStatsResponse, PomodoroLogResponse } from "../types/stats";
import type { RetrospectResponse } from "../types/retrospect";

export function useStats() {
  const [loading, setLoading] = useState<boolean>(true);
  const [weatherStats, setWeatherStats] = useState<WeatherStatsResponse[]>([]);
  const [weeklyLogs, setWeeklyLogs] = useState<PomodoroLogResponse[]>([]);
  const [monthlyLogs, setMonthlyLogs] = useState<{ [date: string]: PomodoroLogResponse[] }>({});
  const [diaries, setDiaries] = useState<RetrospectResponse[]>([]);

  useEffect(() => {
    async function initData() {
      try {
        setLoading(true);
        const [weatherData, diariesData] = await Promise.all([
          getWeatherStats(),
          getAllDiaries()
        ]);

        setWeatherStats(weatherData);
        setDiaries(diariesData);

        const getLocalDateString = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        // Fetch logs for the past 7 days (including today)
        const past7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return getLocalDateString(d);
        });

        const weeklyPromises = past7Days.map(async (dStr) => {
          try {
            return await getPomodoroLogs(dStr);
          } catch (e) {
            return [];
          }
        });
        const weeklyLogsList = await Promise.all(weeklyPromises);
        setWeeklyLogs(weeklyLogsList.flat());

        // Fetch logs for the past 30 days
        const pastDates = Array.from({ length: 30 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          return getLocalDateString(d);
        });

        const logsPromises = pastDates.map(async (dStr) => {
          try {
            const logs = await getPomodoroLogs(dStr);
            return { date: dStr, logs };
          } catch (e) {
            return { date: dStr, logs: [] };
          }
        });

        const allLogs = await Promise.all(logsPromises);
        const logsMap: { [date: string]: PomodoroLogResponse[] } = {};
        allLogs.forEach(item => {
          logsMap[item.date] = item.logs;
        });
        setMonthlyLogs(logsMap);
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // Hour stats aggregation (00시 - 23시) for the past 7 days
  const hourData = Array(24).fill(0);
  weeklyLogs.forEach(log => {
    if (log.completed && log.createdAt) {
      const date = new Date(log.createdAt);
      const hour = date.getHours();
      hourData[hour] += log.focusMinutes;
    }
  });
  const hourlyPaths = generateSvgPath(hourData);

  // Weather stats logic
  const maxAvgFocus = Math.max(...weatherStats.map(w => w.avgFocusMinutes), 1);
  const getWeatherData = (cond: string) => weatherStats.find(w => w.weatherCondition === cond);
  const getBarHeight = (cond: string) => {
    const data = getWeatherData(cond);
    if (!data) return 10;
    return Math.max(10, (data.avgFocusMinutes / maxAvgFocus) * 100);
  };

  // Emotion score calendar logic (past 35 days)
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    return d.toISOString().split("T")[0];
  });
  const diaryScores = calendarDays.map(dateStr => {
    const diary = diaries.find(d => d.diaryDate === dateStr);
    return diary ? diary.emotionScore : "none";
  });

  // 30-Day trend aggregation
  const trendData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dStr = d.toISOString().split("T")[0];
    const logs = monthlyLogs[dStr] || [];
    return logs.reduce((sum, log) => sum + (log.completed ? log.focusMinutes : 0), 0);
  });
  const trendPaths = generateSvgPath(trendData);

  return {
    loading,
    hourlyPaths,
    getWeatherData,
    getBarHeight,
    diaryScores,
    trendPaths
  };
}
