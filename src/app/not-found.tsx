"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as const;

function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    };
    const loop = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    loop();
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

function GlitchCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Scanlines — subtle
      ctx.fillStyle = "rgba(160,126,212,0.015)";
      for (let y = 0; y < canvas.height; y += 3)
        ctx.fillRect(0, y, canvas.width, 1);

      // Glitch burst — heavy every ~90 frames, light randomly
      const isBurst = frame % 90 < 6;
      const glitchCount = isBurst ? 14 : Math.random() < 0.12 ? 3 : 0;

      for (let i = 0; i < glitchCount; i++) {
        const y = Math.random() * canvas.height;
        const h = isBurst ? Math.random() * 18 + 2 : Math.random() * 4 + 1;
        const shift = (Math.random() - 0.5) * (isBurst ? 80 : 30);
        const alpha = isBurst
          ? Math.random() * 0.22 + 0.04
          : Math.random() * 0.1;

        // R channel slice
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#e8453c";
        ctx.fillRect(shift, y, canvas.width, h);
        ctx.restore();

        // B channel offset
        ctx.save();
        ctx.globalAlpha = alpha * 0.7;
        ctx.fillStyle = "#3d4fc4";
        ctx.fillRect(-shift * 0.6, y + h * 0.5, canvas.width, h * 0.6);
        ctx.restore();
      }

      // Vignette
      const vg = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.2,
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.85,
      );
      vg.addColorStop(0, "transparent");
      vg.addColorStop(1, "rgba(37,37,48,0.65)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frame++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="nf__canvas" aria-hidden />;
}

function GlitchNumber() {
  return (
    <div className="nf__glitch-wrap" aria-label="404">
      <span className="nf__glitch" data-text="404">
        404
      </span>
    </div>
  );
}

export default function NotFound() {
  return (
    <main className="nf">
      <Cursor />
      <GlitchCanvas />
      <GlitchNumber />

      <div className="nf__content">
        <motion.div
          className="nf__label"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          <span className="nf__label-dot" />
          Página não encontrada
        </motion.div>

        <div style={{ overflow: "hidden" }}>
          <motion.h1
            className="nf__heading"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          >
            Perdido no
          </motion.h1>
        </div>
        <div style={{ overflow: "hidden" }}>
          <motion.h1
            className="nf__heading nf__heading--accent"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.8, delay: 0.42, ease }}
          >
            Void
          </motion.h1>
        </div>

        <div className="nf__stripes">
          {["#e8453c", "#f5b800", "#3d4fc4"].map((color, i) => (
            <motion.span
              key={color}
              className="nf__stripe"
              style={{ background: color }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.07, ease }}
            />
          ))}
        </div>

        <motion.p
          className="nf__desc"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease }}
        >
          Essa rota não existe — ou foi removida.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.88, ease }}
        >
          <Link href="/" className="nf__cta">
            <svg
              width="13"
              height="13"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
            >
              <path
                d="M13 7H1M1 7L7 1M1 7L7 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Voltar ao início</span>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
