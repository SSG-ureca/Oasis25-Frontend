//회고 페이지에서 사용할 타입입니다.

//작성용 타입
export interface RetrospectCreateRequest {   
    diaryDate: string;
    content: string;
    emotionScore: number;
}

//조회용 타입
export interface RetrospectResponse {
    id: number;
    diaryDate: string;
    content: string;
    emotionScore: number;
    aiSummary: string;
    attachmentUrl?: string;
    createdAt: string;
    updatedAt: string;
}
