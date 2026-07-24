import { cn } from "../../utils/cn";
import type { VariantProps } from "class-variance-authority";
import { neumophismVariants } from "../../types/neumophismVariants";

export interface PanelProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof neumophismVariants> {}

function Panel({ className, variant, inset, ...props }: PanelProps) {
  return (
    <div
      className={cn(
        "justify-center items-center",
        neumophismVariants({
          variant,
          inset,
        }),
        className,
      )}
      {...props}
    />
  );
}

export { Panel };
