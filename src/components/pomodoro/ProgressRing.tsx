import { cn } from "../../utils/cn";

interface ProgressRingProps {
  /** 0 ~ 1 사이 값. 남은 시간의 비율입니다. */
  progress: number;
  size?: number;
  strokeWidth?: number;
  trackClassName?: string;
  progressClassName?: string;
  dotClassName?: string;
  children?: React.ReactNode;
}

export default function ProgressRing({
  progress,
  size = 260,
  strokeWidth = 10,
  trackClassName = "stroke-gray-70",
  progressClassName = "stroke-primary",
  dotClassName = "fill-primary",
  children,
}: ProgressRingProps) {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, progress));
  const dashOffset = circumference * (1 - clamped);

  // 12시 방향(-90deg)에서 시작해 시계방향으로 진행되는 끝점 좌표
  const angleRad = ((clamped * 360 - 90) * Math.PI) / 180;
  const dotX = center + radius * Math.cos(angleRad);
  const dotY = center + radius * Math.sin(angleRad);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <g transform={`rotate(-90 ${center} ${center})`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            className={trackClassName}
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className={cn(
              "transition-[stroke-dashoffset] duration-300 ease-linear",
              progressClassName,
            )}
          />
        </g>
        {clamped > 0 && (
          <circle
            cx={dotX}
            cy={dotY}
            r={strokeWidth / 2 + 1}
            className={dotClassName}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
