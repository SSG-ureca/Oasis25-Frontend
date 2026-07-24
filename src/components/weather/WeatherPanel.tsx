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
  const [coords, setCoords] = useState({ lat: 37.5665, lon: 126.978 });

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {},
      { timeout: 8000 },
    );
  }, []);

  const weather = useWeather(coords.lat, coords.lon);
  const Icon = ICONS[weather.iconName] ?? Cloud;

  return (
    <div className="flex h-full w-full flex-col justify-between p-1">
      <div className="text-sm font-medium text-slate-500">서울, 대한민국</div>
      <div className="flex items-center justify-between p-2">
        {weather.loading ? (
          <Loader2 className="h-10 w-10 animate-spin text-slate-500" />
        ) : (
          <>
            <Panel variant="clay" inset className="p-2 rounded-full">
              <Icon className="h-14 w-14 text-slate-700" />
            </Panel>

            <div className="text-3xl font-bold text-slate-800">
              {weather.temp !== null ? `${weather.temp}°` : "--"}
              <span className="text-sm text-slate-600">{weather.skyText}</span>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-between p-2 text-xs text-slate-600">
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
