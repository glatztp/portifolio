"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  SpeakerSimpleHigh,
  SpeakerSimpleSlash,
  SkipBack,
  SkipForward,
  MicrophoneStage,
  Shuffle,
  Repeat,
  Queue,
  X,
  MagnifyingGlass,
  Play,
  Pause,
} from "phosphor-react";
import styles from "../../app/SpotifyBadge.module.css";

const TRACKS = [
  { name: "A Horse With No Name", artist: "America", album: "America" },
  { name: "Bat Country", artist: "Avenged Sevenfold", album: "City of Evil" },
  { name: "Afterlife", artist: "Avenged Sevenfold", album: "Avenged Sevenfold" },
  { name: "Nightmare", artist: "Avenged Sevenfold", album: "Nightmare" },
  { name: "Unholy Confessions", artist: "Avenged Sevenfold", album: "Waking the Fallen" },
  { name: "Hail to the King", artist: "Avenged Sevenfold", album: "Hail to the King" },
  { name: "Gunslinger", artist: "Avenged Sevenfold", album: "Avenged Sevenfold" },
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
  { name: "Duality", artist: "Slipknot", album: "Vol. 3: The Subliminal Verses" },
  { name: "Psychosocial", artist: "Slipknot", album: "All Hope Is Gone" },
  { name: "Before I Forget", artist: "Slipknot", album: "Vol. 3: The Subliminal Verses" },
  { name: "Nero Forte", artist: "Slipknot", album: "We Are Not Your Kind" },
  { name: "I Hate Everything About You", artist: "Three Days Grace", album: "Three Days Grace" },
  { name: "Animal I Have Become", artist: "Three Days Grace", album: "One-X" },
  { name: "Like a Stone", artist: "Audioslave", album: "Audioslave" },
  { name: "Cochise", artist: "Audioslave", album: "Audioslave" },
  { name: "One Last Breath", artist: "Creed", album: "Weathered" },
  { name: "Enter Sandman", artist: "Metallica", album: "Metallica" },
  { name: "Nothing Else Matters", artist: "Metallica", album: "Metallica" },
  { name: "Sweet Child O' Mine", artist: "Guns N' Roses", album: "Appetite for Destruction" },
  { name: "Carry On", artist: "Angra", album: "Angels Cry" },
  { name: "Rebirth", artist: "Angra", album: "Rebirth" },
  { name: "Sparks", artist: "Coldplay", album: "Parachutes" },
  { name: "United In Grief", artist: "Kendrick Lamar", album: "Mr. Morale & The Big Steppers" },
  { name: "The Less I Know the Better", artist: "Tame Impala", album: "Currents" },
  { name: "Eventually", artist: "Tame Impala", album: "Currents" },
  { name: "Let It Happen", artist: "Tame Impala", album: "Currents" },
  { name: "Elephant", artist: "Tame Impala", album: "Lonerism" },
  { name: "Feels Like We Only Go Backwards", artist: "Tame Impala", album: "Lonerism" },
  { name: "Coqueta", artist: "Grupo Frontera", album: "Coqueta" },
  { name: "Guardanapo", artist: "Rainha Musical, Maicon Vargas", album: "Guardanapo" },
  { name: "Do Luxo Pro Lixo", artist: "Rainha Musical", album: "É Bailão Meu Fio!" },
  { name: "A Lua e a Noite", artist: "Brilha Som", album: "Volume 10 - Sou Latino-americano" },
  { name: "Grito de Liberdade", artist: "Grupo Rodeio", album: "Os 16 Grandes Sucessos de Grupo Rodeio" },
  { name: "Tranco Véio Fandangueiro", artist: "Grupo Portal Gaucho", album: "O Tranco Véio Continua" },
  { name: "Ele Te Trai - Ao Vivo", artist: "Banda San Marino", album: "San Marino Ao Vivo na Argentina" },
  { name: "O Pedreiro", artist: "Rainha Musical", album: "É Bailão Meu Fio!" },
  { name: "Querida Amiga", artist: "Brilha Som", album: "Volume 10 - Sou Latino-americano" },
  { name: "Vaza", artist: "Banda San Marino", album: "Tô Melhor Agora" },
  { name: "O Casamento da Doralicia - Ao Vivo", artist: "Grupo Minuano", album: "Vaneira (Ao Vivo)" },
  { name: "Morena", artist: "JUSV Juliana e Juliano", album: "Morena" },
  { name: "Vou Pra Santa Catarina", artist: "Terceira Dimensão", album: "O Melhor do Terceira Dimensão, Vol. 1" },
  { name: "Menino Campeiro", artist: "Paulinho Mocelin", album: "Menino Campeiro" },
];

