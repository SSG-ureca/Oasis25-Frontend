import { api } from "./api";
import type {
    RetrospectCreateRequest,
    RetrospectResponse,
} from "../types/retrospect";
const DIARY_API = "/api/diaries";

//생성
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

//사진 첨부
export const uploadAttachment = async (
    id: number,
    file: File,
): Promise<void> => {
    const formData = new FormData();

    formData.append("attachment", file);

    await api.post(`${DIARY_API}/${id}/attachment`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

//날짜
export const getRetrospectDates = async (
    startDate: string,
    endDate: string,
): Promise<string[]> => {
    const response = await api.get("/api/diaries/dates", {
        params: { startDate, endDate },
    });
    return response.data.dates; // ["2026-07-20", "2026-07-21", ...]
};
