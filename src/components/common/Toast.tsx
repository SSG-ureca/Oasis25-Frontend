import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Check, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastItemProps extends Toast {
  onRemove: (id: string) => void;
}

const TOAST_CONFIG: Record<
  ToastType,
  {
    icon: React.FC<{ className?: string }>;
    iconColor: string;
    accentBar: string;
    bg: string;
  }
> = {
  success: {
    icon: Check,
    iconColor: "text-green-50",
    accentBar: "bg-gradient-to-b from-[#1a521d] via-[#2c8f31] to-[#72c877]",
    bg: "bg-white/55",
  },
  error: {
    icon: X,
    iconColor: "text-rose-500",
    accentBar: "bg-gradient-to-b from-rose-700 via-rose-500 to-rose-300",
    bg: "bg-white/55",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    accentBar: "bg-gradient-to-b from-blue-700 via-blue-500 to-sky-300",
    bg: "bg-white/55",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    accentBar: "bg-gradient-to-b from-amber-600 via-amber-400 to-yellow-200",
    bg: "bg-white/55",
  },
};

const ToastItem = ({
  id,
  type,
  message,
  duration = 2000,
  onRemove,
}: ToastItemProps) => {
  const config = TOAST_CONFIG[type];
  const Icon = config.icon;
  const [phase, setPhase] = useState<"enter" | "idle" | "exit">("enter");
  const [progress, setProgress] = useState(100);
  const startTimeRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);
  const removeRef = useRef(onRemove);
  removeRef.current = onRemove;

  useEffect(() => {
    const t = setTimeout(() => setPhase("idle"), 20);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase("exit");
        setTimeout(() => removeRef.current(id), 350);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [id, duration]);

  const handleClose = () => {
    setPhase("exit");
    setTimeout(() => onRemove(id), 400);
  };

  const isEntering = phase === "enter";
  const isExiting = phase === "exit";

  const radius = 9.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = (progress / 100) * circumference;

  return (
    <div
      className={`
        relative flex items-center gap-3 w-[320px] rounded-xl overflow-hidden
        ${config.bg} backdrop-blur-md
        border border-white/40
        shadow-[0_4px_20px_rgba(0,0,0,0.08)]
        px-3.5 py-3
        transition-all duration-[380ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${isEntering ? "opacity-0 -translate-y-3 scale-95" : ""}
        ${isExiting ? "opacity-0 translate-y-1 scale-95 !duration-[300ms] !ease-in" : ""}
        ${!isEntering && !isExiting ? "opacity-100 translate-y-0 scale-100" : ""}
      `}
      role="alert"
    >
      <div className="relative flex items-center justify-center shrink-0 w-5 h-5 ml-1">
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 20 20"
        >
          <circle
            cx="10"
            cy="10"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-200"
          />
          <circle
            cx="10"
            cy="10"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${config.iconColor} transition-none`}
          />
        </svg>
        <Icon className={`w-3.5 h-3.5 z-10 ${config.iconColor}`} />
      </div>

      <p className="flex-1 text-[12.5px] font-medium text-gray-700 leading-snug break-keep">
        {message}
      </p>

      <button
        onClick={handleClose}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-150 ml-1"
        aria-label="닫기"
      >
        <X className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </div>
  );
};

type AddToastFn = (type: ToastType, message: string, duration?: number) => void;
let _globalAdd: AddToastFn | null = null;

export const toast = {
  success: (msg: string, duration?: number) =>
    _globalAdd?.("success", msg, duration),
  error: (msg: string, duration?: number) =>
    _globalAdd?.("error", msg, duration),
  info: (msg: string, duration?: number) => _globalAdd?.("info", msg, duration),
  warning: (msg: string, duration?: number) =>
    _globalAdd?.("warning", msg, duration),
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast: AddToastFn = useCallback((type, message, duration) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    _globalAdd = addToast;
    return () => {
      _globalAdd = null;
    };
  }, [addToast]);

  return createPortal(
    <div
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem {...t} onRemove={removeToast} />
        </div>
      ))}
    </div>,
    document.body,
  );
};

export default ToastContainer;
