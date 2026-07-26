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
            className={`
        flex
        items-center
        justify-between

        h-12
        px-3

        rounded-xl

        bg-[var(--color-clay-bg)]
        border
        border-[var(--color-clay-border)]

        transition-all
        duration-200

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
                    className="cursor-grab active:cursor-grabbing"
                >
                    <GripVertical size={16} />
                </div>

                <span className="text-sm font-medium">{name}</span>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="clay"
                    className="h-8 w-8 p-0"
                    onClick={playing ? onStop : onPreview}
                >
                    {playing ? <Square size={14} /> : <Play size={14} />}
                </Button>

                <label className="flex items-center gap-1 text-xs cursor-pointer">
                    <input
                        type="checkbox"
                        checked={excluded}
                        onChange={onToggleExclude}
                    />
                    제외
                </label>
            </div>
        </div>
    );
};
