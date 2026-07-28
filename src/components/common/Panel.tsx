import { cn } from "../../utils/cn";
import type { VariantProps } from "class-variance-authority";
import { clayVariants } from "../../types/clayVariants";
import { useTheme } from "../../hooks/useTheme";

export interface PanelProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof clayVariants> {}

function Panel({ className, variant, inset, theme, ...props }: PanelProps) {
  const { isDark } = useTheme();
  const resolvedTheme = theme ?? (isDark ? "dark" : "light");

  return (
    <div
      className={cn(
        "justify-center items-center",
        clayVariants({
          variant,
          inset,
          theme: resolvedTheme,
        }),
        className,
      )}
      {...props}
    />
  );
}

export { Panel };
