import { RetrospectPanel } from "./RetrospectPannel";
import { Panel } from "../common/Panel";

export const RetrospectWritePanel = () => {
    return (
        <RetrospectPanel title="회고 작성하기">
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
