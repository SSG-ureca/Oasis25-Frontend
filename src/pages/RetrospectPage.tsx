import { MusicPlayer } from "../components/common/MusicPlayer";
import { RetrospectSearchPanel } from "../components/retrospect/RetrospectSearchPanel";
import { RetrospectWritePanel } from "../components/retrospect/RetrospectWritePanel";

export const RetrospectPage = () => {
    return (
        <div
            className="
                h-full
                grid
                grid-rows-[1fr_auto]
                gap-4
            "
        >
            {/* 이전 회고 조회 패널 */}
            <RetrospectSearchPanel />

            {/* 회고 작성 패널 */}
            <RetrospectWritePanel />

            {/* 뮤직 플레이어 */}
            <div
                className="
                    col-span-2
                "
            >
                <MusicPlayer />
            </div>
        </div>
    );
};
