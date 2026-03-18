"use client";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  MusicNoteSimple,
  SpeakerSimpleHigh,
  SpeakerSimpleSlash,
  SkipBack,
  SkipForward,
  MicrophoneStage,
} from "phosphor-react";

const TRACKS = [
  { name: "A Horse With No Name", artist: "America", album: "America" },
  { name: "Bat Country", artist: "Avenged Sevenfold", album: "City of Evil" },
  {
    name: "Afterlife",
    artist: "Avenged Sevenfold",
    album: "Avenged Sevenfold",
  },
  { name: "Nightmare", artist: "Avenged Sevenfold", album: "Nightmare" },
  {
    name: "Unholy Confessions",
    artist: "Avenged Sevenfold",
    album: "Waking the Fallen",
  },
  {
    name: "Hail to the King",
    artist: "Avenged Sevenfold",
    album: "Hail to the King",
  },
  {
    name: "A Little Piece of Heaven",
    artist: "Avenged Sevenfold",
    album: "Avenged Sevenfold",
  },
  {
    name: "Gunslinger",
    artist: "Avenged Sevenfold",
    album: "Avenged Sevenfold",
  },
  { name: "Acid Rain", artist: "Avenged Sevenfold", album: "Hail to the King" },
  { name: "Chop Suey!", artist: "System Of A Down", album: "Toxicity" },
  { name: "Lonely Day", artist: "System Of A Down", album: "Hypnotize" },
  { name: "B.Y.O.B.", artist: "System Of A Down", album: "Mezmerize" },
  { name: "Toxicity", artist: "System Of A Down", album: "Toxicity" },
  { name: "Aerials", artist: "System Of A Down", album: "Toxicity" },
  { name: "Black", artist: "Pearl Jam", album: "Ten" },
  { name: "Even Flow", artist: "Pearl Jam", album: "Ten" },
  { name: "Jeremy", artist: "Pearl Jam", album: "Ten" },
  { name: "Better Man", artist: "Pearl Jam", album: "Vitalogy" },
  { name: "In the End", artist: "Linkin Park", album: "Hybrid Theory" },
  { name: "Numb", artist: "Linkin Park", album: "Meteora" },
  { name: "Crawling", artist: "Linkin Park", album: "Hybrid Theory" },
  { name: "Breaking the Habit", artist: "Linkin Park", album: "Meteora" },
  { name: "Somewhere I Belong", artist: "Linkin Park", album: "Meteora" },
  { name: "Faint", artist: "Linkin Park", album: "Meteora" },
  { name: "New Divide", artist: "Linkin Park", album: "New Divide" },
  {
    name: "Duality",
    artist: "Slipknot",
    album: "Vol. 3: The Subliminal Verses",
  },
  { name: "Psychosocial", artist: "Slipknot", album: "All Hope Is Gone" },
  {
    name: "Before I Forget",
    artist: "Slipknot",
    album: "Vol. 3: The Subliminal Verses",
  },
  { name: "Nero Forte", artist: "Slipknot", album: "We Are Not Your Kind" },
  {
    name: "I Hate Everything About You",
    artist: "Three Days Grace",
    album: "Three Days Grace",
  },
  { name: "Animal I Have Become", artist: "Three Days Grace", album: "One-X" },
  { name: "Like a Stone", artist: "Audioslave", album: "Audioslave" },
  { name: "Cochise", artist: "Audioslave", album: "Audioslave" },
  { name: "One Last Breath", artist: "Creed", album: "Weathered" },
  { name: "Enter Sandman", artist: "Metallica", album: "Metallica" },
  { name: "Nothing Else Matters", artist: "Metallica", album: "Metallica" },
  {
    name: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    album: "Appetite for Destruction",
  },
  { name: "Carry On", artist: "Angra", album: "Angels Cry" },
  { name: "Rebirth", artist: "Angra", album: "Rebirth" },
  { name: "Sparks", artist: "Coldplay", album: "Parachutes" },
  {
    name: "United In Grief",
    artist: "Kendrick Lamar",
    album: "Mr. Morale & The Big Steppers",
  },
  {
    name: "The Less I Know the Better",
    artist: "Tame Impala",
    album: "Currents",
  },
  { name: "Eventually", artist: "Tame Impala", album: "Currents" },
  { name: "Let It Happen", artist: "Tame Impala", album: "Currents" },
  { name: "Elephant", artist: "Tame Impala", album: "Lonerism" },
  {
    name: "Feels Like We Only Go Backwards",
    artist: "Tame Impala",
    album: "Lonerism",
  },
  { name: "Coqueta", artist: "Grupo Frontera", album: "Coqueta" },
  { name: "That's My Way", artist: "Edi Rock", album: "Edi Rock" },
];

