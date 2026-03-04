"use client";

import { useEffect, useRef, useState } from "react";

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

/* spike helper: random burst moments */
let _lastFreeze = 0;
function buildFrame(t: number, now: number): GlitchFrame {
  const r = () => Math.random();
  const I = Math.pow(t, 1.2);
  const late = t > 0.6; // second half
  const end = t > 0.82; // near the end

  /* tear strips — a LOT more aggressive */
  const numTears = Math.floor(I * 22);
  const tears: TearStrip[] = [];
  for (let i = 0; i < numTears; i++) {
    if (r() < 0.7)
      tears.push({
        top: r() * 94,
        h: 0.2 + r() * (end ? 8 : 4),
        dx: (r() - 0.5) * I * (end ? 320 : 200),
        inv: r() < 0.5,
      });
  }

  const shakeP = t > 0.45 ? (t - 0.45) / 0.55 : 0;
  const shake = r() < shakeP ? (r() - 0.5) * I * (end ? 60 : 36) : 0;
  const roll =
    late && r() < 0.35 ? (r() - 0.5) * I * 80 : 0; /* vertical roll */
  const skew = r() < shakeP * 0.5 ? (r() - 0.5) * I * 6 : 0;

  /* white flash spikes — only in intense moments */
  const spikeChance = end ? 0.55 : late ? 0.22 : 0.05;
  const whiteFlash = r() < spikeChance ? r() * (end ? 0.95 : 0.55) : 0;

  /* blue/red channel flash for BSOD feel */
  const blueFlash = end && r() < 0.3 ? r() * 0.4 : 0;
  const redFlash = t > 0.5 && r() < 0.18 ? r() * 0.35 : 0;

  /* freeze stutter: holds same frame for ~80ms every ~600ms */
  let freeze = false;
  if (now - _lastFreeze > 500 + r() * 400 && t > 0.3 && r() < 0.35) {
    freeze = true;
    _lastFreeze = now;
  }

  return {
    noise: 0.12 + I * 0.7,
    rgbShift: I * 38 * (0.5 + r() * 1.5),
    hue: I * 180 * (r() - 0.5),
    brightness: t < 0.35 ? 1 : 0.4 + r() * 1.1,
    contrast: 1 + I * r() * 2.4,
    saturate: 1 + I * r() * 6,
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

function RevealCard({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(6,5,15,0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: visible ? "all" : "none",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: 480,
          padding: "2.5rem 2rem",
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(20px) scale(0.97)",
          opacity: visible ? 1 : 0,
          transition:
            "opacity 0.7s 0.3s cubic-bezier(0.22,1,0.36,1), transform 0.7s 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.8rem,4.5vw,2.8rem)",
            fontWeight: 700,
            color: "#ede8dc",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: "1rem",
          }}
        >
          era só brincadeira :)
        </h2>
        <p
          style={{
            fontSize: "0.98rem",
            color: "rgba(237,232,220,0.48)",
            lineHeight: 1.9,
            marginBottom: "2rem",
          }}
        >
          você não quebrou nada, não perdeu dado nenhum.
          <br />
          mas é bom saber que ousou tentar.
        </p>
        <p
          style={{
            fontFamily: "'Courier New',monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.14em",
            color: "#a07ed4",
            opacity: 0.8,
            marginBottom: "1.6rem",
          }}
        >
          — glatz
        </p>
        <p
          style={{
            fontSize: "0.62rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(237,232,220,0.2)",
          }}
        >
          clique para fechar
        </p>
      </div>
    </div>
  );
}

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
    setPhase("glitch");
    const GLITCH_MS = 5200; /* slightly longer for more dread */
    let frozenFrame: GlitchFrame | null = null; /* held during freeze */

    const tick = (now: number) => {
      if (!activeRef.current) return;
      const t = Math.min((now - startRef.current) / GLITCH_MS, 1);
      const f = buildFrame(t, now);

      /* freeze stutter: skip update and hold previous frame */
      if (f.freeze && frozenFrame) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      frozenFrame = f;
      setFrame(f);

      /* whole-page distortion via <html> — includes vertical roll */
      if (t > 0.08)
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
        setTimeout(() => setRevealVisible(true), 80);
      }, 850);
    };

    rafRef.current = requestAnimationFrame(tick);
    return cleanup;
  }, [active]);

  const handleClose = () => {
    setRevealVisible(false);
    setTimeout(() => {
      setPhase(null);
      onDone?.();
    }, 820);
  };

  useEffect(() => {
    if (phase !== "reveal") return;
    const t = setTimeout(handleClose, 6000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

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

          {/* scanlines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.22) 2px,rgba(0,0,0,0.22) 4px)",
            }}
          />

          {/* red channel */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,0,60,0.12)",
              transform: `translateX(${-frame.rgbShift}px)`,
              mixBlendMode: "screen",
            }}
          />
          {/* cyan channel */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,200,255,0.12)",
              transform: `translateX(${frame.rgbShift}px)`,
              mixBlendMode: "screen",
            }}
          />
          {/* green channel slight offset */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,255,60,0.06)",
              transform: `translateX(${frame.rgbShift * 0.4}px) translateY(${-frame.rgbShift * 0.3}px)`,
              mixBlendMode: "screen",
            }}
          />

          {/* tear strips */}
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
                  ? "invert(1) hue-rotate(90deg) saturate(4) contrast(2)"
                  : "hue-rotate(160deg) saturate(5) brightness(1.6)",
                WebkitBackdropFilter: s.inv
                  ? "invert(1) hue-rotate(90deg) saturate(4) contrast(2)"
                  : "hue-rotate(160deg) saturate(5) brightness(1.6)",
              }}
            />
          ))}

          {/* white flash */}
          {frame.whiteFlash > 0.01 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `rgba(255,255,255,${frame.whiteFlash})`,
              }}
            />
          )}

          {/* blue BSOD flash */}
          {frame.blueFlash > 0.01 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `rgba(0,0,180,${frame.blueFlash})`,
              }}
            />
          )}

          {/* red danger flash */}
          {frame.redFlash > 0.01 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `rgba(200,0,0,${frame.redFlash})`,
              }}
            />
          )}

          {/* vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,0.85) 100%)",
              mixBlendMode: "multiply",
            }}
          />

          {/* fake BSOD text — appears near end */}
          {frame.blueFlash > 0.15 && (
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
                  fontSize: "clamp(0.6rem,1.2vw,0.85rem)",
                  color: "#fff",
                  lineHeight: 1.8,
                  textAlign: "left",
                  opacity: Math.min(1, frame.blueFlash * 3),
                  letterSpacing: "0.04em",
                  padding: "2rem",
                  maxWidth: 520,
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(1rem,2.5vw,1.5rem)",
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
            animation: "sg-blackout 0.85s ease forwards",
          }}
        />
      )}

      {phase === "reveal" && (
        <RevealCard visible={revealVisible} onClose={handleClose} />
      )}
    </>
  );
}
