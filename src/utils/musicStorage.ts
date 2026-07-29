import { BGM_LIST, ALARM_LIST } from "../types/music";
import type { MusicSetting } from "../types/music";

const STORAGE_KEY = "music_setting";

const defaultSetting: MusicSetting = {
  bgmOrder: BGM_LIST.map((bgm) => bgm.id),
  excludedBgm: [],
  selectedAlarm: ALARM_LIST[0]?.id ?? "",
};

// 저장된 설정을 현재 mp3 폴더 목록과 동기화 (파일이 추가/삭제된 경우 대비)
const reconcileSetting = (setting: MusicSetting): MusicSetting => {
  const validBgmIds = new Set(BGM_LIST.map((bgm) => bgm.id));
  const validAlarmIds = new Set(ALARM_LIST.map((alarm) => alarm.id));

  const knownBgmOrder = setting.bgmOrder.filter((id) => validBgmIds.has(id));
  const newBgmIds = BGM_LIST.map((bgm) => bgm.id).filter(
    (id) => !knownBgmOrder.includes(id),
  );

  return {
    bgmOrder: [...knownBgmOrder, ...newBgmIds],
    excludedBgm: setting.excludedBgm.filter((id) => validBgmIds.has(id)),
    selectedAlarm: validAlarmIds.has(setting.selectedAlarm)
      ? setting.selectedAlarm
      : (ALARM_LIST[0]?.id ?? ""),
  };
};

// LocalStorage에서 음악 로드
export const loadMusicSetting = (): MusicSetting => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return defaultSetting;
    }

    return reconcileSetting(JSON.parse(saved) as MusicSetting);
  } catch (error) {
    console.error("음악 설정 로드 실패", error);
    return defaultSetting;
  }
};

//LocalStorage에 음악을 저장
export const saveMusicSetting = (setting: MusicSetting): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(setting));
  } catch (error) {
    console.error("음악 설정 저장 실패", error);
  }
};
