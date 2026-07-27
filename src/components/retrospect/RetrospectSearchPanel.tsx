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
    getRetrospectDates,
} from "../../services/retrospectApi";
import { toast } from "../common/Toast";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "./DatePicker.css";

// props 필요 title: 패널 이름, header: 상단 버튼, footer:하단버튼, 컨텐츠
export const RetrospectSearchPanel = () => {
    const [retrospect, setRetrospect] = useState<RetrospectResponse | null>(
        null,
    );
    const [editContent, setEditContent] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [highlightDates, setHighlightDates] = useState<Date[]>([]);

    // Get API 호출 함수
    const handleSearch = async (date: Date) => {
        try {
            const formattedDate = date.toISOString().slice(0, 10);

            const data = await getRetrospect(formattedDate);

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
    //달력 날짜 함수
    const fetchHighlightedDates = async (year: number, month: number) => {
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 1); // exclusive end
        const startStr = start.toISOString().slice(0, 10);
        const endStr = end.toISOString().slice(0, 10);
        const dates = await getRetrospectDates(startStr, endStr);
        setHighlightDates(dates.map((d) => new Date(d)));
        console.log("API dates:", dates);
    };
    const isHighlightedDate = (date: Date) =>
        highlightDates.some((d) => d.toDateString() === date.toDateString());
    return (
        <RetrospectPanel
            title="회고 찾아보기"
            header={
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date | null) => {
                            if (!date) return;

                            setSelectedDate(date);
                            handleSearch(date);
                        }}
                        onMonthChange={(date: Date) =>
                            fetchHighlightedDates(
                                date.getFullYear(),
                                date.getMonth(),
                            )
                        }
                        onCalendarOpen={() =>
                            fetchHighlightedDates(
                                selectedDate.getFullYear(),
                                selectedDate.getMonth(),
                            )
                        }
                        dayClassName={(date) =>
                            isHighlightedDate(date) ? "highlighted-custom" : ""
                        }
                        dateFormat="yyyy-MM-dd"
                        className="
            h-10
            w-40
            rounded-2xl
            px-4
            bg-clay-bg
            border
            border-clay-border
            shadow-(--shadow-clay)
            text-(--color-text)
            outline-none
            transition
            focus:shadow-(--shadow-clay-inset)
        "
                    />
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
                    min-w-0
                    w-full
                    min-h-0
                "
            >
                <Panel
                    variant="clay"
                    inset
                    className="
                        h-[240px]
                        p-4
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
                        h-[280px]
                        p-4
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
