//회고 페이지에서 사용할 타입입니다.

//작성용 타입
export interface RetrospectCreateRequest {
    //향후 작성자 로그인 아이디도 저장
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
}
