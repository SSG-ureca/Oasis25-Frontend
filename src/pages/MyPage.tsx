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
                flex
                flex-col
                gap-4
            "
        >
            <div className="flex-1 min-h-0">
                <Panel
                    variant="clay"
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
            </div>
        </div>
    );
};
