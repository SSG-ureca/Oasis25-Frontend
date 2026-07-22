import { Panel } from "../common/Panel";
import { Grass } from "./RetrospectHeatmap";

export const MyPageContainer = () => {
    return (
        <Panel
            variant="neumorphism"
            className="
                flex-1
                p-3
                w-full
                h-full
                min-h-0
            "
        >
            {/* 깃허브 잔디 컴포넌트 */}
            <Grass />
        </Panel>
    );
};
