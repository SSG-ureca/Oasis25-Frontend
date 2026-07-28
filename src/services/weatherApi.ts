import { useEffect, useState } from "react";

const KMA_BASE_URL = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0";
const SERVICE_KEY = import.meta.env.VITE_KMA_SERVICE_KEY as string | undefined;

interface KmaItem {
  baseDate: string;
  baseTime: string;
  category: string;
  nx: number;
  ny: number;
  obsrValue?: string;
  fcstDate?: string;
  fcstTime?: string;
  fcstValue?: string;
}

export interface WeatherState {
  temp: number | null;
  skyText: string;
  iconName: string;
  humidity: number | null;
  feelsLike: number | null;
  loading: boolean;
  error: string | null;
}

/**
 * 위/경도를 기상청 LCC 격자 좌표(nx, ny)로 변환 (기본값: 서울)
 */
export function dfs_xy_conv(lat = 37.5665, lon = 126.978) {
  const RE = 6371.00877;
  const GRID = 5.0;
  const SLAT1 = 30.0;
  const SLAT2 = 60.0;
  const OLON = 126.0;
  const OLAT = 38.0;
  const XO = 43;
  const YO = 136;

  const DEGRAD = Math.PI / 180.0;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;

  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  const ra =
    (re * sf) / Math.pow(Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5), sn);
  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

  return { nx, ny };
}

/**
 * 기상청 실황/예보 데이터 생성 시각(매시 40분) 기준 base_date, base_time 반환
 */
export function getBaseDateTime(now = new Date()) {
  const target = new Date(now);

  if (target.getMinutes() < 40) {
    target.setHours(target.getHours() - 1);
  }

  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, "0");
  const day = String(target.getDate()).padStart(2, "0");
  const hour = String(target.getHours()).padStart(2, "0");

  return {
    baseDate: `${year}${month}${day}`,
    baseTime: `${hour}00`,
  };
}

