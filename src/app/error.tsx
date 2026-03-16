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
      my = 0;
    let rx = 0,
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

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="ep">
      <Cursor />
      <div className="ep__grid" aria-hidden />

      <motion.span
        className="ep__bg-num"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease }}
        aria-hidden
      >
        500
      </motion.span>

      <div className="ep__content">
        <motion.div
          className="ep__label"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          <span className="ep__label-dot" />
          Erro interno
        </motion.div>

        <div style={{ overflow: "hidden" }}>
          <motion.h1
            className="ep__heading"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
          >
            Algo
          </motion.h1>
        </div>
        <div style={{ overflow: "hidden" }}>
          <motion.h1
            className="ep__heading ep__heading--red"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.8, delay: 0.32, ease }}
          >
            Quebrou
          </motion.h1>
        </div>

        <div className="ep__stripes">
          {["#e8453c", "#f5b800", "#3d4fc4"].map((color, i) => (
            <motion.span
              key={color}
              className="ep__stripe"
              style={{ background: color }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.07, ease }}
            />
          ))}
        </div>

        <motion.p
          className="ep__desc"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease }}
        >
          Um erro inesperado aconteceu.
          {error.digest && <span className="ep__digest"> #{error.digest}</span>}
        </motion.p>

        <motion.div
          className="ep__actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.78, ease }}
        >
          <button onClick={reset} className="ep__cta ep__cta--red">
            <svg
              width="13"
              height="13"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
            >
              <path
                d="M1 7a6 6 0 1 0 6-6 6 6 0 0 0-4.24 1.76M1 1v4h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Tentar novamente</span>
          </button>

          <Link href="/" className="ep__cta ep__cta--ghost">
            Voltar ao início
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
