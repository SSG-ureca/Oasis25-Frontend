import { Minus, Plus } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../common/Button";

interface IntakeCounterProps {
  label: string;
  value: number;
  unit: string;
  onIncrease: () => void;
  onDecrease: () => void;
  canDecrease: boolean;
  disabled?: boolean;
}

export function IntakeCounter({
  label,
  value,
  unit,
  onDecrease,
  onIncrease,
  canDecrease,
  disabled = false,
}: IntakeCounterProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-medium text-text-muted">{label}</span>
      <div className="text-lg font-bold ">
        {value.toLocaleString()}
        <span className="ml-0.5 text-xs font-normal text-text-muted">
          {unit}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          variant="clay"
          type="button"
          onClick={onDecrease}
          disabled={!canDecrease || disabled}
          aria-label={`${label} 감소`}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            canDecrease && !disabled
              ? "clay-hover"
              : "cursor-not-allowed opacity-50",
          )}>
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="clay"
          type="button"
          onClick={onIncrease}
          disabled={disabled}
          aria-label={`${label} 증가`}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            disabled ? "cursor-not-allowed opacity-50" : "clay-hover",
          )}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