type TrackData = { art: string; preview: string | null; duration: number };
type Mode = "mini" | "player" | "queue";
type RepeatMode = "none" | "all" | "one";

const trackCache: Record<string, TrackData> = {};
const lyricsCache: Record<string, string | null> = {};

async function fetchTrackData(artist: string, name: string): Promise<TrackData> {
  const key = `${artist}::${name}`;
  if (trackCache[key]) return trackCache[key];
  try {
    const q = encodeURIComponent(`${name} ${artist}`);
    const res = await fetch(`https://itunes.apple.com/search?term=${q}&entity=song&limit=1`);
    const data = await res.json();
    const r = data.results?.[0];
    const result: TrackData = {
      art: r?.artworkUrl100?.replace("100x100bb", "600x600bb") ?? "",
      preview: r?.previewUrl ?? null,
      duration: 30000,
    };
    trackCache[key] = result;
    return result;
  } catch {
    return { art: "", preview: null, duration: 30000 };
  }
}

async function fetchLyrics(artist: string, title: string): Promise<string | null> {
  const key = `${artist}::${title}`;
  if (key in lyricsCache) return lyricsCache[key];
  try {
    const res = await fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
    );
    if (!res.ok) { lyricsCache[key] = null; return null; }
    const data = await res.json();
    lyricsCache[key] = data.lyrics ?? null;
    return lyricsCache[key];
  } catch {
    lyricsCache[key] = null;
    return null;
  }
}

