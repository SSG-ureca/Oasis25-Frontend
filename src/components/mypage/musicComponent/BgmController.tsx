import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import {
    DndContext,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";

import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";

import { SortableBgmItem } from "./SortableBgmItem";

import type { MusicSetting, BgmType } from "../../../types/music";
import { BGM_LIST } from "../../../types/music";
import {
    restrictToVerticalAxis,
    restrictToParentElement,
} from "@dnd-kit/modifiers";

interface BgmControllerProps {
    musicSetting: MusicSetting;
    setMusicSetting: Dispatch<SetStateAction<MusicSetting>>;
}

export const BgmController = ({
    musicSetting,
    setMusicSetting,
}: BgmControllerProps) => {
    const { bgmOrder, excludedBgm } = musicSetting;

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [playingBgm, setPlayingBgm] = useState<BgmType | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
    );

    // 컴포넌트가 사라질 때 음악 정지
    useEffect(() => {
        return () => {
            if (!audioRef.current) return;

            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        };
    }, []);

    // 제외 여부 변경
    const toggleExclude = (bgm: BgmType) => {
        setMusicSetting((prev) => {
            const isExcluded = prev.excludedBgm.includes(bgm);

            return {
                ...prev,
                excludedBgm: isExcluded
                    ? prev.excludedBgm.filter((item) => item !== bgm)
                    : [...prev.excludedBgm, bgm],
            };
        });
    };

    // 미리듣기
    const handlePreview = (bgm: BgmType, path: string) => {
        if (playingBgm === bgm) return;

        audioRef.current?.pause();

        const audio = new Audio(path);

        audio.volume = 0.4;

        audio.onended = () => {
            setPlayingBgm(null);
        };

        audio.play();

        audioRef.current = audio;
        setPlayingBgm(bgm);
    };

    // 정지
    const handleStop = () => {
        if (!audioRef.current) return;

        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;

        setPlayingBgm(null);
    };

    // 드래그 종료
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = bgmOrder.indexOf(active.id as BgmType);
        const newIndex = bgmOrder.indexOf(over.id as BgmType);

        setMusicSetting((prev) => ({
            ...prev,
            bgmOrder: arrayMove(prev.bgmOrder, oldIndex, newIndex),
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
        justify-center
    "
            >
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[
                        restrictToVerticalAxis,
                        restrictToParentElement,
                    ]}
                >
                    <SortableContext
                        items={bgmOrder}
                        strategy={verticalListSortingStrategy}
                    >
                        {bgmOrder.map((bgm) => {
                            const music = BGM_LIST.find(
                                (item) => item.id === bgm,
                            )!;

                            return (
                                <SortableBgmItem
                                    key={bgm}
                                    id={bgm}
                                    name={music.name}
                                    excluded={excludedBgm.includes(bgm)}
                                    playing={playingBgm === bgm}
                                    onPreview={() =>
                                        handlePreview(bgm, music.path)
                                    }
                                    onStop={handleStop}
                                    onToggleExclude={() => toggleExclude(bgm)}
                                />
                            );
                        })}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
};
