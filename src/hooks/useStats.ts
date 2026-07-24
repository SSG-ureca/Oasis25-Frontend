import { useState, useEffect } from "react";
import { getWeeklyLogs, getWeatherStats, getEmotionStats, getFocusTrend, type WeeklyLogResponse, type EmotionStatsResponse, type FocusTrendResponse } from "../services/statsApi";
import { type WeatherStatsResponse } from "../types/stats";
import { generateSvgPath, smoothData, generateTrendPath } from "../utils/statsUtils";

export function useStats() {
  const [loading, setLoading] = useState<boolean>(true);
  const [weeklyLogs, setWeeklyLogs] = useState<WeeklyLogResponse[]>([]);
  const [weatherStats, setWeatherStats] = useState<WeatherStatsResponse[]>([]);
  const [emotionStats, setEmotionStats] = useState<EmotionStatsResponse[]>([]);
  const [trendData, setTrendData] = useState<FocusTrendResponse[]>([]);

  useEffect(() => {
    async function initData() {
      try {
        setLoading(true);
        const [logsData, weatherData, emotionData, trendResponse] = await Promise.all([
          getWeeklyLogs(),
          getWeatherStats(),
          getEmotionStats(),
          getFocusTrend()
        ]);
        setWeeklyLogs(logsData);
        setWeatherStats(weatherData);
        setEmotionStats(emotionData);
        setTrendData(trendResponse);
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

  const past30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return getLocalDateString(d);
  });

  const dailyFocusMinutes = past30Days.map(dateStr => {
    const stat = trendData.find(item => item.date === dateStr);
    return stat ? stat.totalFocusMinutes : 0;
  });

  const trendResult = generateTrendPath(dailyFocusMinutes);
  const trendPaths = {
    fill: trendResult.fill,
    line: trendResult.line,
  };

  const getTrendMessage = () => {
    const n = dailyFocusMinutes.length;
    const total = dailyFocusMinutes.reduce((a, b) => a + b, 0);
    if (total === 0 || n === 0) {
      return "최근 30일 동안 기록된 집중 데이터가 없습니다. 오아시스와 함께 집중을 시작해보세요!";
    }

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    dailyFocusMinutes.forEach((y, x) => {
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const meanX = sumX / n;
    const meanY = sumY / n;

    // 선형 회귀 기울기 계산 (하루당 집중 시간 증감량)
    const slope = (sumXY - n * meanX * meanY) / (sumX2 - n * meanX * meanX);

    // 잔차 표준편차를 통한 변동성(Volatility) 측정
    let sumResidualSq = 0;
    dailyFocusMinutes.forEach((y, x) => {
      const predictedY = slope * x + (meanY - slope * meanX);
      sumResidualSq += (y - predictedY) ** 2;
    });
    
    const stdDev = Math.sqrt(sumResidualSq / n);
    const isVolatile = meanY > 5 && (stdDev / meanY) > 0.7;

    if (slope > 0.3) {
      return isVolatile 
        ? "전반적인 추세는 우상향하고 있으나, 날마다 집중 시간의 기복이 큰 편입니다."
        : "꾸준히 우상향하는 그래프를 그리고 있습니다! 안정적으로 몰입 시간이 늘어나고 있네요.";
    } else if (slope < -0.3) {
      return isVolatile
        ? "집중 시간이 크게 들쭉날쭉하며 전체적으로 감소하는 우하향 추세입니다. 무리하지 마세요!"
        : "전체적으로 몰입 시간이 서서히 감소하는 우하향 추세입니다. 충분한 휴식이 필요할 수 있습니다.";
    } else {
      return isVolatile
        ? "뚜렷한 증가/감소 추세 없이 매일매일의 몰입 시간이 크게 들쭉날쭉한 양상을 보입니다."
        : "큰 기복 없이 매일 일정한 수준의 안정적인 집중력을 유지하고 있습니다.";
    }
  };

  const trendMessage = getTrendMessage();

  return {
    loading,
    weeklyHourlyPaths,
    dailyHourDataList,
    getWeatherData,
    getBarHeight,
    diaryScores,
    trendPaths,
    dailyFocusMinutes,
    trendMessage,
  };
};
export default useStats;
