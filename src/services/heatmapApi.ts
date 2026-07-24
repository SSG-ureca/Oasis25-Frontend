import { api } from "./api";
import type { HeatmapResponse } from "../types/heatmap";

const HEATMAP_API = "/api/pomodoro/heatmap";

export const getHeatmap = async (
  email: string,
): Promise<Record<number, HeatmapResponse[]>> => {
  const response = await api.get<Record<number, HeatmapResponse[]>>(
    HEATMAP_API,
    {
      params: {
        email,
      },
    },
  );

  return response.data;
};
