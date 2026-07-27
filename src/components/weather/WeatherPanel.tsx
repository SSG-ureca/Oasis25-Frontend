import { useEffect, useState } from "react";

import { useWeather } from "../../services/weatherApi";
import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Loader2,
  Snowflake,
  Sun,
  MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Panel } from "../common/Panel";

const ICONS: Record<string, LucideIcon> = {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  Loader2,
};

export function WeatherPanel() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null,
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setCoords({ lat: 37.5665, lon: 126.978 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setCoords({ lat: 37.5665, lon: 126.978 }),
      { timeout: 8000 },
    );
  }, []);

  const weather = useWeather(coords?.lat, coords?.lon, coords != null);
  const Icon = ICONS[weather.iconName] ?? Cloud;

  return (
    <div className="relative flex min-h-[110px] w-full items-center py-4 pl-0.5 pr-4">
      {/* 위치 (패널 기준 우측 상단 고정) */}
      <div className="absolute top-2 right-4 flex items-center justify-end gap-1 whitespace-nowrap">
        <MapPin className="w-3.5 h-3.5 text-text/70 shrink-0" />
        <span className="text-[11px] sm:text-xs font-bold text-text/70 tracking-tight">
          서울, 대한민국
        </span>
      </div>

      {weather.loading ? (
        <div className="flex w-full items-center justify-center mt-6">
          <Loader2 className="h-8 w-8 animate-spin text-text/70" />
        </div>
      ) : (
        <div className="flex w-full items-center mt-3">
          {/* 날씨 아이콘 */}
          <Panel
            variant="clay"
            inset
            className="p-4 rounded-full shrink-0 flex items-center justify-center ml-0.5"
          >
            <Icon
              className="h-12 w-12 text-text/80 drop-shadow-sm"
              strokeWidth={1.5}
            />
          </Panel>

          {/* 날씨 정보 (왼쪽으로 당김) */}
          <div className="flex flex-col flex-1 ml-4 mt-2">
            {/* 현재 온도 */}
            <div className="text-[2.5rem] sm:text-4xl font-medium text-text tracking-tighter leading-none mb-2">
              {weather.temp !== null ? `${weather.temp}°` : "--"}
            </div>

            {/* 부가 정보 (습도, 체감온도) */}
            <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-bold text-text/70 whitespace-nowrap">
              <div className="flex items-center gap-1 shrink-0">
                <Droplets className="w-3.5 h-3.5 text-text/70 fill-current" />
                <span>
                  습도{" "}
                  {weather.humidity !== null ? `${weather.humidity}%` : "--"}
                </span>
              </div>
              <span className="shrink-0">
                체감{" "}
                {weather.feelsLike !== null ? `${weather.feelsLike}°C` : "--"}
              </span>
            </div>
          </div>
        </div>
      )}

      {weather.error && (
        <div className="absolute bottom-2 right-4 max-w-full truncate text-[10px] text-red-500">
          {weather.error}
        </div>
      )}
    </div>
  );
}
