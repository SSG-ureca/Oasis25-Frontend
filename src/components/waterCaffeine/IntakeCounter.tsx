import { Minus, Plus } from "lucide-react";
import { cn } from "../../utils/cn";

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
  onIncrease,
  onDecrease,
  canDecrease,
  disabled = false,
}: IntakeCounterProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <div className="text-lg font-bold text-slate-800">
        {value.toLocaleString()}
        <span className="ml-0.5 text-xs font-normal text-slate-500">
          {unit}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onIncrease}
          disabled={disabled}
          aria-label={`${label} 증가`}
          className={cn(
            "bg-clay-bg flex h-9 w-9 items-center justify-center rounded-full transition-transform active:scale-95",
            disabled
              ? "cursor-not-allowed opacity-50 shadow-clay-inset"
              : "shadow-clay clay-hover",
          )}>
          <Plus className="h-4 w-4 text-slate-700" />
        </button>
        <button
          type="button"
          onClick={onDecrease}
          disabled={!canDecrease || disabled}
          aria-label={`${label} 감소`}
          className={cn(
            "bg-clay-bg flex h-9 w-9 items-center justify-center rounded-full transition-transform active:scale-95",
            canDecrease && !disabled
              ? "shadow-clay clay-hover"
              : "cursor-not-allowed opacity-50 shadow-clay-inset",
          )}>
          <Minus className="h-4 w-4 text-slate-700" />
        </button>
      </div>
    </div>
  );
}
