import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { AlarmType, MusicSetting } from "../../../types/music";
import { ALARM_LIST } from "../../../types/music";
import { Panel } from "../../common/Panel";
import { Button } from "../../common/Button";

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
            <h3 className="text-lg font-semibold">알람음 관리</h3>

            {ALARM_LIST.map((alarm) => (
                <div
                    key={alarm.id}
                    className="
                        flex
                        items-center
                        justify-between
                    "
                >
                    <label
                        className="
                            flex
                            items-center
                            gap-2
                            cursor-pointer
                        "
                    >
                        <input
                            type="radio"
                            name="alarm"
                            checked={musicSetting.selectedAlarm === alarm.id}
                            onChange={() => handleSelectAlarm(alarm.id)}
                        />

                        <span>{alarm.name}</span>
                    </label>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <Button
                            variant="clay"
                            onClick={() => handlePreview(alarm.path)}
                            disabled={isPlaying}
                        >
                            ▶
                        </Button>
                    </div>
                </div>
            ))}
        </Panel>
    );
};
