import { MusicPlayer } from "../components/common/MusicPlayer";
import { MyPageContainer } from "../components/mypage/MyPageContainer";

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
                <MyPageContainer />
            </div>

            <MusicPlayer />
        </div>
    );
};
