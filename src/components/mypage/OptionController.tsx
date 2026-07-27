import { useEffect, useState } from "react";

import { Panel } from "../common/Panel";
import { AlarmController } from "./AlarmController";

import type { MusicSetting } from "../../types/music";

import { loadMusicSetting, saveMusicSetting } from "../../utils/musicStorage";

export const OptionController = () => {
    const [musicSetting, setMusicSetting] =
        useState<MusicSetting>(loadMusicSetting());

    useEffect(() => {
        saveMusicSetting(musicSetting);
    }, [musicSetting]);

    return (
        <Panel
            variant="clay"
            inset
            className="
h-full
880:h-full

flex
flex-col

min-h-[420px]
880:min-h-0

px-3
sm:px-4
880:px-6

py-4
880:pt-8
880:pb-2
"
        >
            {/* 헤더 */}
            <div
                className="
flex
w-full
880:w-auto

items-center
justify-center

gap-3

shrink-0
"
            >
                <Panel
                    variant="clay"
                    className="
px-4
py-2
"
                >
                    <h3 className="text-lg font-semibold">알람음 관리</h3>
                </Panel>
            </div>
            <div
                className="
        flex-1

        min-h-0

        overflow-hidden
    "
            >
                <AlarmController
                    musicSetting={musicSetting}
                    setMusicSetting={setMusicSetting}
                />
            </div>
        </Panel>
    );
};
