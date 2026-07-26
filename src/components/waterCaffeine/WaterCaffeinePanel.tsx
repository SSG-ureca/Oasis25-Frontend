import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import type {
  WaterCaffeineLogResponse,
  WaterCaffeineLogType,
} from "../../types/waterCaffeine";
import {
  createWaterCaffeineLog,
  deleteWaterCaffeineLog,
  getWaterCaffeineLogsByDate,
} from "../../services/waterCaffeineApi";
import { IntakeCounter } from "./IntakeCounter";
import { CactusStatus } from "./CactusStatus";

const WATER_STEP = 100;
const CAFFEINE_STEP = 10;

function today() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}

function isAuthenticated() {
  return typeof window !== "undefined" && !!localStorage.getItem("accessToken");
}

export function WaterCaffeinePanel() {
  const [logs, setLogs] = useState<WaterCaffeineLogResponse[]>([]);
  const authenticated = isAuthenticated();
  console.log("[WaterCaffeine] authenticated=", authenticated);

  const refresh = async () => {
    try {
      const data = await getWaterCaffeineLogsByDate(today());
      setLogs(data);
    } catch (e) {
      console.error("failed to load water/caffeine logs", e);
    }
  };

  useEffect(() => {
    if (!authenticated) return;
    let cancelled = false;
    getWaterCaffeineLogsByDate(today())
      .then((data) => {
        if (!cancelled) setLogs(data);
      })
      .catch((e) => console.error("failed to load water/caffeine logs", e));
    return () => {
      cancelled = true;
    };
  }, [authenticated]);

  const totals = useMemo(() => {
    const result = logs.reduce(
      (acc, log) => {
        if (log.logType === "WATER") acc.water += log.amount;
        else if (log.logType === "CAFFEINE") acc.caffeine += log.amount;
        return acc;
      },
      { water: 0, caffeine: 0 },
    );
    console.log("[WaterCaffeine] logs=", logs, "totals=", result);
    return result;
  }, [logs]);

  const latestFor = (type: WaterCaffeineLogType) =>
    [...logs]
      .filter((log) => log.logType === type)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];

  const handleIncrease = async (type: WaterCaffeineLogType) => {
    if (!authenticated) return;
    const amount = type === "WATER" ? WATER_STEP : CAFFEINE_STEP;
    try {
      await createWaterCaffeineLog(type, amount);
      await refresh();
    } catch (e) {
      console.error("failed to increase", e);
    }
  };

  const handleDecrease = async (type: WaterCaffeineLogType) => {
    if (!authenticated) return;
    const log = latestFor(type);
    if (!log) return;
    try {
      await deleteWaterCaffeineLog(log.id);
      await refresh();
    } catch (e) {
      console.error("failed to decrease", e);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold ">
        <Heart className="h-4 w-4 fill-primary text-primary" />
        <span>웰빙 밸런스 케어</span>
      </div>
      <div className="flex justify-around py-2">
        <IntakeCounter
          label="카페인"
          value={totals.caffeine}
          unit="mg"
          onIncrease={() => handleIncrease("CAFFEINE")}
          onDecrease={() => handleDecrease("CAFFEINE")}
          canDecrease={latestFor("CAFFEINE") !== undefined}
          disabled={!authenticated}
        />
        <IntakeCounter
          label="수분 섭취"
          value={totals.water}
          unit="ml"
          onIncrease={() => handleIncrease("WATER")}
          onDecrease={() => handleDecrease("WATER")}
          canDecrease={latestFor("WATER") !== undefined}
          disabled={!authenticated}
        />
      </div>
      <div className="mt-auto flex flex-1 items-end justify-center pb-2">
        <CactusStatus water={totals.water} caffeine={totals.caffeine} />
      </div>
    </div>
  );
}
