import { useEffect, useState } from "react";

import { Panel } from "../common/Panel";
import { AlarmController } from "./musicComponent/AlarmController";

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
        p-4
    "
        >
            <AlarmController
                musicSetting={musicSetting}
                setMusicSetting={setMusicSetting}
            />
        </Panel>
    );
};
