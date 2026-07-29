import { useEffect, useMemo, useRef } from "react";
import { ALARM_LIST } from "../../types/music";
import { loadMusicSetting } from "../../utils/musicStorage";

interface PomodoroAlarmProps {
  completedAt?: number | null;
}

const DEFAULT_ALARM_SRC = ALARM_LIST[0]?.path ?? "";

export default function PomodoroAlarm({ completedAt }: PomodoroAlarmProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastCompletedAtRef = useRef<number | null>(completedAt ?? null);

  const alarmSrc = useMemo(() => {
    const setting = loadMusicSetting();
    return (
      ALARM_LIST.find((alarm) => alarm.id === setting.selectedAlarm)?.path ??
      DEFAULT_ALARM_SRC
    );
  }, [completedAt]);

  useEffect(() => {
    if (
      completedAt != null &&
      completedAt !== lastCompletedAtRef.current &&
      audioRef.current
    ) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // 브라우저 자동 재생 정책으로 차단된 경우 무시
      });
      lastCompletedAtRef.current = completedAt;
    }
  }, [completedAt]);

  return <audio ref={audioRef} src={alarmSrc} preload="auto" />;
}
