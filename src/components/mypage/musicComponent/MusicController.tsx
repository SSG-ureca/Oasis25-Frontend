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
            <Button
                className="shrink-0"
                onClick={() => window.location.reload()}
            >
                설정 적용
            </Button>

            <div className="flex-[7] min-h-0">
                <BgmController
                    musicSetting={musicSetting}
                    setMusicSetting={setMusicSetting}
                />
            </div>

            <div className="flex-[3] min-h-0">
                <AlarmController
                    musicSetting={musicSetting}
                    setMusicSetting={setMusicSetting}
                />
            </div>
        </Panel>
    );
};
