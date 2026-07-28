import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { AlarmType, MusicSetting } from "../../types/music";
import { ALARM_LIST } from "../../types/music";

import { Button } from "../common/Button";
import { Play } from "lucide-react";

interface AlarmControllerProps {
    musicSetting: MusicSetting;
    setMusicSetting: Dispatch<SetStateAction<MusicSetting>>;
}

export const AlarmController = ({
    musicSetting,
    setMusicSetting,
}: AlarmControllerProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        return () => {
            if (!audioRef.current) return;

            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        };
    }, []);

    const handlePreview = (path: string) => {
        audioRef.current?.pause();

        const audio = new Audio(path);

        audio.volume = 0.4;

        audio.play();

        audio.onended = () => {
            setIsPlaying(false);
        };

        audioRef.current = audio;

        setIsPlaying(true);
    };

    const handleSelectAlarm = (alarm: AlarmType) => {
        setMusicSetting((prev) => ({
            ...prev,
            selectedAlarm: alarm,
        }));
    };

    return (
        <div
            className="
            h-full
            min-h-0
            flex
            flex-col
            
        "
        >
            <div
                className="
                flex-1
                min-h-0
                overflow-y-auto
                space-y-2
                pr-1
                
                flex
                flex-col
                justify-start
        translate-y-10
            "
            >
                {ALARM_LIST.map((alarm) => (
                    <div
                        key={alarm.id}
                        className="
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        px-3
                        py-2
                        bg-[var(--color-clay-bg)]
                        border
                        border-[var(--color-clay-border)]
                        shadow-[var(--shadow-clay-inset)]
                    "
                    >
                        <label
                            className="
                            flex
                            items-center
                            gap-3
                            cursor-pointer
                            text-sm
                        "
                        >
                            <input
                                type="radio"
                                name="alarm"
                                checked={
                                    musicSetting.selectedAlarm === alarm.id
                                }
                                onChange={() => handleSelectAlarm(alarm.id)}
                                className="peer hidden"
                            />

                            <span
                                className="
                                relative

                                w-5
                                h-5

                                rounded-lg

                                bg-[var(--color-clay-bg)]

                                border
                                border-[var(--color-clay-border)]

                                shadow-[var(--shadow-clay-inset)]

                                after:absolute
                                after:inset-1/4
                                after:rounded-sm
                                after:bg-black
                                after:scale-0
                                after:transition-transform

                                peer-checked:after:scale-100
                            "
                            />

                            {alarm.name}
                        </label>

                        <Button
                            variant="clay"
                            className="h-8 w-8 p-0"
                            onClick={() => handlePreview(alarm.path)}
                            disabled={isPlaying}
                        >
                            <Play size={14} />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};
