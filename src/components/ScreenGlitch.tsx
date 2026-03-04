"use client";

import { useEffect, useRef, useState } from "react";

/*  types  */
interface TearStrip {
  top: number;
  h: number;
  dx: number;
  inv: boolean;
}
interface GlitchFrame {
  noise: number;
  rgbShift: number;
  hue: number;
  brightness: number;
  contrast: number;
  saturate: number;
  tears: TearStrip[];
  shake: number;
  roll: number;
  skew: number;
  whiteFlash: number;
  blueFlash: number;
  redFlash: number;
  freeze: boolean;
}
type Phase = "glitch" | "blackout" | "reveal" | null;

/*  escalation  */
let _lastFreeze = 0;

function buildFrame(t: number, now: number): GlitchFrame {
  const r = () => Math.random();

  const lvl1 = t > 0.07;
  const lvl2 = t > 0.22;
  const lvl3 = t > 0.44;
  const lvl4 = t > 0.64;
  const lvl5 = t > 0.82;

  const I = Math.pow(t, 1.1);

  const maxTears = !lvl2 ? 0 : !lvl3 ? 4 : !lvl4 ? 10 : !lvl5 ? 17 : 24;
  const tears: TearStrip[] = [];
  for (let i = 0; i < Math.floor(I * maxTears); i++) {
    if (r() < 0.72)
      tears.push({
        top: r() * 94,
        h: 0.15 + r() * (lvl5 ? 9 : lvl4 ? 5 : lvl3 ? 2.5 : 1),
        dx: (r() - 0.5) * I * (lvl5 ? 340 : lvl4 ? 230 : lvl3 ? 130 : 55),
        inv: r() < (lvl4 ? 0.6 : 0.28),
      });
  }

  const shake =
    lvl3 && r() < (lvl4 ? 0.65 : 0.32) ? (r() - 0.5) * I * (lvl5 ? 70 : 36) : 0;
  const roll = lvl4 && r() < 0.32 ? (r() - 0.5) * I * 90 : 0;
  const skew = lvl3 && r() < 0.28 ? (r() - 0.5) * I * 7 : 0;

  const whiteFlash = lvl5
    ? r() < 0.52
      ? r() * 0.95
      : 0
    : lvl4 && r() < 0.08
      ? r() * 0.3
      : 0;
  const blueFlash = lvl5 && r() < 0.32 ? r() * 0.55 : 0;
  const redFlash = lvl4 && r() < 0.22 ? r() * 0.42 : 0;

  let freeze = false;
  if (lvl3 && now - _lastFreeze > 480 + r() * 420 && r() < 0.32) {
    freeze = true;
    _lastFreeze = now;
  }

  return {
    noise: !lvl1 ? t * 0.4 : 0.14 + I * 0.72,
    rgbShift: !lvl1 ? (t / 0.07) * 4 : I * 42 * (0.5 + r() * 1.5),
    hue: lvl2 ? I * 200 * (r() - 0.5) : 0,
    brightness: !lvl2 ? 1 : 0.38 + r() * 1.15,
    contrast: 1 + (lvl2 ? I * r() * 2.6 : 0),
    saturate: 1 + (lvl2 ? I * r() * 7 : 0),
    tears,
    shake,
    roll,
    skew,
    whiteFlash,
    blueFlash,
    redFlash,
    freeze,
  };
}

/*  noise canvas  */
function NoiseCanvas({ opacity }: { opacity: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const S = 180;
    canvas.width = S;
    canvas.height = S;
    let raf: number;
    const draw = () => {
      const img = ctx.createImageData(S, S);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = (Math.random() * 200) | 0;
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        imageRendering: "pixelated",
        mixBlendMode: "overlay",
        opacity,
      }}
    />
  );
}

/*  matrix reveal  */
const MATRIX_LINES: string[] = [
  "> INTRUSION ATTEMPT DETECTED  HOST: 127.0.0.1",
  "> AUTH BYPASS: [OK] ESCALATING PRIVILEGES...",
  "> KERNEL PANIC  NOT SYNCING: 0x000000EF",
  "> MEMORY CORRUPTION AT 0xFFFF8000E21A3060",
  "",
  "[##########] DEPLOYING PAYLOAD .............. 100%",
  "",
  "> REALITY.EXE  FALHA CRITICA",
  "> REMAPEANDO CAMADAS NEURAIS..............OK",
  "",
  "> MATRIX PROTOCOL v3.1.4 ATIVADO.",
  "> BEM-VINDO DE VOLTA.",
];

