import { cn } from "../../utils/cn";
import type { VariantProps } from "class-variance-authority";
import { neumophismVariants } from "../../types/neumophismVariants";
import { useTheme } from "../../hooks/useTheme";

export interface PanelProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof neumophismVariants> {}

function Panel({ className, variant, inset, theme, ...props }: PanelProps) {
  const { isDark } = useTheme();
  const resolvedTheme = theme ?? (isDark ? "dark" : "light");

  return (
    <div
      className={cn(
        "justify-center items-center",
        neumophismVariants({
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