type TrackData = { art: string; preview: string | null; duration: number };
const cache: Record<string, TrackData> = {};
const lyricsCache: Record<string, string | null> = {};

async function fetchTrackData(
  artist: string,
  name: string,
): Promise<TrackData> {
  const key = `${artist}::${name}`;
  if (cache[key]) return cache[key];
  try {
    const q = encodeURIComponent(`${name} ${artist}`);
    const res = await fetch(
      `https://itunes.apple.com/search?term=${q}&entity=song&limit=1`,
    );
    const data = await res.json();
    const r = data.results?.[0];
    const result: TrackData = {
      art: r?.artworkUrl100?.replace("100x100bb", "600x600bb") ?? "",
      preview: r?.previewUrl ?? null,
      duration: r?.trackTimeMillis ?? 210000,
    };
    cache[key] = result;
    return result;
  } catch {
    return { art: "", preview: null, duration: 210000 };
  }
}

async function fetchLyrics(
  artist: string,
  title: string,
): Promise<string | null> {
  const key = `${artist}::${title}`;
  if (key in lyricsCache) return lyricsCache[key];
  try {
    const res = await fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`,
    );
    if (!res.ok) {
      lyricsCache[key] = null;
      return null;
    }
    const data = await res.json();
    lyricsCache[key] = data.lyrics ?? null;
    return lyricsCache[key];
  } catch {
    lyricsCache[key] = null;
    return null;
  }
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${pad(s % 60)}`;
}

function usePlayer() {
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState<TrackData>({
    art: "",
    preview: null,
    duration: 210000,
  });
  const rafRef = useRef<number>(0);
  const baseTime = useRef<number | null>(null);
  const durRef = useRef<number>(210000);

  useEffect(() => {
    let cancelled = false;
    durRef.current = 210000;
    const t = TRACKS[idx];
    fetchTrackData(t.artist, t.name).then((d) => {
      if (cancelled) return;
      setData(d);
      durRef.current = d.duration;
    });
    return () => {
      cancelled = true;
    };
  }, [idx]);

  useEffect(() => {
    baseTime.current = null;
    cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      if (baseTime.current === null) {
        baseTime.current = now;
        setProgress(0);
      }
      const elapsed = now - baseTime.current;
      if (elapsed >= durRef.current) {
        setIdx((i) => (i + 1) % TRACKS.length);
        return;
      }
      setProgress(elapsed);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [idx]);

  const next = useCallback(() => setIdx((i) => (i + 1) % TRACKS.length), []);
  const prev = useCallback(
    () => setIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length),
    [],
  );

  return {
    track: TRACKS[idx],
    progress,
    duration: data.duration,
    art: data.art,
    preview: data.preview,
    next,
    prev,
  };
}

export default function SpotifyBadge() {
  const { track, progress, duration, art, preview, next, prev } = usePlayer();
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [lyrics, setLyrics] = useState<string | null | "loading">(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const lyricsLines = useMemo(
    () =>
      typeof lyrics === "string"
        ? lyrics.split("\n").filter((l) => l.trim().length > 0)
        : [],
    [lyrics],
  );

  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    let raf: number;
    if (!lyricsLines.length || !open) {
      raf = requestAnimationFrame(() => setCurrentLine(0));
      return () => cancelAnimationFrame(raf);
    }
    const update = () => {
      if (
        audioRef.current &&
        !audioRef.current.paused &&
        audioRef.current.currentTime
      ) {
        const pct = audioRef.current.currentTime / (duration / 1000);
        const idx = Math.min(
          Math.floor(pct * lyricsLines.length),
          lyricsLines.length - 1,
        );
        setCurrentLine(idx);
      } else {
        const pct = duration > 0 ? Math.min(progress / duration, 1) : 0;
        const idx = Math.min(
          Math.floor(pct * lyricsLines.length),
          lyricsLines.length - 1,
        );
        setCurrentLine(idx);
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [lyricsLines, open, duration, progress]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setLyrics(null));
    return () => cancelAnimationFrame(raf);
  }, [track]);

  useEffect(() => {
    if (!open || lyrics !== null) return;

    const raf = requestAnimationFrame(() => setLyrics("loading"));
    fetchLyrics(track.artist, track.name).then((l) => setLyrics(l));
    return () => cancelAnimationFrame(raf);
  }, [open, track, lyrics]);

  useEffect(() => {
    if (!open || !preview) {
      audioRef.current?.pause();
      return;
    }
    const audio = new Audio(preview);
    audio.volume = muted ? 0 : 0.12;
    audio.loop = true;
    audio.play().catch(() => {});
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [open, preview, muted]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : 0.12;
  }, [muted]);

  const pct = duration > 0 ? Math.min((progress / duration) * 100, 100) : 0;

  return (
    <>
      <div className={`spb${open ? " spb-open" : ""}`}>
        <div className="spb-pill" onClick={() => setOpen(true)}>
          <div className="spb-thumb">
            {art ? (
              <Image
                src={art}
                alt=""
                fill
                sizes="24px"
                style={{ objectFit: "cover", borderRadius: "50%" }}
                unoptimized
              />
            ) : (
              <div className="spb-thumb-ph">♪</div>
            )}
          </div>

          <div className="spb-pill-text">
            <span className="spb-pill-name">{track.name}</span>
            <span className="spb-pill-artist">{track.artist}</span>
          </div>
          <span className="spb-bars">
            <span />
            <span />
            <span />
          </span>
        </div>

        <div className="spb-card">
          <button className="spb-close" onClick={() => setOpen(false)}>
            ✕
          </button>

          <div className="spb-art-wrap">
            {art && (
              <div className="spb-art-bg">
                <Image
                  src={art}
                  alt=""
                  fill
                  sizes="290px"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
            )}
            <div className="spb-overlay" />
            <div className="spb-disc">
              {art ? (
                <Image
                  src={art}
                  alt={track.album}
                  fill
                  sizes="192px"
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                  unoptimized
                />
              ) : (
                <div className="spb-disc-ph" />
              )}
            </div>
            <div className="spb-hole" />
          </div>

          <div className="spb-track-info">
            <div className="spb-track">{track.name}</div>
            <div className="spb-meta">
              {track.artist} · {track.album}
            </div>
          </div>

          <div className="spb-prog-area">
            <div className="spb-prog-bar">
              <div className="spb-prog-fill" style={{ width: `${pct}%` }} />
              <div className="spb-prog-thumb" style={{ left: `${pct}%` }} />
            </div>
            <div className="spb-times">
              <span>{fmt(progress)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>

          <div className="spb-controls">
            <button
              className={`spb-ico${muted ? "" : " on"}`}
              onClick={() => setMuted((m) => !m)}
            >
              {muted ? (
                <SpeakerSimpleSlash size={17} weight="fill" />
              ) : (
                <SpeakerSimpleHigh size={17} weight="fill" />
              )}
            </button>
            <div className="spb-navs">
              <button className="spb-nav" onClick={prev}>
                <SkipBack size={13} weight="fill" />
              </button>
              <button className="spb-nav" onClick={next}>
                <SkipForward size={13} weight="fill" />
              </button>
            </div>
            <button className="spb-ico on" style={{ cursor: "default" }}>
              <MusicNoteSimple size={16} weight="fill" />
            </button>
          </div>

          <div className="spb-divider" />

          <div className="spb-lyric-area">
            {lyrics === "loading" ? (
              <div className="spb-lyric-loading">
                <span />
                <span />
                <span />
              </div>
            ) : lyricsLines.length > 0 ? (
              <div className="spb-lyric-line" key={currentLine}>
                {lyricsLines[currentLine]}
              </div>
            ) : (
              <div className="spb-lyric-unavail">
                <MicrophoneStage
                  size={18}
                  style={{ opacity: 0.25, marginBottom: 4 }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
