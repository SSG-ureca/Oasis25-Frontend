import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

//tailwindcss에서 충돌하는 클래스를 자동으로 정리해주는 함수
export function cn(...inputs: ClassValue[]) {
  // 1. clsx로 조건부 클래스들을 문자열 하나로 안전하게 합치고
  // 2. twMerge로 중복/충돌하는 Tailwind 클래스를 정리한다 (뒤에 온 클래스가 승리)
  return twMerge(clsx(inputs));
}
