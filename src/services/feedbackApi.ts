import { api } from "./api";

export interface FeedbackRequest {
  isGood: boolean;
  content: string;
}

export interface FeedbackResponse {
  id: number;
  content: string;
  createdAt: string;
  good: boolean;
}

// 피드백 생성 API 호출
export const createFeedback = async (
  data: FeedbackRequest,
): Promise<FeedbackResponse> => {
  const response = await api.post<FeedbackResponse>("/api/feedbacks", data);
  return response.data;
};
