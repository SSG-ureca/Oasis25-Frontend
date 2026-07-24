import { cn } from "../../utils/cn";
import type { VariantProps } from "class-variance-authority";
import { neumophismVariants } from "../../types/neumophismVariants";
import { useTheme } from "../../hooks/useTheme";

// 1. 버튼에 필요한 크기(Size)나 상태 스타일을 추가로 정의할 수 있습니다.
// (만약 neumophismVariants에 size가 빠졌다면 여기서 직접 관리해도 좋습니다)
export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neumophismVariants> {}

function Button({
  className,
  variant = "clay", // 기본값 설정
  inset = false,
  theme,
  type = "button",
  ...props
}: ButtonProps) {
  const { isDark } = useTheme();
  const resolvedTheme = theme ?? (isDark ? "dark" : "light");

  // 2. 인셋 상태에 따라 마우스 클릭(active) 시의 섀도우 전환 효과 매핑
  const activeShadowClass =
    variant === "clay"
      ? "active:shadow-[var(--shadow-clay-inset)]"
      : "active:shadow-[var(--shadow-neumorphism-inset)]";

  return (
    <button
      type={type}
      className={cn(
        // 공통 정렬 및 트랜지션 효과
        "inline-flex justify-center items-center font-medium cursor-pointer ",
        "active:scale-[0.98] active:border-transparent", // 클릭 시 미세하게 눌리는 물리 효과

        // CVA 변형 스타일 적용
        neumophismVariants({ variant, inset, theme: resolvedTheme }),

        // 토글 버튼처럼 이미 inset=true인 상태가 아니라면, 클릭할 때 들어가는 효과 부여
        !inset && `active:duration-75 ${activeShadowClass}`,

        className,
      )}
      {...props}
    />
  );
}

export { Button };