function MatrixReveal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [fading, setFading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const stateRef = useRef({ line: 0, char: 0, timer: 0, done: false });

  useEffect(() => {
    if (!visible) {
      clearTimeout(stateRef.current.timer);
      stateRef.current = { line: 0, char: 0, timer: 0, done: false };
      setTimeout(() => {
        setTypedLines([]);
        setFading(false);
        setIsDone(false);
      }, 0);
      return;
    }

    const s = stateRef.current;
    const tick = () => {
      if (s.done) return;
      const { line, char } = s;
      if (line >= MATRIX_LINES.length) {
        s.done = true;
        setIsDone(true);
        s.timer = window.setTimeout(() => {
          setFading(true);
          s.timer = window.setTimeout(onClose, 1100);
        }, 1600);
        return;
      }

      const full = MATRIX_LINES[line];
      if (full === "") {
        setTypedLines((p) => {
          const c = [...p];
          c[line] = "";
          return c;
        });
        s.line++;
        s.char = 0;
        s.timer = window.setTimeout(tick, 80);
        return;
      }

      if (char < full.length) {
        setTypedLines((p) => {
          const c = [...p];
          c[line] = full.slice(0, char + 1);
          return c;
        });
        s.char++;
        const isSlowChar = full[char] === "." || full[char] === " ";
        s.timer = window.setTimeout(
          tick,
          isSlowChar ? 55 : 15 + Math.random() * 22,
        );
      } else {
        s.line++;
        s.char = 0;
        s.timer = window.setTimeout(tick, 110);
      }
    };

    s.timer = window.setTimeout(tick, 260);
    return () => {
      clearTimeout(s.timer);
      s.done = true;
    };
  }, [visible, onClose]);

  const cursorLine = isDone ? -1 : typedLines.length - 1;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: "#000",
        opacity: fading ? 0 : visible ? 1 : 0,
        transition: "opacity 1.1s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: visible && !fading ? "all" : "none",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "clamp(2rem,5vw,4rem)",
      }}
    >
      <div
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "clamp(0.72rem,1.4vw,0.92rem)",
          color: "#00ff41",
          lineHeight: 1.95,
          textShadow: "0 0 6px #00ff41, 0 0 18px rgba(0,255,65,0.45)",
          maxWidth: 680,
        }}
      >
        {typedLines.map((line, i) => (
          <div key={i}>
            {line}
            {i === cursorLine ? (
              <span
                style={{
                  display: "inline-block",
                  width: "0.55em",
                  height: "1em",
                  background: "#00ff41",
                  boxShadow: "0 0 6px #00ff41",
                  verticalAlign: "text-bottom",
                  marginLeft: "1px",
                  animation: "sg-cursor-blink 0.7s step-end infinite",
                }}
              />
            ) : null}
          </div>
        ))}
        {typedLines.length === 0 && visible && !isDone && (
          <span
            style={{
              display: "inline-block",
              width: "0.55em",
              height: "1em",
              background: "#00ff41",
              boxShadow: "0 0 6px #00ff41",
              verticalAlign: "text-bottom",
              animation: "sg-cursor-blink 0.7s step-end infinite",
            }}
          />
        )}
      </div>
    </div>
  );
}

