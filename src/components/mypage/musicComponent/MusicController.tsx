import { Panel } from "../../common/Panel";
import { BgmController } from "./BgmController";

import { useEffect, useState } from "react";

import {
    loadMusicSetting,
    saveMusicSetting,
} from "../../../utils/musicStorage";

import type { MusicSetting } from "../../../types/music";
// import { Button } from "../../common/Button";

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
                pt-3

                shrink-0
                "
            >
                <Panel
                    variant="clay"
                    className="
                    px-6
                    py-3

                    "
                >
                    <h3 className="text-lg font-semibold">ASMR 목록</h3>
                </Panel>
            </div>
            {/* <Button
                variant="clay"
                className="
                w-full
                880:w-auto
                "
                onClick={() => window.location.reload()}
            >
                설정 적용
            </Button> */}
            {/* BGM 리스트 */}
            <div
                className="
                    flex-1
                    min-h-0
                    items-center
                    w-full
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
