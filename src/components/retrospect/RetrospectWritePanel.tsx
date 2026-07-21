// 회고 페이지 작성 패널 내부 요소 컴포넌트
import { useState } from "react";

import { RetrospectPanel } from "./RetrospectPannel";
import { EmotionSelector } from "./EmotionSelector";
import { Panel } from "../common/Panel";
import { Button } from "../common/Button";

import { createRetrospect } from "../../services/retrospectApi";
import toast from "react-hot-toast";

export const RetrospectWritePanel = () => {
    // 상태
    const [content, setContent] = useState("");
    const [emotionScore, setEmotionScore] = useState<number | null>(null);

    // 오늘 날짜
    const diaryDate = new Date().toISOString().slice(0, 10);

    // 저장 로직
    const handleSubmit = async () => {
        if (!content.trim()) {
            toast.error("회고 내용을 입력해주세요.");
            return;
        }

        if (emotionScore === null) {
            toast.error("감정을 선택해주세요.");
            return;
        }

        try {
            await createRetrospect({
                diaryDate,
                content,
                emotionScore,
            });

            toast.success("회고가 저장되었습니다.");

            // 입력 초기화
            setContent("");
            setEmotionScore(null);
        } catch (error) {
            console.error(error);
            toast.error("저장에 실패했습니다.");
        }
    };

    return (
        <RetrospectPanel
            title="회고 작성하기"
            header={
                <EmotionSelector
                    value={emotionScore}
                    onChange={setEmotionScore}
                />
            }
            footer={
                <div className="flex justify-end gap-3">
                    <Button>사진 추가</Button>
                    <Button onClick={handleSubmit}>작성</Button>
                </div>
            }
        >
            <div
                className="
                    flex
                    flex-col
                    gap-6
                    h-full
                    w-full
                    min-h-0
                "
            >
                <Panel
                    variant="neumorphism"
                    inset
                    className="
                        p-4
                        flex-[1.5]
                    "
                >
                    <textarea
                        className="
                            w-full
                            h-full
                            resize-none
                            bg-transparent
                            outline-none
                        "
                        placeholder="오늘의 회고를 작성해보세요."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Panel>

                <Panel
                    variant="neumorphism"
                    inset
                    className="
                        p-4
                        flex-1
                    "
                >
                    사진 첨부
                </Panel>
            </div>
        </RetrospectPanel>
    );
};
