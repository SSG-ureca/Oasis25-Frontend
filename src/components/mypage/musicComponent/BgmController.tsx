import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { MusicSetting, BgmType } from "../../../types/music";
import { BGM_LIST } from "../../../types/music";
import { Panel } from "../../common/Panel";
import { Button } from "../../common/Button";

interface BgmControllerProps {
    musicSetting: MusicSetting;
    setMusicSetting: Dispatch<SetStateAction<MusicSetting>>;
}

export const BgmController = ({
    musicSetting,
    setMusicSetting,
}: BgmControllerProps) => {
    const { bgmOrder, excludedBgm } = musicSetting;

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 컴포넌트가 사라질 때 음악 정지
    useEffect(() => {
        return () => {
            if (!audioRef.current) {
                return;
            }

            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        };
    }, []);

    // 순서 변경
    const moveBgm = (index: number, direction: -1 | 1) => {
        const newIndex = index + direction;

        if (newIndex < 0 || newIndex >= bgmOrder.length) {
            return;
        }

        const newOrder = [...bgmOrder];

        [newOrder[index], newOrder[newIndex]] = [
            newOrder[newIndex],
            newOrder[index],
        ];

        setMusicSetting((prev) => ({
            ...prev,
            bgmOrder: newOrder,
        }));
    };

    // 제외 여부 변경
    const toggleExclude = (bgm: BgmType) => {
        setMusicSetting((prev) => {
            const isExcluded = prev.excludedBgm.includes(bgm);

            return {
                ...prev,
                excludedBgm: isExcluded
                    ? prev.excludedBgm.filter((item) => item !== bgm)
                    : [...prev.excludedBgm, bgm],
            };
        });
    };

    // 미리듣기
    const handlePreview = (path: string) => {
        audioRef.current?.pause();

        audioRef.current = new Audio(path);
        audioRef.current.volume = 0.4;

        audioRef.current.play();
    };
    const handleStop = () => {
        if (!audioRef.current) {
            return;
        }

        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    };

    return (
        <Panel
            variant="clay"
            inset
            className="
                flex
                flex-col
                gap-4
                p-3
                w-full
            "
        >
            <h3 className="text-lg font-semibold">BGM 관리</h3>

            {bgmOrder.map((bgm, index) => {
                const music = BGM_LIST.find((item) => item.id === bgm)!;

                return (
                    <div
                        key={bgm}
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >
                        <span>{music.name}</span>

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >
                            <Button
                                variant="clay"
                                onClick={() => handlePreview(music.path)}
                            >
                                ▶
                            </Button>
                            <Button variant="clay" onClick={handleStop}>
                                ⏹
                            </Button>

                            <Button
                                variant="clay"
                                onClick={() => moveBgm(index, -1)}
                                disabled={index === 0}
                            >
                                ▲
                            </Button>

                            <Button
                                variant="clay"
                                onClick={() => moveBgm(index, 1)}
                                disabled={index === bgmOrder.length - 1}
                            >
                                ▼
                            </Button>

                            <label
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    cursor-pointer
                                "
                            >
                                <input
                                    type="checkbox"
                                    checked={excludedBgm.includes(bgm)}
                                    onChange={() => toggleExclude(bgm)}
                                />
                                제외
                            </label>
                        </div>
                    </div>
                );
            })}
        </Panel>
    );
};
