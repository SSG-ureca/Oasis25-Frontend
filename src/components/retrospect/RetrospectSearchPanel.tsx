import { RetrospectPanel } from "./RetrospectPannel";
import { Panel } from "../common/Panel";

export const RetrospectSearchPanel = () => {
    return (
        <RetrospectPanel title="회고 찾아보기">
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