async function fetchKmaItems(
  endpoint: string,
  baseDate: string,
  baseTime: string,
  nx: number,
  ny: number,
): Promise<KmaItem[]> {
  if (!SERVICE_KEY) {
    throw new Error("VITE_KMA_SERVICE_KEY가 설정되지 않았습니다.");
  }

  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    pageNo: "1",
    numOfRows: "1000",
    dataType: "JSON",
    base_date: baseDate,
    base_time: baseTime,
    nx: String(nx),
    ny: String(ny),
  });

  const res = await fetch(`${KMA_BASE_URL}/${endpoint}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`기상청 API 응답 오류: ${res.status}`);
  }

  const data = await res.json();
  const header = data?.response?.header;
  if (header?.resultCode !== "00") {
    throw new Error(
      header?.resultMsg || `기상청 API 오류: ${header?.resultCode}`,
    );
  }

  const item = data?.response?.body?.items?.item;
  if (!item) {
    throw new Error("기상청 API에서 데이터를 찾을 수 없습니다.");
  }

  return Array.isArray(item) ? item : [item];
}

export async function getUltraSrtNcst(
  baseDate: string,
  baseTime: string,
  nx: number,
  ny: number,
) {
  const items = await fetchKmaItems(
    "getUltraSrtNcst",
    baseDate,
    baseTime,
    nx,
    ny,
  );

  const t1h = items.find((i) => i.category === "T1H");
  const pty = items.find((i) => i.category === "PTY");
  const reh = items.find((i) => i.category === "REH");
  const wsd = items.find((i) => i.category === "WSD");

  return {
    temp: t1h && t1h.obsrValue !== undefined ? Number(t1h.obsrValue) : null,
    pty: pty && pty.obsrValue !== undefined ? Number(pty.obsrValue) : 0,
    humidity: reh && reh.obsrValue !== undefined ? Number(reh.obsrValue) : null,
    windSpeed:
      wsd && wsd.obsrValue !== undefined ? Number(wsd.obsrValue) : null,
  };
}

export async function getUltraSrtFcst(
  baseDate: string,
  baseTime: string,
  nx: number,
  ny: number,
) {
  const items = await fetchKmaItems(
    "getUltraSrtFcst",
    baseDate,
    baseTime,
    nx,
    ny,
  );

  const skyItems = items
    .filter((i) => i.category === "SKY" && i.fcstValue !== undefined)
    .sort((a, b) =>
      `${a.fcstDate}${a.fcstTime}`.localeCompare(`${b.fcstDate}${b.fcstTime}`),
    );

  return skyItems[0] ? Number(skyItems[0].fcstValue) : 1;
}

function computeFeelsLike(
  temp: number | null,
  humidity: number | null,
  windSpeed: number | null,
): number | null {
  if (temp === null || humidity === null || windSpeed === null) {
    return null;
  }
  const e =
    (humidity / 100) * 6.105 * Math.exp((17.27 * temp) / (237.7 + temp));
  const at = temp + 0.33 * e - 0.7 * windSpeed - 4.0;
  return Math.round(at * 10) / 10;
}

function mapWeather(pty: number, sky: number) {
  if (pty === 1 || pty === 5) {
    return { skyText: pty === 1 ? "비" : "빗방울", iconName: "CloudRain" };
  }
  if (pty === 2 || pty === 6) {
    return {
      skyText: pty === 2 ? "비/눈" : "빗방울/눈날림",
      iconName: "CloudRain",
    };
  }
  if (pty === 3 || pty === 7) {
    return { skyText: pty === 3 ? "눈" : "눈날림", iconName: "Snowflake" };
  }
  if (pty === 4) {
    return { skyText: "소나기", iconName: "CloudLightning" };
  }

  switch (sky) {
    case 1:
      return { skyText: "맑음", iconName: "Sun" };
    case 2:
      return { skyText: "구름조금", iconName: "CloudSun" };
    case 3:
      return { skyText: "구름많음", iconName: "CloudSun" };
    case 4:
      return { skyText: "흐림", iconName: "Cloud" };
    default:
      return { skyText: "흐림", iconName: "Cloud" };
  }
}

/**
 * { temp, skyText, iconName, loading, error } 상태를 반환하는 Hook
 */
export function useWeather(
  lat?: number,
  lon?: number,
  enabled = true,
): WeatherState {
  const [state, setState] = useState<WeatherState>({
    temp: null,
    skyText: "불러오는 중...",
    iconName: "Loader2",
    humidity: null,
    feelsLike: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!enabled || lat == null || lon == null) {
      return;
    }

    let cancelled = false;
    let timeoutId: number | undefined;

    async function load() {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        iconName: "Loader2",
        skyText: "불러오는 중...",
      }));

      try {
        const { nx, ny } = dfs_xy_conv(lat, lon);
        const { baseDate, baseTime } = getBaseDateTime();

        const [{ temp, pty, humidity, windSpeed }, sky] = await Promise.all([
          getUltraSrtNcst(baseDate, baseTime, nx, ny),
          getUltraSrtFcst(baseDate, baseTime, nx, ny),
        ]);

        const feelsLike = computeFeelsLike(temp, humidity, windSpeed);
        const { skyText, iconName } = mapWeather(pty, sky);

        if (!cancelled) {
          setState({
            temp,
            skyText,
            iconName,
            humidity,
            feelsLike,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            temp: null,
            skyText: "불러오지 못함",
            iconName: "Cloud",
            humidity: null,
            feelsLike: null,
            loading: false,
            error:
              err instanceof Error
                ? err.message
                : "날씨 정보를 가져오지 못했습니다.",
          });
        }
      } finally {
        if (!cancelled) {
          timeoutId = window.setTimeout(load, 30 * 60 * 1000);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [lat, lon, enabled]);

  return state;
}

export interface Weather {
  condition: string;
  temperature: number;
}

export async function fetchCurrentWeather(): Promise<Weather | null> {
  let lat = 37.5665;
  let lon = 126.978;

  if (navigator.geolocation) {
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 8000,
          });
        },
      );
      lat = position.coords.latitude;
      lon = position.coords.longitude;
    } catch {
      // keep default Seoul
    }
  }

  try {
    const { nx, ny } = dfs_xy_conv(lat, lon);
    const { baseDate, baseTime } = getBaseDateTime();

    const [{ temp, pty }, sky] = await Promise.all([
      getUltraSrtNcst(baseDate, baseTime, nx, ny),
      getUltraSrtFcst(baseDate, baseTime, nx, ny),
    ]);

    const { skyText } = mapWeather(pty, sky);
    return { condition: skyText, temperature: temp ?? 0 };
  } catch {
    return null;
  }
}