function pad(n: number) { return n.toString().padStart(2, "0"); }
function fmt(ms: number) { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${pad(s % 60)}`; }

function usePlayer() {
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState<TrackData>({ art: "", preview: null, duration: 30000 });
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("none");

  const rafRef = useRef<number>(0);
  const baseTime = useRef<number | null>(null);
  const durRef = useRef<number>(30000);
  const idxRef = useRef(idx);
  const shuffleRef = useRef(shuffle);
  const repeatRef = useRef(repeat);

  useEffect(() => { idxRef.current = idx; }, [idx]);
  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);
  useEffect(() => { repeatRef.current = repeat; }, [repeat]);

  useEffect(() => {
    let cancelled = false;
    durRef.current = 30000;
    fetchTrackData(TRACKS[idx].artist, TRACKS[idx].name).then((d) => {
      if (cancelled) return;
      setData(d);
      durRef.current = 30000;
    });
    return () => { cancelled = true; };
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
        if (repeatRef.current === "one") {
          baseTime.current = now;
          setProgress(0);
          rafRef.current = requestAnimationFrame(tick);
        } else if (shuffleRef.current) {
          let next;
          do { next = Math.floor(Math.random() * TRACKS.length); }
          while (next === idxRef.current && TRACKS.length > 1);
          setIdx(next);
        } else {
          setIdx((i) => (i + 1) % TRACKS.length);
        }
        return;
      }
      setProgress(elapsed);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [idx]);

  const next = useCallback(() => {
    if (shuffleRef.current) {
      let n;
      do { n = Math.floor(Math.random() * TRACKS.length); }
      while (n === idxRef.current && TRACKS.length > 1);
      setIdx(n);
    } else {
      setIdx((i) => (i + 1) % TRACKS.length);
    }
  }, []);

  const prev = useCallback(() => setIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length), []);

  const seek = useCallback((pct: number) => {
    const newElapsed = Math.max(0, Math.min(1, pct)) * durRef.current;
    baseTime.current = performance.now() - newElapsed;
    setProgress(newElapsed);
  }, []);

  const playIdx = useCallback((i: number) => setIdx(i), []);

  return {
    track: TRACKS[idx], idx,
    progress, duration: data.duration,
    art: data.art, preview: data.preview,
    next, prev, seek, playIdx,
    shuffle, setShuffle,
    repeat, setRepeat,
  };
}

export default function SpotifyBadge() {
  const player = usePlayer();
  const [mode, setMode] = useState<Mode>("mini");
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [pos, setPos] = useState(() => ({ x: 24, y: 24 }));
  const [search, setSearch] = useState("");
  const [lyrics, setLyrics] = useState<string | null | "loading">(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dragState = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0 });
  const wasDragged = useRef(false);
  const prevTrackRef = useRef<{ artist: string; name: string } | null>(null);


  const onPointerDown = useCallback((e: React.PointerEvent) => {
    wasDragged.current = false;
    dragState.current = { active: true, sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }, [pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current.active) return;
    const dx = e.clientX - dragState.current.sx;
    const dy = e.clientY - dragState.current.sy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      wasDragged.current = true;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 56, dragState.current.ox + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 56, dragState.current.oy + dy)),
      });
    }
  }, []);

  const onPointerUp = useCallback(() => { dragState.current.active = false; }, []);

  useEffect(() => {
    if (!player.preview || !isPlaying) {
      audioRef.current?.pause();
      return;
    }
    const audio = new Audio(player.preview);
    audio.volume = muted ? 0 : 0.12;
    audio.play().catch(() => { });
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, [player.preview, muted, isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : 0.12;
  }, [muted]);

  useEffect(() => {
    if (mode !== "player") {
      prevTrackRef.current = null;
      return;
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== "player") return;
    const trackKey = `${player.track.artist}::${player.track.name}`;
    if (prevTrackRef.current?.artist === player.track.artist && prevTrackRef.current?.name === player.track.name) {
      return;
    }
    prevTrackRef.current = player.track;
    const cached = lyricsCache[trackKey];
    if (cached !== undefined) {
      queueMicrotask(() => setLyrics(cached));
    } else {
      fetchLyrics(player.track.artist, player.track.name).then(setLyrics);
    }
  }, [mode, player.track]);

  const lyricsLines = useMemo(
    () => typeof lyrics === "string" ? lyrics.split("\n").filter((l) => l.trim()) : [],
    [lyrics]
  );

  const currentLine = useMemo(() => {
    if (!lyricsLines.length) return 0;
    const lineInterval = 1900;
    const lineIndex = Math.floor(player.progress / lineInterval);
    return Math.min(lineIndex, lyricsLines.length - 1);
  }, [player.progress, lyricsLines]);

  const pct = player.duration > 0 ? Math.min((player.progress / player.duration) * 100, 100) : 0;

  const filteredTracks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TRACKS.map((t, i) => ({ ...t, i })).filter(
      (t) => !q || t.name.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
    );
  }, [search]);

  const handleMiniClick = () => { if (!wasDragged.current) setMode("player"); };

  return (
    <div className={styles.root} style={{ left: pos.x, top: pos.y }}>

      {mode === "mini" && (
        <div
          className={styles.mini}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClick={handleMiniClick}
        >
          <div className={styles.miniArt}>
            {player.art && (
              <Image src={player.art} alt="" fill sizes="36px" style={{ objectFit: "cover" }} unoptimized />
            )}
          </div>
          <div className={styles.miniInfo}>
            <span className={styles.miniName}>{player.track.name}</span>
            <span className={styles.miniArtist}>{player.track.artist}</span>
          </div>
          <div className={styles.miniBars}>
            <span /><span /><span />
          </div>
          <button
            className={styles.miniPauseBtn}
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
          </button>
          <div className={styles.miniProg} style={{ width: `${pct}%` }} />
        </div>
      )}

      {(mode === "player" || mode === "queue") && (
        <div className={styles.card}>
          <div
            className={styles.dragHandle}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <div className={styles.dragDots}>
              {Array.from({ length: 6 }).map((_, i) => <span key={i} />)}
            </div>
            <div className={styles.headerActions}>
              <button
                className={`${styles.hBtn}${mode === "queue" ? ` ${styles.hBtnActive}` : ""}`}
                onClick={() => setMode(mode === "queue" ? "player" : "queue")}
                onPointerDown={(e) => e.stopPropagation()}
                title="Queue"
              >
                <Queue size={14} weight="bold" />
              </button>
              <button
                className={styles.hBtn}
                onClick={() => setMode("mini")}
                onPointerDown={(e) => e.stopPropagation()}
                title="Minimize"
              >
                <X size={14} weight="bold" />
              </button>
            </div>
          </div>

          {mode === "player" && (
            <>
              <div className={styles.artSection}>
                {player.art && (
                  <div className={styles.artBg}>
                    <Image src={player.art} alt="" fill sizes="290px" style={{ objectFit: "cover" }} unoptimized />
                  </div>
                )}
                <div className={styles.artOverlay} />
                <div className={styles.discWrap}>
                  <div className={styles.disc}>
                    {player.art && (
                      <Image
                        src={player.art}
                        alt={player.track.album}
                        fill
                        sizes="118px"
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    )}
                  </div>
                  <div className={styles.discHole} />
                </div>
              </div>

              <div className={styles.trackSection}>
                <div className={styles.trackName}>{player.track.name}</div>
                <div className={styles.trackMeta}>{player.track.artist} · {player.track.album}</div>
              </div>

              <div className={styles.progressSection}>
                <div
                  className={styles.progBar}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    player.seek((e.clientX - rect.left) / rect.width);
                  }}
                >
                  <div className={styles.progFill} style={{ width: `${pct}%` }} />
                  <div className={styles.progDot} style={{ left: `${pct}%` }} />
                </div>
                <div className={styles.times}>
                  <span>{fmt(player.progress)}</span>
                  <span>{fmt(player.duration)}</span>
                </div>
              </div>

              <div className={styles.controlsSection}>
                <button
                  className={`${styles.ctrlBtn}${player.shuffle ? ` ${styles.ctrlActive}` : ""}`}
                  onClick={() => player.setShuffle((s) => !s)}
                  title="Shuffle"
                >
                  <Shuffle size={15} weight="bold" />
                </button>
                <button className={`${styles.ctrlBtn} ${styles.ctrlNav}`} onClick={player.prev} title="Previous">
                  <SkipBack size={17} weight="fill" />
                </button>
                <button
                  className={`${styles.ctrlBtn} ${styles.ctrlNav}${isPlaying ? ` ${styles.ctrlActive}` : ""}`}
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={17} weight="fill" /> : <Play size={17} weight="fill" />}
                </button>
                <button className={`${styles.ctrlBtn} ${styles.ctrlNav}`} onClick={player.next} title="Next">
                  <SkipForward size={17} weight="fill" />
                </button>
                <button
                  className={`${styles.ctrlBtn}${player.repeat !== "none" ? ` ${styles.ctrlActive}` : ""}`}
                  onClick={() =>
                    player.setRepeat((r) => (r === "none" ? "all" : r === "all" ? "one" : "none"))
                  }
                  title="Repeat"
                >
                  <Repeat size={15} weight="bold" />
                  {player.repeat === "one" && <span className={styles.repeatBadge}>1</span>}
                </button>
                <button
                  className={`${styles.ctrlBtn}${!muted ? ` ${styles.ctrlActive}` : ""}`}
                  onClick={() => setMuted((m) => !m)}
                  title={muted ? "Unmute" : "Mute"}
                >
                  {muted
                    ? <SpeakerSimpleSlash size={15} weight="fill" />
                    : <SpeakerSimpleHigh size={15} weight="fill" />
                  }
                </button>
              </div>

              <div className={styles.divider} />

              <div className={styles.lyricsSection}>
                {lyrics === "loading" ? (
                  <div className={styles.lyricDots}><span /><span /><span /></div>
                ) : lyricsLines.length > 0 ? (
                  <div className={styles.lyricLine} key={currentLine}>{lyricsLines[currentLine]}</div>
                ) : (
                  <div className={styles.lyricEmpty}><MicrophoneStage size={18} /></div>
                )}
              </div>
            </>
          )}

          {mode === "queue" && (
            <div className={styles.queueSection}>
              <div className={styles.queueSearch}>
                <MagnifyingGlass size={14} />
                <input
                  type="text"
                  placeholder="Search tracks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
              <div className={styles.queueList}>
                {filteredTracks.map((t) => (
                  <div
                    key={t.i}
                    className={`${styles.queueItem}${t.i === player.idx ? ` ${styles.queueItemActive}` : ""}`}
                    onClick={() => { player.playIdx(t.i); setMode("player"); }}
                  >
                    <span className={styles.queueNum}>{t.i + 1}</span>
                    <div className={styles.queueItemInfo}>
                      <span className={styles.queueItemName}>{t.name}</span>
                      <span className={styles.queueItemArtist}>{t.artist}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}