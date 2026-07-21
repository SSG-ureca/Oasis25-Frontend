//회고 작성 패널 감정 버튼 컴포넌트
import { Button } from "../common/Button";

const emotions = ["😀", "😊", "😐", "😢", "😡"];

export const EmotionSelector = () => {
    return (
        <div
            className="
                flex
                items-center
                gap-2
            "
        >
            {emotions.map((emotion) => (
                <Button
                    key={emotion}
                    variant="neumorphism"
                    className="
                        w-10
                        h-10
                        p-0
                        rounded-full
                    "
                >
                    {emotion}
                </Button>
            ))}
        </div>
    );
};
