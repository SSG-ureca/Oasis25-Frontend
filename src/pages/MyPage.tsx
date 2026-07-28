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
            {/* 히트맵 */}

            <RetrospectHeatmap />

            {/* 하단 영역 */}
            <div
                className="
        min-h-0

        grid
        grid-cols-1

        gap-3
        sm:gap-4
        880:gap-6

        680:grid-cols-2
        880:grid-cols-[1.1fr_1fr_0.9fr]
    "
            >
                {/* Profile */}
                <div className="680:col-span-2 880:col-span-1">
                    <ProfileEditor />
                </div>

                {/* BGM */}
                <MusicController />

                {/* Alarm */}
                <OptionController />
            </div>
        </div>
    );
};
