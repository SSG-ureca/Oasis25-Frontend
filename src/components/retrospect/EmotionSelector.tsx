// 회고 작성 패널 감정 버튼 컴포넌트
import { Button } from "../common/Button";
import c1 from "../../assets/images/c1.png";
import c2 from "../../assets/images/c2.png";
import c3 from "../../assets/images/c3.png";
import c4 from "../../assets/images/c4.png";
import c5 from "../../assets/images/c5.png";

const emotions = [
    { score: 1, src: c1 },
    { score: 2, src: c2 },
    { score: 3, src: c3 },
    { score: 4, src: c4 },
    { score: 5, src: c5 },
];

interface EmotionSelectorProps {
    value: number | null;
    onChange: (score: number) => void;
}

export const EmotionSelector = ({ value, onChange }: EmotionSelectorProps) => {
    return (
        <div
            className="
                flex
                items-center
                gap-1
            "
        >
            {emotions.map((emotion) => (
                <Button
                    key={emotion.score}
                    variant={value === emotion.score ? "clay" : "clayFlat"}
                    className={`
                w-10
                h-10
                p-0
                rounded-full
                transition-all
                duration-200
    ${
        value === emotion.score
            ? `
            
            shadow-[var(--shadow-clay)]
            `
            : `
            opacity-40
            hover:opacity-150
            shadow-none
            border-none
            `
    }
    active:scale-95
`}
                    onClick={() => onChange(emotion.score)}
                >
                    <img
                        src={emotion.src}
                        alt={`감정 ${emotion.score}`}
                        className="w-10 h-10 object-contain select-none pointer-events-none"
                        draggable={false}
                    />
                </Button>
            ))}
        </div>
    );
};
//
