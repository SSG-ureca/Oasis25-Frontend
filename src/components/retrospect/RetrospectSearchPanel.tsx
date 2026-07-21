//회고 페이지 조회 패널 내부 요소 컴포넌트
import { RetrospectPanel } from "./RetrospectPannel";
import { Panel } from "../common/Panel";
import { Button } from "../common/Button";

// props 필요 title: 패널 이름, header: 상단 버튼, footer:하단버튼, 컨텐츠
export const RetrospectSearchPanel = () => {
    return (
        <RetrospectPanel
            title="회고 찾아보기"
            header={
                <div className="flex items-center gap-2">
                    <Button variant="neumorphism">📅</Button>
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
                    회고 내용
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
