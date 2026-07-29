export type BgmType = "bgm1" | "bgm2" | "bgm3" | "bgm4";

export type AlarmType = "alarm1" | "alarm2" | "alarm3" | "alarm4";

export interface MusicSetting {
    bgmOrder: BgmType[];
    excludedBgm: BgmType[];
    selectedAlarm: AlarmType;
}
export const BGM_LIST = [
    {
        id: "bgm1",
        name: "도시의 일상",
        path: "/mp3/sound/city_1 (1).mp3",
    },
    {
        id: "bgm2",
        name: "숲속 소리",
        path: "/mp3/sound/nature_1 (1).mp3",
    },
    {
        id: "bgm3",
        name: "비오는 날1",
        path: "/mp3/sound/rain_1 (1).mp3",
    },
    {
        id: "bgm4",
        name: "비오는 날2",
        path: "/mp3/sound/rain_2 (1).mp3",
    },
] as const;

export const ALARM_LIST = [
    {
        id: "alarm1",
        name: "알람 1",
        path: "/mp3/alarm/fart_1 (1).mp3",
    },
    {
        id: "alarm2",
        name: "알람 2",
        path: "/mp3/alarm/fart_2 (1).mp3",
    },
    {
        id: "alarm3",
        name: "알람 3",
        path: "/mp3/alarm/알람_4.mp3",
    },
    {
        id: "alarm4",
        name: "알람 4",
        path: "/mp3/alarm/종_3.mp3",
    },
] as const;
