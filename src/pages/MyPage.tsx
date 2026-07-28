import { MusicController } from "../components/mypage/musicComponent/MusicController";
import { OptionController } from "../components/mypage/OptionController";
import { ProfileEditor } from "../components/mypage/profileComponent/ProfileEditor";
import { RetrospectHeatmap } from "../components/mypage/RetrospectHeatmap";

export const MyPage = () => {
    return (
        <div
            id="tour-mypage-content"
            className="
                h-full
                min-h-0

                grid
                grid-cols-1

                gap-3
                sm:gap-4
                880:gap-6

                880:grid-rows-[minmax(180px,auto)_1fr]
            "
        >
            <RetrospectHeatmap />

            <div
                className="
                min-h-0
                grid
                grid-cols-1
                gap-3
                sm:gap-4

                680:grid-cols-2
                880:grid-cols-3

                pb-5
            "
            >
                <ProfileEditor />

                <MusicController />

                <OptionController />
            </div>
        </div>
    );
};
