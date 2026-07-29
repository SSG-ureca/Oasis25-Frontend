export interface Music {
  id: string;
  name: string;
  path: string;
}

export type BgmType = string;
export type AlarmType = string;

export interface MusicSetting {
  bgmOrder: BgmType[];
  excludedBgm: BgmType[];
  selectedAlarm: AlarmType;
}

const alarmModules = import.meta.glob("../../public/mp3/alarm/*.mp3");
const soundModules = import.meta.glob("../../public/mp3/sound/*.mp3");

function createMusicList(modules: Record<string, unknown>): Music[] {
  return Object.keys(modules)
    .map((raw) => {
      const relativePath = raw.split("/public/")[1] ?? raw;
      const filePath = `/${relativePath}`.split("?")[0];
      const fileName = filePath.split("/").pop() ?? "";
      const decoded = decodeURIComponent(fileName);
      const id = decoded.replace(/(\.mp3)+$/i, "");
      const name = id;
      return { id, name, path: filePath };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "ko"));
}

export const BGM_LIST: readonly Music[] = createMusicList(soundModules);
export const ALARM_LIST: readonly Music[] = createMusicList(alarmModules);
