import { cva } from "class-variance-authority";

export const neumophismVariants = cva(
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
        // 1. 순수 뉴모피즘 (기본 상태 - 튀어나온 느낌)
        neumorphism: [
          "bg-bg-light",
          "border",
          "border-white/20",
          "shadow-[var(--shadow-neumorphism)]",
        ],

        // 2. 클레이모피즘 + 사막 (눈이 편안한)
        clay: ["clay-surface", "bg-clay-bg", "shadow-clay"],
      },

      // 공통 inset 속성 (여기서는 공통 요소인 테두리 제거만 담당)
      inset: {
        true: "border-transparent",
        false: "",
      },
    },

    // 💡 핵심: 특정 조건이 결합했을 때 적용할 섀도우를 분리해 줍니다.
    compoundVariants: [
      {
        variant: "neumorphism",
        inset: true,
        className: ["shadow-[var(--shadow-neumorphism-inset)]"],
      },
      {
        variant: "clay",
        inset: true,
        className: ["shadow-clay-inset"],
      },
    ],

    defaultVariants: {
      variant: "clay",
      inset: false,
    },
  },
);
