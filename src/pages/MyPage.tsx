import { MusicController } from "../components/mypage/musicComponent/MusicController";
import { OptionController } from "../components/mypage/OptionController";
import { ProfileEditor } from "../components/mypage/profileComponent/ProfileEditor";
import { RetrospectHeatmap } from "../components/mypage/RetrospectHeatmap";

export const MyPage = () => {
    return (
        <div
            className="
                pb-5
                grid
                grid-cols-1

                gap-3
                sm:gap-4
                880:gap-6           
            "
        >
            <RetrospectHeatmap />

            <div
                className="
                grid
                grid-cols-1
                gap-3
                sm:gap-4

                880:grid-cols-[1.1fr_1fr_0.9fr]
                
            "
            >
                {/* 프로필 */}
                <ProfileEditor />

                {/* BGM + 알람 그룹 */}
                <div
                    className="
            grid
            grid-cols-1

            680:grid-cols-2

            880:contents
             gap-3
        "
                >
                    <MusicController />
                    <OptionController />
                </div>
            </div>
        </div>
    );
};
