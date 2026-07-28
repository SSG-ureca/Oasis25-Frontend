import { useCallback, useEffect, useRef, useState } from "react";
import {
  Music,
  Pause,
  Play as PlayIcon,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "./Button";
import { Panel } from "./Panel";
import { BGM_LIST } from "../../types/music";
import { loadMusicSetting } from "../../utils/musicStorage";

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // 저장된 음악 설정 불러오기

  const [tracks] = useState(() => {
    const setting = loadMusicSetting();

    return setting.bgmOrder
      .filter((id) => !setting.excludedBgm.includes(id))
      .map((id) => BGM_LIST.find((bgm) => bgm.id === id))
      .filter((bgm): bgm is (typeof BGM_LIST)[number] => bgm !== undefined);
  });

  const currentTrack = tracks[currentIndex] ?? null;

  const handleNext = useCallback(() => {
    if (tracks.length === 0) return;

    setCurrentIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  }, [tracks.length]);

  const handlePrev = useCallback(() => {
    if (tracks.length === 0) return;

    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  }, [tracks.length]);

  const togglePlay = useCallback(() => {
    if (tracks.length === 0) return;

    setIsPlaying((prev) => !prev);
  }, [tracks.length]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(prevVolume || 0.8);
      setIsMuted(false);
    } else {
      setPrevVolume(volume > 0 ? volume : 0.8);
      setVolume(0);
      setIsMuted(true);
    }
  }, [isMuted, prevVolume, volume]);

  // 볼륨
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  // 트랙 변경 및 재생
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentTrack) return;

    const nextSrc = currentTrack.path;
    const expectedSrc = new URL(nextSrc, window.location.href).href;

    if (audio.src !== expectedSrc) {
      audio.src = nextSrc;
      audio.load();
    }

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  return (
    <Panel
      variant="clay"
      className="flex w-full items-center justify-between gap-6 p-4">
      <audio ref={audioRef} preload="metadata" onEnded={handleNext} />

      {/* 곡 정보 */}
      <div className="hidden 680:flex flex-1 min-w-0 items-center gap-4">
        <Panel
          variant="clay"
          inset
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <Music className="h-6 w-6 text-primary" />
        </Panel>

        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-text truncate">
            {currentTrack?.name ?? "재생 가능한 음악 없음"}
          </span>
          <span className="text-sm text-text-muted truncate">
            {currentTrack ? "local mp3" : ""}
          </span>
        </div>
      </div>

      {/* 재생 컨트롤 */}
      <div className="flex items-center justify-center gap-3 shrink-0">
        <Button
          variant="clay"
          className="h-10 w-10 rounded-full"
          onClick={handlePrev}
          disabled={tracks.length === 0}>
          <SkipBack className="h-5 w-5 text-text" />
        </Button>

        <Button
          variant="clay"
          className={`h-12 w-12 rounded-full ${
            isPlaying ? "text-primary" : "text-text"
          }`}
          onClick={togglePlay}
          disabled={tracks.length === 0}>
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <PlayIcon className="h-6 w-6" />
          )}
        </Button>

        <Button
          variant="clay"
          className="h-10 w-10 rounded-full"
          onClick={handleNext}
          disabled={tracks.length === 0}>
          <SkipForward className="h-5 w-5 text-text" />
        </Button>
      </div>

      {/* 볼륨 */}
      <div className="flex items-center justify-end gap-3 pr-4 680:flex-1">
        <button
          type="button"
          onClick={toggleMute}
          className="cursor-pointer border-none bg-transparent p-0 focus:outline-none"
          aria-label={isMuted ? "Unmute" : "Mute"}>
          {isMuted || volume === 0 ? (
            <VolumeX className="h-5 w-5 text-text-muted" />
          ) : (
            <Volume2 className="h-5 w-5 text-text-muted" />
          )}
        </button>

        <Panel
          variant="clay"
          inset
          className="relative w-28 rounded-full py-1 px-3 680:w-40">
          <div className="relative h-1.5 w-full">
            <div
              className="pointer-events-none absolute left-0 top-0 h-1.5 rounded-full bg-primary"
              style={{
                width: `${volume * 100}%`,
              }}
            />
          </div>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => {
              const next = Number(e.target.value);
              setVolume(next);

              if (next > 0) {
                setIsMuted(false);
              }
            }}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </Panel>
      </div>
    </Panel>
  );
};
