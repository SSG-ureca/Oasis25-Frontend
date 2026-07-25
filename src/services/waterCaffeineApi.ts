import { api } from "./api";
import type {
  WaterCaffeineLogType,
  WaterCaffeineLogResponse,
  WaterCaffeineLogCreateRequest,
} from "../types/waterCaffeine";

export async function getWaterCaffeineLogsByDate(
  date: string,
): Promise<WaterCaffeineLogResponse[]> {
  console.log("[WaterCaffeine] GET /api/water-caffeine?date=", date);
  const res = await api.get<WaterCaffeineLogResponse[]>("/api/water-caffeine", {
    params: { date },
  });
  console.log("[WaterCaffeine] GET response", res.data);
  return res.data;
}

export async function getWaterCaffeineSummary(
  date: string,
  type: WaterCaffeineLogType,
): Promise<number> {
  const res = await api.get<number>("/api/water-caffeine/summary", {
    params: { date, type },
  });
  return res.data;
}

export async function createWaterCaffeineLog(
  type: WaterCaffeineLogType,
  amount: number,
): Promise<WaterCaffeineLogResponse> {
  const body: WaterCaffeineLogCreateRequest = { logType: type, amount };
  console.log("[WaterCaffeine] POST /api/water-caffeine body=", body);
  const res = await api.post<WaterCaffeineLogResponse>(
    "/api/water-caffeine",
    body,
  );
  console.log("[WaterCaffeine] POST response", res.data);
  return res.data;
}

export async function deleteWaterCaffeineLog(id: number): Promise<void> {
  console.log("[WaterCaffeine] DELETE /api/water-caffeine/", id);
  await api.delete(`/api/water-caffeine/${id}`);
}
