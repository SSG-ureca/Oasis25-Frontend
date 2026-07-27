import { cva } from "class-variance-authority";

export const clayVariants = cva(
  [
    "transition-all",
    "duration-200",
    "select-none",
    "ease-in-out",
    "rounded-3xl",
  ],
  {
    variants: {
      variant: {
        // 클레이모피즘 + 사막 (눈이 편안한)
        clay: [
          "bg-clay-bg",
          "shadow-[var(--shadow-clay)]",
          "border border-[var(--color-clay-border)]",
          "clay-surface",
          "text-text",
        ],
        clayFlat: ["shadow-none", "border-none"],
      },

      // 공통 inset 속성 (여기서는 공통 요소인 테두리 제거만 담당)
      inset: {
        true: "border-transparent",
        false: "",
      },

      // 전역 테마 (light / dark)
      theme: {
        light: "",
        dark: "dark",
      },
    },

    // 💡 핵심: 특정 조건이 결합했을 때 적용할 섀도우를 분리해 줍니다.
    compoundVariants: [
      {
        variant: "clay",
        inset: true,
        className: ["shadow-[var(--shadow-clay-inset)]"],
      },
    ],

    defaultVariants: {
      variant: "clay",
      inset: false,
      theme: "light",
    },
  },
);
