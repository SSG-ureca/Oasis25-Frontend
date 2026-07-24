import { api } from "./api";
import type { HeatmapResponse } from "../types/heatmap";

const HEATMAP_API = "/api/pomodoro/heatmap";

export const getHeatmap = async (year: number): Promise<HeatmapResponse[]> => {
    const response = await api.get<HeatmapResponse[]>(HEATMAP_API, {
        params: {
            year,
        },
    });

    return response.data;
};
