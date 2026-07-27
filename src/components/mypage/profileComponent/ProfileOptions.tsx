import { Button } from "../../common/Button";

interface ProfileOptionsProps {
    autoPlay: boolean;
    setAutoPlay: (value: boolean) => void;

    focusMode: boolean;
    setFocusMode: (value: boolean) => void;
}

export const ProfileOptions = ({
    autoPlay,
    setAutoPlay,
    focusMode,
    setFocusMode,
}: ProfileOptionsProps) => {
    return (
        <div
            className="
                h-full
                flex
                flex-col
                justify-center
                gap-4
            "
        >
            <div
                className="
                    flex
                    justify-between
                    items-center
                    gap-3
                "
            >
                <span>음악 자동 재생</span>

                <Button
                    onClick={() => setAutoPlay(!autoPlay)}
                    className="
                        px-6
                        py-3
                        rounded-xl
                        bg-[var(--color-clay-bg)]
                        shadow-[var(--shadow-clay)]
                    "
                >
                    {autoPlay ? "ON" : "OFF"}
                </Button>
            </div>

            <div
                className="
                    flex
                    justify-between
                    items-center
                "
            >
                <span>집중 모드</span>

                <Button
                    onClick={() => setFocusMode(!focusMode)}
                    className="
                        px-6
                        py-3
                        rounded-xl
                        bg-[var(--color-clay-bg)]
                        shadow-[var(--shadow-clay)]
                    "
                >
                    {focusMode ? "ON" : "OFF"}
                </Button>
            </div>
        </div>
    );
};
