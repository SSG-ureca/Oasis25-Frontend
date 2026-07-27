import { useMemo } from "react";

export type CactusState = "cactus1" | "cactus2" | "cactus3" | "cactus4";

function getCactusState(water: number, caffeine: number): CactusState {
  const WATER_GOAL = 2000;
  const CAFFEINE_LIMIT = 400;
  const waterAchieved = water >= WATER_GOAL;
  const caffeineExceeded = caffeine > CAFFEINE_LIMIT;

  if (caffeineExceeded && !waterAchieved) return "cactus1";
  if (caffeineExceeded) return "cactus2";
  if (!waterAchieved) return "cactus3";
  return "cactus4";
}

const CACTUS_FILES: Record<CactusState, string> = {
  cactus1: "인장이1.png",
  cactus2: "인장이2.png",
  cactus3: "인장이3.png",
  cactus4: "인장이 4.png",
};

interface CactusStatusProps {
  water: number;
  caffeine: number;
}

export function CactusStatus({ water, caffeine }: CactusStatusProps) {
  const state = getCactusState(water, caffeine);

  const modules = import.meta.glob<{ default: string }>(
    "../../assets/images/cactus/*.png",
    { eager: true },
  );

  const photoSrc = useMemo(() => {
    const fileName = CACTUS_FILES[state];
    const matched = Object.entries(modules).find(([path]) =>
      path.endsWith(fileName),
    );
    if (matched) return matched[1].default;

    const fallback = Object.entries(modules).find(([path]) =>
      path.endsWith("cactus.png"),
    );
    return fallback?.[1].default;
  }, [modules, state]);

  const label = `선인장 ${state.replace("cactus", "")}`;

  if (photoSrc) {
    return (
      <img
        src={photoSrc}
        alt={label}
        className="mx-auto h-48 w-auto object-contain transition-all duration-500"
      />
    );
  }

  const fill = "#b08d55";

  return (
    <svg
      viewBox="0 0 120 200"
      className="mx-auto h-48 w-auto transition-all duration-500"
      aria-label={label}>
      <ellipse cx="60" cy="185" rx="32" ry="8" fill="#c4a27a" opacity="0.4" />
      <path
        d="M60,10 C45,10 40,30 40,60 L40,160 C40,175 50,185 60,185 C70,185 80,175 80,160 L80,60 C80,30 75,10 60,10 Z"
        fill={fill}
      />
      <path
        d="M42,100 C20,95 15,80 15,65 C15,55 22,48 32,52 C38,55 40,65 40,75 L40,90 Z"
        fill={fill}
      />
      <path
        d="M78,90 C100,85 105,70 105,55 C105,45 98,38 88,42 C82,45 80,55 80,65 L80,80 Z"
        fill={fill}
      />
    </svg>
  );
}
