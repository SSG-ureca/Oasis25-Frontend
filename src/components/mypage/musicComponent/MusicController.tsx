import { Panel } from "../../common/Panel";
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
                <h3 className="text-lg font-semibold">BGM 관리</h3>

                <Button
                    variant="clay"
                    className="
            absolute
            right-0
            h-9
            px-4
            text-sm
        "
                    onClick={() => window.location.reload()}
                >
                    설정 적용
                </Button>
            </div>

            {/* BGM 리스트 */}
            <div
                className="
                    flex-1
                    min-h-0
                    items-center
                "
            >
                <BgmController
                    musicSetting={musicSetting}
                    setMusicSetting={setMusicSetting}
                />
            </div>
        </Panel>
    );
};
