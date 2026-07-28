// 회고 페이지 작성 패널 내부 요소 컴포넌트
import { useState } from "react";
import { useRef } from "react";

import { RetrospectPanel } from "./RetrospectPannel";
import { EmotionSelector } from "./EmotionSelector";
import { Panel } from "../common/Panel";
import { Button } from "../common/Button";

import { createRetrospect } from "../../services/retrospectApi";
import { uploadAttachment } from "../../services/retrospectApi";
import { toast } from "../common/Toast";

export const RetrospectWritePanel = () => {
    // 상태
    const [content, setContent] = useState("");
    const [emotionScore, setEmotionScore] = useState<number | null>(null);
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

    const [previewUrl, setPreviewUrl] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

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
            const diary = await createRetrospect({
                diaryDate,
                content,
                emotionScore,
            });

            if (attachmentFile) {
                await uploadAttachment(diary.id, attachmentFile);
            }

            toast.success("회고가 저장되었습니다.");

            // 입력 초기화
            setContent("");
            setEmotionScore(null);
        } catch (error) {
            console.error(error);
            toast.error("저장에 실패했습니다.");
        }
    };
    //사진 추가 로작
    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setAttachmentFile(file);

        setPreviewUrl(URL.createObjectURL(file));
    };

    return (
        <RetrospectPanel
            title="오늘 하루는 어땠나요?"
            header={
                <EmotionSelector
                    value={emotionScore}
                    onChange={setEmotionScore}
                />
            }
            footer={
                <div className="flex justify-end gap-3">
                    <Button
                        variant="clay"
                        className="
                        w-full
                        flex
                        items-center
                        gap-2.5

                        px-4
                        h-8
                        

                        rounded-xl"
                        onClick={handlePhotoClick}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />
                        사진
                    </Button>
                    <Button
                        variant="clay"
                        className="
                        w-full
                        flex
                        items-center
                        gap-2.5

                        px-4
                        h-8
                      

                        rounded-xl"
                        onClick={handleSubmit}
                    >
                        저장
                    </Button>
                </div>
            }
        >
            <div
                className="
                     flex
                    flex-col
                    gap-6
                    min-w-0
                    w-full
                    min-h-0
                "
            >
                <Panel
                    variant="clay"
                    inset
                    className="
                        h-[200px]
                        p-4
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
                        placeholder="오늘의 몰입 상태와 컨디션을 간단히 기록해보세요..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Panel>

                <Panel
                    variant="clay"
                    inset
                    className="
                        h-[240px]
                        p-4
                    "
                >
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="preview"
                            className="w-full h-full object-cover rounded-xl"
                        />
                    ) : (
                        "첨부 사진"
                    )}
                </Panel>
            </div>
        </RetrospectPanel>
    );
};
