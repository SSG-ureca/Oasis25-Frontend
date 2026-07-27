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
    flex
    flex-col
    min-h-0
    px-6
    pb-1
    pt-10

"
        >
            {/* 헤더 */}
            <div
                className="
        relative
        flex
        items-center
        justify-center
        w-full
        shrink-0
    "
            >
                <h3 className="text-lg font-semibold">알람음 관리</h3>
            </div>
            <AlarmController
                musicSetting={musicSetting}
                setMusicSetting={setMusicSetting}
            />
        </Panel>
    );
};
