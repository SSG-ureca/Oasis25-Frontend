import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // 인풋 위 레이블 텍스트 (선택사항)
  label?: string;
  // 좌측에 들어갈 Lucide 아이콘 컴포넌트 (선택사항)
  icon?: LucideIcon;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  icon: Icon,
  type = "text",
  className,
  ...props
}) => {
  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label className="text-[10px] text-text-muted font-bold tracking-widest block uppercase font-mono pl-1">
          {label}
        </label>
      )}
      <div className="relative">
        {/* 아이콘이 있을 경우에만 절대 위치로 렌더링 */}
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        )}
        {/* 인풋 태그 (아이콘이 없을 때는 왼쪽 패딩을 px-4로 자동 조절) */}
        <input
          type={type}
          className={cn(
            "w-full pr-4 py-3.5 text-xs bg-bg-light shadow-[var(--shadow-neumorphism-inset)] border border-transparent rounded-2xl focus:outline-none focus:border-gray-40 text-text transition-all",
            Icon ? "pl-11" : "px-4",
            className,
          )}
          {...props}
        />
      </div>
    </div>
  );
};

export default InputField;
