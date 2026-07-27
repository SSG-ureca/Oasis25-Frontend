import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Play, Square } from "lucide-react";

import { Button } from "../../common/Button";
import type { BgmType } from "../../../types/music";

interface SortableBgmItemProps {
    id: BgmType;
    name: string;

    excluded: boolean;
    playing: boolean;

    onPreview: () => void;
    onStop: () => void;
    onToggleExclude: () => void;
}

export const SortableBgmItem = ({
    id,
    name,
    excluded,
    playing,
    onPreview,
    onStop,
    onToggleExclude,
}: SortableBgmItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onToggleExclude}
            className={`
                flex
                items-center
                justify-between

                h-12
                px-3

                rounded-xl
                cursor-pointer

                bg-[var(--color-clay-bg)]
                border
                border-[var(--color-clay-border)]

                transition-all
                duration-200

                ${excluded ? "opacity-60" : ""}

                ${
                    isDragging
                        ? "shadow-[var(--shadow-clay)] scale-[1.02] z-50"
                        : "shadow-[var(--shadow-clay-inset)]"
                }
            `}
        >
            <div className="flex items-center gap-3">
                <div
                    {...attributes}
                    {...listeners}
                    onClick={(e) => e.stopPropagation()}
                    className="
                        cursor-grab
                        active:cursor-grabbing
                    "
                >
                    <GripVertical size={16} />
                </div>

                <span
                    className={`
                        text-sm
                        font-medium
                        transition

                        ${excluded ? "text-gray-400 line-through" : ""}
                    `}
                >
                    {name}
                </span>
            </div>

            <Button
                variant="clay"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                    e.stopPropagation();

                    if (playing) {
                        onStop();
                    } else {
                        onPreview();
                    }
                }}
            >
                {playing ? <Square size={14} /> : <Play size={14} />}
            </Button>
        </div>
    );
};
