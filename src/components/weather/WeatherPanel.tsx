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
  Thermometer,
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
    <div className="flex h-full w-full flex-col justify-between p-1">
      <div className="text-sm font-medium text-text-muted">서울, 대한민국</div>
      <div className="flex items-center justify-between p-2">
        {weather.loading ? (
          <Loader2 className="h-10 w-10 animate-spin text-text-muted" />
        ) : (
          <>
            <Panel variant="clay" inset className="p-2 rounded-full">
              <Icon className="h-14 w-14 " />
            </Panel>

            <div className="text-3xl font-bold ">
              {weather.temp !== null ? `${weather.temp}°` : "--"}
              <span className="text-sm text-text-muted">{weather.skyText}</span>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-between p-2 text-xs text-text-muted">
        <div className="flex items-center">
          <Droplets className="h-4 w-4" />
          <span>
            습도 {weather.humidity !== null ? `${weather.humidity}%` : "--"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Thermometer className="h-4 w-4" />
          <span>
            체감 {weather.feelsLike !== null ? `${weather.feelsLike}°` : "--"}
          </span>
        </div>
      </div>
      {weather.error && (
        <div className="max-w-full truncate text-xs text-red-500">
          {weather.error}
        </div>
      )}
    </div>
  );
}
