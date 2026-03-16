"use client";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "phosphor-react";
import { useRef, useCallback, useState, useEffect } from "react";

const THEME_BG     = { dark: "#252530", light: "#ede8dc" };
const THEME_ACCENT = { dark: "#a07ed4", light: "#6b3fa0" };
const STRIPS       = 8;
const FLIP_DUR     = 460;
const STAGGER      = 52;
const FADE_OUT_DUR = 350;

const CSS = `
  .tt-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--accent);
    padding: 6px;
    border-radius: 10px;
    outline: none;
    transition: transform 0.2s ease;
  }
  .tt-btn:hover          { transform: scale(1.2);  }
  .tt-btn:active         { transform: scale(0.92); }
  .tt-btn:disabled       { cursor: default;        }
  .tt-btn:disabled:hover { transform: none;        }

  .tt-icon {
    display: flex;
    transition:
      transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
      opacity   0.3s  ease;
  }
  .tt-icon--hiding {
    transform: scale(0) rotate(180deg);
    opacity: 0;
    transition:
      transform 0.22s cubic-bezier(0.55, 0, 1, 0.45),
      opacity   0.18s ease;
  }

  .tt-container {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9998;
    overflow: hidden;
    opacity: 1;
    transition: opacity 0.35s ease;
  }
  .tt-container--out { opacity: 0; }

  .tt-strip-wrap {
    position: absolute;
    top: 0;
    overflow: hidden;
  }

  .tt-strip {
    width: 100%;
    height: 100%;
    position: relative;
    transform-origin: center center;
    transform-style: preserve-3d;
    animation: tt-strip-flip var(--flip-dur) var(--flip-delay)
               cubic-bezier(0.45, 0, 0.55, 1) both;
  }

  .tt-face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
  }
  .tt-face-front { background: var(--face-front); }
  .tt-face-back  { background: var(--face-back); transform: rotateY(180deg); }

  .tt-edge {
    position: absolute;
    top: 0; left: 0;
    width: 2px; height: 100%;
    background: linear-gradient(
      to bottom,
      transparent   0%,
      var(--accent) 30%,
      var(--accent) 70%,
      transparent   100%
    );
    opacity: 0.5;
  }

  @keyframes tt-strip-flip {
    0%   { transform: perspective(1200px) rotateY(0deg);    }
    100% { transform: perspective(1200px) rotateY(-180deg); }
  }
`;

function stripDelays(originX: number, stripW: number): number[] {
  const indices = Array.from({ length: STRIPS }, (_, i) => i);
  indices.sort((a, b) => {
    const da = Math.abs(a * stripW + stripW / 2 - originX);
    const db = Math.abs(b * stripW + stripW / 2 - originX);
    return da - db;
  });
  const delays = new Array<number>(STRIPS);
  indices.forEach((stripIdx, order) => { delays[stripIdx] = order * STAGGER; });
  return delays;
}

function buildStrip(opts: {
  index:  number;
  stripW: number;
  height: number;
  delay:  number;
  curBg:  string;
  nextBg: string;
  accent: string;
}): HTMLDivElement {
  const { index, stripW, height, delay, curBg, nextBg, accent } = opts;

  const wrap = document.createElement("div");
  wrap.className    = "tt-strip-wrap";
  wrap.style.left   = `${index * stripW}px`;
  wrap.style.width  = `${stripW + 1}px`;
  wrap.style.height = `${height}px`;

  const strip = document.createElement("div");
  strip.className = "tt-strip";
  strip.style.setProperty("--flip-dur",   `${FLIP_DUR}ms`);
  strip.style.setProperty("--flip-delay", `${delay}ms`);

  const front = document.createElement("div");
  front.className = "tt-face tt-face-front";
  front.style.setProperty("--face-front", curBg);

  const back = document.createElement("div");
  back.className = "tt-face tt-face-back";
  back.style.setProperty("--face-back", nextBg);
  back.style.setProperty("--accent",    accent);

  const edge = document.createElement("div");
  edge.className = "tt-edge";

  back.appendChild(edge);
  strip.appendChild(front);
  strip.appendChild(back);
  wrap.appendChild(strip);
  return wrap;
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (document.getElementById("tt-styles")) return;
    const tag = document.createElement("style");
    tag.id          = "tt-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  const handleToggle = useCallback(() => {
    if (busy || !btnRef.current) return;
    setBusy(true);

    const rect    = btnRef.current.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const W       = window.innerWidth;
    const H       = window.innerHeight;
    const stripW  = Math.ceil(W / STRIPS);
    const next    = theme === "dark" ? "light" : "dark";
    const delays  = stripDelays(originX, stripW);

    const container = document.createElement("div");
    container.className = "tt-container";

    for (let i = 0; i < STRIPS; i++) {
      container.appendChild(buildStrip({
        index:  i,
        stripW,
        height: H,
        delay:  delays[i],
        curBg:  THEME_BG[theme],
        nextBg: THEME_BG[next],
        accent: THEME_ACCENT[next],
      }));
    }
    document.body.appendChild(container);

    const swapAt  = Math.floor(STRIPS / 2) * STAGGER + FLIP_DUR * 0.45;
    const cleanAt = (STRIPS - 1) * STAGGER + FLIP_DUR + 40;

    setTimeout(() => toggleTheme(), swapAt);
    setTimeout(() => {
      container.classList.add("tt-container--out");
      setTimeout(() => { container.remove(); setBusy(false); }, FADE_OUT_DUR);
    }, cleanAt);
  }, [busy, theme, toggleTheme]);

  return (
    <button
      ref={btnRef}
      aria-label="Alternar tema"
      className="tt-btn"
      onClick={handleToggle}
      disabled={busy}
      tabIndex={0}
    >
      <span className={`tt-icon${busy ? " tt-icon--hiding" : ""}`}>
        {theme === "dark"
          ? <Moon weight="fill" size={22} />
          : <Sun  weight="fill" size={22} />
        }
      </span>
    </button>
  );
}