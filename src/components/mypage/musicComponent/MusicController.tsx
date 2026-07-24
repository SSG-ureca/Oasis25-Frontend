import { Panel } from "../../common/Panel";
import { AlarmController } from "./AlarmController";
import { BgmController } from "./BgmController";
import { useState, useEffect } from "react";
import {
    loadMusicSetting,
    saveMusicSetting,
} from "../../../utils/musicStorage";
import type { MusicSetting } from "../../../types/music";
import { Button } from "../../common/Button";

export const MusicController = () => {
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
        flex
        flex-col
        gap-4
        h-full 
        min-h-0
        p-4
    "
        >
            <Button onClick={() => window.location.reload()}>적용</Button>
            <BgmController
                musicSetting={musicSetting}
                setMusicSetting={setMusicSetting}
            />
            <AlarmController
                musicSetting={musicSetting}
                setMusicSetting={setMusicSetting}
            />
        </Panel>
    );
};
