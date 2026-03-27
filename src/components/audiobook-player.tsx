"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export type AudiobookPlayerTrack = {
  slug: string;
  title: string;
  durationLabel: string;
  durationSeconds: number;
  href: string;
  audioSrc: string;
  summary?: string;
};

type AudiobookPlayerProps = {
  tracks: AudiobookPlayerTrack[];
  initialSlug?: string;
  variant?: "full" | "compact";
  title: string;
  description?: string;
};

function formatPlaybackTime(totalSeconds: number): string {
  const rounded = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function AudiobookPlayer({
  tracks,
  initialSlug,
  variant = "full",
  title,
  description,
}: AudiobookPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldAutoplayRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(() => {
    const initialIndex = tracks.findIndex((track) => track.slug === initialSlug);
    return initialIndex >= 0 ? initialIndex : 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);

  const currentTrack = tracks[currentIndex];
  const hasTracks = tracks.length > 0;

  useEffect(() => {
    if (!hasTracks || !audioRef.current) return;

    audioRef.current.load();
    if (shouldAutoplayRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        })
        .finally(() => {
          shouldAutoplayRef.current = false;
        });
    }
  }, [currentIndex, hasTracks]);

  function togglePlayback() {
    if (!audioRef.current || !hasTracks) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setAudioError(null);
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        setIsPlaying(false);
      });
  }

  function goToTrack(index: number, autoplay = false) {
    if (!hasTracks) return;

    const nextIndex = (index + tracks.length) % tracks.length;
    shouldAutoplayRef.current = autoplay;
    setAudioError(null);
    setCurrentTime(0);
    setCurrentIndex(nextIndex);
  }

  function onEnded() {
    if (currentIndex < tracks.length - 1) {
      goToTrack(currentIndex + 1, true);
      return;
    }

    setIsPlaying(false);
  }

  if (!hasTracks || !currentTrack) {
    return null;
  }

  const playbackProgress = currentTrack.durationSeconds
    ? Math.min(100, (currentTime / currentTrack.durationSeconds) * 100)
    : 0;

  return (
    <section
      aria-label={title}
      className={clsx("audiobook-player", {
        "audiobook-player--compact": variant === "compact",
      })}
    >
      <div className="audiobook-player__top">
        <div className="audiobook-player__copy">
          <span className="eyebrow">Ljudbok</span>
          <h2>{title}</h2>
          {description ? (
            <p className="section-copy audiobook-player__description">
              {description}
            </p>
          ) : null}
        </div>

        <div className="audiobook-player__meta">
          <span>{currentTrack.durationLabel}</span>
          <span>{currentIndex + 1} / {tracks.length}</span>
        </div>
      </div>

      <div className="audiobook-player__current">
        <div>
          <p className="audiobook-player__track-label">Spelar nu</p>
          <h3>{currentTrack.title}</h3>
          {currentTrack.summary ? (
            <p className="section-copy">{currentTrack.summary}</p>
          ) : null}
        </div>

        <div className="audiobook-player__actions">
          <button
            aria-label="Föregående kapitel"
            aria-pressed={false}
            className="audiobook-player__button audiobook-player__button--ghost"
            onClick={() => goToTrack(currentIndex - 1, isPlaying)}
            type="button"
          >
            Föregående
          </button>
          <button
            aria-label={isPlaying ? "Pausa uppläsning" : "Spela uppläsning"}
            aria-pressed={isPlaying}
            className="audiobook-player__button audiobook-player__button--primary"
            onClick={togglePlayback}
            type="button"
          >
            {isPlaying ? "Pausa" : "Spela"}
          </button>
          <button
            aria-label="Nästa kapitel"
            aria-pressed={false}
            className="audiobook-player__button audiobook-player__button--ghost"
            onClick={() => goToTrack(currentIndex + 1, isPlaying)}
            type="button"
          >
            Nästa
          </button>
        </div>
      </div>

      <div className="audiobook-player__progress" aria-hidden="true">
        <div
          className="audiobook-player__progress-fill"
          style={{ width: `${playbackProgress}%` }}
        />
      </div>
      <div className="audiobook-player__timing">
        <span>{formatPlaybackTime(currentTime)}</span>
        <span>{currentTrack.durationLabel}</span>
      </div>

      <audio
        className="audiobook-player__native"
        controls
        onEnded={onEnded}
        onError={() => {
          setAudioError("Det gick inte att läsa in ljudspåret. Prova att ladda om sidan.");
          setIsPlaying(false);
        }}
        onLoadedMetadata={(event) => {
          if (event.currentTarget.currentTime === 0) {
            setCurrentTime(0);
          }
        }}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        preload="metadata"
        ref={audioRef}
      >
        <source src={currentTrack.audioSrc} type="audio/mp4" />
      </audio>
      {audioError ? (
        <p className="section-copy audiobook-player__error" role="status">
          {audioError}
        </p>
      ) : null}

      {variant === "full" ? (
        <ol className="audiobook-player__playlist">
          {tracks.map((track, index) => (
            <li key={track.slug}>
              <button
                aria-current={index === currentIndex ? "true" : undefined}
                className={clsx("audiobook-player__playlist-item", {
                  "audiobook-player__playlist-item--active":
                    index === currentIndex,
                })}
                onClick={() => goToTrack(index, isPlaying)}
                type="button"
              >
                <span className="audiobook-player__playlist-order">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="audiobook-player__playlist-copy">
                  <strong>{track.title}</strong>
                  {track.summary ? <span>{track.summary}</span> : null}
                </span>
                <span className="audiobook-player__playlist-meta">
                  {track.durationLabel}
                </span>
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <div className="audiobook-player__compact-footer">
          <a className="site-header__link" href={currentTrack.href}>
            Läs kapitlet
          </a>
          <Link className="site-header__link" href="/#ljudbok">
            Öppna ljudboken
          </Link>
        </div>
      )}
    </section>
  );
}
