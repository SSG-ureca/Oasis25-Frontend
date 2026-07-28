export type WaterCaffeineLogType = "WATER" | "CAFFEINE";

export interface WaterCaffeineLogResponse {
  id: number;
  logType: WaterCaffeineLogType;
  amount: number;
  createdAt: string;
}

export interface WaterCaffeineLogCreateRequest {
  logType: WaterCaffeineLogType;
  amount: number;
}
