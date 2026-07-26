import { Panel } from "../../common/Panel";
import { AlarmController } from "./AlarmController";
import { BgmController } from "./BgmController";

import { useEffect, useState } from "react";

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
                h-full
                min-h-0
                p-4
                gap-5
            "
        >
            <Button
                className="shrink-0"
                onClick={() => window.location.reload()}
            >
                설정 적용
            </Button>

            <div
                className="
                    flex-1
                    min-h-0
                    flex
                    flex-col
                    gap-5
                "
            >
                <div className="flex-1">
                    <BgmController
                        musicSetting={musicSetting}
                        setMusicSetting={setMusicSetting}
                    />
                </div>

                <div className="shrink-0">
                    <AlarmController
                        musicSetting={musicSetting}
                        setMusicSetting={setMusicSetting}
                    />
                </div>
            </div>
        </Panel>
    );
};
