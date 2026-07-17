import { cva } from "class-variance-authority";

export const neumophismVariants = cva(
  ["transition-all", "duration-200", "select-none", "ease-in-out"],
  {
    variants: {
      variant: {
        // 1. 순수 글래스모피즘
        glass: [
          "bg-white/30",
          "backdrop-blur-xl",
          "border",
          "border-white/40",
          "shadow-[var(--shadow-glass)]",
        ],

        // 2. 순수 뉴모피즘 (기본 상태 - 튀어나온 느낌)
        neumorphism: [
          "bg-bg-light",
          "border",
          "border-white/30",
          "shadow-[var(--shadow-neumorphism)]",
        ],

        // 3. 글래스-뉴모피즘 (기본 상태 - 반투명하게 튀어나온 느낌)
        glassNeumorphism: [
          "bg-white/25",
          "backdrop-blur-lg",
          "border",
          "border-white/50",
          "shadow-[var(--shadow-glass-neumorphism)]",
        ],
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
        variant: "glassNeumorphism",
        inset: true,
        className: ["shadow-[var(--shadow-glass-neumorphism-inset)]"],
      },
      {
        variant: "glass",
        inset: true,
        className: ["shadow-[var(--shadow-glass-inset)]"],
      },
    ],

    defaultVariants: {
      variant: "glass",
      inset: false,
    },
  },
);