/*  main component  */
export default function ScreenGlitch({
  active,
  onDone,
}: {
  active: boolean;
  onDone?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>(null);
  const [frame, setFrame] = useState<GlitchFrame | null>(null);
  const [revealVisible, setRevealVisible] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const activeRef = useRef(false);

  const cleanup = () => {
    activeRef.current = false;
    cancelAnimationFrame(rafRef.current);
    document.documentElement.style.removeProperty("filter");
    document.documentElement.style.removeProperty("transform");
  };

  useEffect(() => {
    if (!active) {
      cleanup();
      const tid = setTimeout(() => {
        setPhase(null);
        setFrame(null);
        setRevealVisible(false);
      }, 0);
      return () => clearTimeout(tid);
    }

    activeRef.current = true;
    startRef.current = performance.now();
    setTimeout(() => setPhase("glitch"), 0);

    const GLITCH_MS = 6400;
    let frozenFrame: GlitchFrame | null = null;

    const tick = (now: number) => {
      if (!activeRef.current) return;
      const t = Math.min((now - startRef.current) / GLITCH_MS, 1);
      const f = buildFrame(t, now);

      if (f.freeze && frozenFrame) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      frozenFrame = f;
      setFrame(f);

      if (t > 0.07)
        document.documentElement.style.filter = `hue-rotate(${f.hue.toFixed(1)}deg) brightness(${f.brightness.toFixed(2)}) contrast(${f.contrast.toFixed(2)}) saturate(${f.saturate.toFixed(2)})`;
      const hasTransform = f.shake || f.skew || f.roll;
      if (hasTransform)
        document.documentElement.style.transform = `translateX(${f.shake.toFixed(1)}px) translateY(${f.roll.toFixed(1)}px) skewX(${f.skew.toFixed(2)}deg)`;
      else document.documentElement.style.removeProperty("transform");

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      cleanup();
      setFrame(null);
      setPhase("blackout");
      setTimeout(() => {
        setPhase("reveal");
        setTimeout(() => setRevealVisible(true), 100);
      }, 900);
    };

    rafRef.current = requestAnimationFrame(tick);
    return cleanup;
  }, [active]);

  const handleClose = () => {
    setRevealVisible(false);
    setTimeout(() => {
      setPhase(null);
      onDone?.();
    }, 1100);
  };

  if (!phase) return null;

  return (
    <>
      {phase === "glitch" && frame && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9990,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <NoiseCanvas opacity={frame.noise} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.22) 2px,rgba(0,0,0,0.22) 4px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,0,60,0.13)",
              transform: `translateX(${-frame.rgbShift}px)`,
              mixBlendMode: "screen",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,200,255,0.13)",
              transform: `translateX(${frame.rgbShift}px)`,
              mixBlendMode: "screen",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,255,60,0.07)",
              transform: `translateX(${(frame.rgbShift * 0.4).toFixed(1)}px) translateY(${(-frame.rgbShift * 0.3).toFixed(1)}px)`,
              mixBlendMode: "screen",
            }}
          />
          {frame.tears.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "-5%",
                width: "110%",
                top: `${s.top}%`,
                height: `${s.h}%`,
                transform: `translateX(${s.dx}px)`,
                backdropFilter: s.inv
                  ? "invert(1) hue-rotate(90deg) saturate(5) contrast(2.2)"
                  : "hue-rotate(160deg) saturate(6) brightness(1.7)",
                WebkitBackdropFilter: s.inv
                  ? "invert(1) hue-rotate(90deg) saturate(5) contrast(2.2)"
                  : "hue-rotate(160deg) saturate(6) brightness(1.7)",
              }}
            />
          ))}
          {frame.whiteFlash > 0.01 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `rgba(255,255,255,${frame.whiteFlash})`,
              }}
            />
          )}
          {frame.blueFlash > 0.01 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `rgba(0,0,180,${frame.blueFlash})`,
              }}
            />
          )}
          {frame.redFlash > 0.01 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `rgba(200,0,0,${frame.redFlash})`,
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center,transparent 32%,rgba(0,0,0,0.88) 100%)",
              mixBlendMode: "multiply",
            }}
          />
          {frame.blueFlash > 0.14 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "clamp(0.58rem,1.15vw,0.82rem)",
                  color: "#fff",
                  lineHeight: 1.85,
                  textAlign: "left",
                  opacity: Math.min(1, frame.blueFlash * 3),
                  letterSpacing: "0.035em",
                  padding: "2rem",
                  maxWidth: 540,
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(0.9rem,2.2vw,1.4rem)",
                    marginBottom: "1rem",
                    fontWeight: 700,
                  }}
                >
                  :( CRITICAL_PROCESS_DIED
                </div>
                <div>A problem has been detected and your browser</div>
                <div>has been shut down to prevent damage.</div>
                <div style={{ marginTop: "0.8rem" }}>
                  STOP: 0x000000EF (0xFFFF8000E21A3060,
                </div>
                <div style={{ paddingLeft: "2ch" }}>0x0000000000000000,</div>
                <div style={{ paddingLeft: "2ch" }}>0x0000000000000000)</div>
                <div
                  style={{
                    marginTop: "0.8rem",
                    opacity: 0.55,
                    fontSize: "0.8em",
                  }}
                >
                  Collecting data for crash report... 0%
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {phase === "blackout" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9994,
            background: "#000",
            pointerEvents: "none",
            animation: "sg-blackout 0.9s ease forwards",
          }}
        />
      )}

      {phase === "reveal" && (
        <MatrixReveal visible={revealVisible} onClose={handleClose} />
      )}
    </>
  );
}
