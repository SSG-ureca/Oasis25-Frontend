export interface Weather {
  condition: string;
  temperature: number;
}

function wmoCodeToCondition(code: number): string {
  if (code === 0 || code === 1) return "CLEAR";
  if (code === 2 || code === 3) return "CLOUDY";
  if (code >= 51 && code <= 67) return "RAIN";
  if (code >= 71 && code <= 77) return "SNOW";
  if (code >= 95) return "THUNDERSTORM";
  if (code >= 45 && code <= 48) return "FOG";
  return "ETC";
}

export async function fetchCurrentWeather(): Promise<Weather | null> {
  if (!navigator.geolocation) return null;

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
    });

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const current = data.current_weather;
    if (!current) return null;

    return {
      condition: wmoCodeToCondition(Number(current.weathercode)),
      temperature: Number(current.temperature),
    };
  } catch {
    return null;
  }
}
