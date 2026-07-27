import { Panel } from "../components/common/Panel";
import { MusicController } from "../components/mypage/musicComponent/MusicController";
import { OptionController } from "../components/mypage/OptionController";
import { ProfileEditor } from "../components/mypage/profileComponent/ProfileEditor";
import { RetrospectHeatmap } from "../components/mypage/RetrospectHeatmap";

export const MyPage = () => {
    return (
        <div
            className="
        h-full
        min-h-0

        grid
        grid-cols-1

        gap-3
        sm:gap-4
        880:gap-6

        880:grid-rows-[180px_1fr]
    "
        >
            <Panel
                variant="clay"
                className="
                    p-3
                    min-h-0
                "
            >
                <RetrospectHeatmap />
            </Panel>

            <div
                className="
                    min-h-0
                    grid
                    grid-cols-1
                    gap-3
                    sm:gap-4
                    880:gap-6
                    880:grid-cols-[1.1fr_1fr_0.9fr]
                "
            >
                <ProfileEditor />

                <MusicController />

                <OptionController />
            </div>
        </div>
    );
};
