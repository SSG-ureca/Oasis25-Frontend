import { cn } from "../../utils/cn";
import { neumophismVariants } from "../../types/neumophismVariants";

interface PomodoroOrbProps {
  timeLabel: string;
  subLabel: string;
  isFocus: boolean;
  /** 타이머 진행 여부 - true일 때만 링 회전 애니메이션이 흐름 */
  isRunning: boolean;
}

export default function PomodoroOrb({
  timeLabel,
  subLabel,
  isFocus,
  isRunning,
}: PomodoroOrbProps) {
  return (
    <div className="relative w-60 h-60">
      {/* 집중/휴식 모드 색상 그라데이션 링 - 타이머가 진행 중일 때만 원을 따라 천천히 회전 */}
      <div
        className="absolute inset-0 rounded-full animate-orb-rotate transition-colors duration-700"
        style={{
          background: isFocus
            ? // 투명 구간 이 길어지면 호의 길이 조절 짧아짐
              "conic-gradient(from 0deg, var(--color-primary), transparent 30%, transparent 70%, var(--color-primary))"
            : "conic-gradient(from 0deg, var(--color-green-50), transparent 30%, transparent 70%, var(--color-green-50))",
          WebkitMaskImage:
            "radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))",
          maskImage:
            "radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))",
          animationPlayState: isRunning ? "running" : "paused",
        }}
      />

      {/* neumophismVariants의 inset 글래스-뉴모피즘 원 안에 타이머 */}
      <div
        className={cn(
          neumophismVariants({ variant: "neumorphism", inset: true }),
          "absolute inset-2 rounded-full flex flex-col items-center justify-center",
        )}>
        <span className="text-4xl font-sans tabular-nums text-gray-10 drop-shadow-sm">
          {timeLabel}
        </span>
        <span className="text-xs text-gray-20 mt-1 font-medium">
          {subLabel}
        </span>
      </div>
    </div>
  );
}
