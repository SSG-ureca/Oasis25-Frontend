import { api } from "./api";
import type {
    RetrospectCreateRequest,
    RetrospectResponse,
} from "../types/retrospect";
const DIARY_API = "/api/diaries";

export const createRetrospect = async (
    data: RetrospectCreateRequest,
): Promise<RetrospectResponse> => {
    const response = await api.post(DIARY_API, data);

    return response.data;
};
// 조회
export const getRetrospect = async (
    date: string,
): Promise<RetrospectResponse> => {
    const response = await api.get(DIARY_API, {
        params: {
            date,
        },
    });

    return response.data;
};

// 수정
export const updateRetrospect = async (
    id: number,
    data: {
        content: string;
        emotionScore: number;
    },
): Promise<RetrospectResponse> => {
    const response = await api.put(`${DIARY_API}/${id}`, data);

    return response.data;
};

// 삭제
export const deleteRetrospect = async (id: number): Promise<void> => {
    await api.delete(`${DIARY_API}/${id}`);
};
