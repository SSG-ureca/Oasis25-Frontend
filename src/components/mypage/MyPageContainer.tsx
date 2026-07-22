import { Panel } from "../common/Panel";
import { MusicController } from "./MusicController";
import { OptionController } from "./OptionController";
import { ProfileEditor } from "./ProfileEditor";
import { RetrospectHeatmap } from "./RetrospectHeatmap";

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
            <RetrospectHeatmap />
            <div
                className="
                    flex
                    gap-6
                    w-full
                    h-7/10
                    mt-4
                "
            >
                <ProfileEditor />
                <MusicController />
                <OptionController />
            </div>
        </Panel>
    );
};
