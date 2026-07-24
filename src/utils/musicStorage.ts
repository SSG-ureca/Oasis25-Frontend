import type { MusicSetting } from "../types/music";

const STORAGE_KEY = "music_setting";

const defaultSetting: MusicSetting = {
    bgmOrder: ["bgm1", "bgm2", "bgm3", "bgm4"],
    excludedBgm: [],
    selectedAlarm: "alarm1",
};

// LocalStorage에서 음악 로드
export const loadMusicSetting = (): MusicSetting => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return defaultSetting;
        }

        return JSON.parse(saved) as MusicSetting;
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
