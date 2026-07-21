//회고 페이지 작성 패널 내부 요소 컴포넌트
import { RetrospectPanel } from "./RetrospectPannel";
import { Panel } from "../common/Panel";
import { Button } from "../common/Button";
import { EmotionSelector } from "./EmotionSelector";

// props 필요 title: 패널 이름, header: 상단 버튼, footer:하단버튼, 컨텐츠
export const RetrospectWritePanel = () => {
    return (
        <RetrospectPanel
            title="회고 작성하기"
            header={<EmotionSelector />}
            footer={
                <div className="flex justify-end gap-3">
                    <Button>사진 추가</Button>
                    <Button>작성</Button>
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
                    회고 작성하기
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
