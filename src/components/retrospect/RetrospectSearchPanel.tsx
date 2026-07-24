//회고 페이지 조회 패널 내부 요소 컴포넌트
import { RetrospectPanel } from "./RetrospectPannel";
import { Panel } from "../common/Panel";
import { Button } from "../common/Button";
import { useState } from "react";
import type { RetrospectResponse } from "../../types/retrospect";
import {
    getRetrospect,
    updateRetrospect,
    deleteRetrospect,
} from "../../services/retrospectApi";
import { toast } from "../common/Toast";

// props 필요 title: 패널 이름, header: 상단 버튼, footer:하단버튼, 컨텐츠
export const RetrospectSearchPanel = () => {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().slice(0, 10),
    );
    const [retrospect, setRetrospect] = useState<RetrospectResponse | null>(
        null,
    );
    const [editContent, setEditContent] = useState("");

    // Get API 호출 함수
    const handleSearch = async () => {
        try {
            const data = await getRetrospect(selectedDate);

            setRetrospect(data);
            setEditContent(data.content);
        } catch (error) {
            console.error(error);
            setRetrospect(null);
        }
    };
    //Put API로 수정 함수
    const handleUpdate = async () => {
        if (!retrospect) {
            return;
        }

        try {
            const updated = await updateRetrospect(retrospect.id, {
                content: editContent,
                emotionScore: retrospect.emotionScore,
            });

            setRetrospect(updated);

            toast.success("회고가 저장되었습니다.");
        } catch (error) {
            console.error(error);
            toast.error("수정 실패");
        }
    };
    // Delete API 호출 함수
    const handleDelete = async () => {
        if (!retrospect) {
            return;
        }

        const confirmDelete = window.confirm("정말 삭제하시겠습니까?");

        if (!confirmDelete) {
            return;
        }

        try {
            await deleteRetrospect(retrospect.id);

            setRetrospect(null);
            setEditContent("");

            toast.success("삭제되었습니다.");
        } catch (error) {
            console.error(error);
            toast.error("삭제 실패");
        }
    };
    return (
        <RetrospectPanel
            title="회고 찾아보기"
            header={
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="
                            h-10
                            rounded-lg
                            px-3
                        "
                    />
                    <Button variant="clay" onClick={handleSearch}>
                        조회
                    </Button>
                </div>
            }
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="clay" onClick={handleUpdate}>
                        수정
                    </Button>
                    <Button variant="clay" onClick={handleDelete}>
                        삭제
                    </Button>
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
                    variant="clay"
                    inset
                    className="
                        p-4
                        flex-[1.5]
                    "
                >
                    {retrospect ? (
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="
            w-full
            h-full
            resize-none
            bg-transparent
            outline-none
        "
                        />
                    ) : (
                        <div>조회할 회고가 없습니다.</div>
                    )}
                </Panel>

                <Panel
                    variant="clay"
                    inset
                    className="
                        p-4
                        flex-1
                    "
                >
                    {retrospect?.attachmentUrl ? (
                        <img
                            src={retrospect.attachmentUrl}
                            alt="첨부 이미지"
                            className="w-full h-full object-cover rounded-xl"
                        />
                    ) : (
                        <div>첨부된 사진이 없습니다.</div>
                    )}
                </Panel>
            </div>
        </RetrospectPanel>
    );
};
