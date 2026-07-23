// 회고 작성 패널 감정 버튼 컴포넌트
import { Button } from "../common/Button";

const emotions = [
  { score: 1, icon: "😡" },
  { score: 2, icon: "😢" },
  { score: 3, icon: "😐" },
  { score: 4, icon: "😊" },
  { score: 5, icon: "😀" },
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
                gap-2
            ">
      {emotions.map((emotion) => (
        <Button
          key={emotion.score}
          variant={value === emotion.score ? "clay" : "clayFlat"}
          className={`
                        w-10
                        h-10
                        p-0
                        rounded-full
                        ${value === emotion.score ? "" : "shadow-none border-none"}
                    `}
          onClick={() => onChange(emotion.score)}>
          {emotion.icon}
        </Button>
      ))}
    </div>
  );
};
