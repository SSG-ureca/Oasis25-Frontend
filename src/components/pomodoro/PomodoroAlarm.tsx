import { useEffect, useRef } from "react";

interface PomodoroAlarmProps {
  mode: string;
}

const ALARM_SRC = "/mp3/alarm/종_3.mp3";

export default function PomodoroAlarm({ mode }: PomodoroAlarmProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevModeRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      prevModeRef.current !== null &&
      prevModeRef.current !== mode &&
      audioRef.current
    ) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // 브라우저 자동 재생 정책으로 차단된 경우 무시
      });
    }
    prevModeRef.current = mode;
  }, [mode]);

  return <audio ref={audioRef} src={ALARM_SRC} preload="auto" />;
}
