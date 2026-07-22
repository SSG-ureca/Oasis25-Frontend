//회고 페이지 조회 패널 내부 요소 컴포넌트
import { RetrospectPanel } from "./RetrospectPannel";
import { Panel } from "../common/Panel";
import { Button } from "../common/Button";
import { useState } from "react";
import type { RetrospectResponse } from "../../types/retrospect";
import { getRetrospect } from "../../services/retrospectApi";

// props 필요 title: 패널 이름, header: 상단 버튼, footer:하단버튼, 컨텐츠
export const RetrospectSearchPanel = () => {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().slice(0, 10),
    );
    const [retrospect, setRetrospect] = useState<RetrospectResponse | null>(
        null,
    );

    // Get API 호출 함수
    const handleSearch = async () => {
        try {
            const data = await getRetrospect(selectedDate);

            setRetrospect(data);
        } catch (error) {
            console.error(error);
            setRetrospect(null);
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
                    <Button variant="neumorphism" onClick={handleSearch}>
                        조회
                    </Button>
                </div>
            }
            footer={
                <div className="flex justify-end gap-3">
                    <Button>수정</Button>
                    <Button>삭제</Button>
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
                    {retrospect ? (
                        <div>{retrospect.content}</div>
                    ) : (
                        <div>조회할 회고가 없습니다.</div>
                    )}
                </Panel>

                <Panel
                    variant="neumorphism"
                    inset
                    className="
                        p-4
                        flex-1
                    "
                >
                    회고 사진
                </Panel>
            </div>
        </RetrospectPanel>
    );
};
