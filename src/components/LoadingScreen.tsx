"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = "GABRIEL GLATZ".split("");

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDone(true), 300);
          return 100;
        }
        const step = prev < 60 ? Math.random() * 4 + 1 : Math.random() * 8 + 2;
        return Math.min(prev + step, 100);
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!done && (
        <motion.div
          className="loader-wrap"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Name letters */}
          <div className="flex items-center gap-[0.08em] overflow-hidden">
            {LETTERS.map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.055,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  display: "inline-block",
                  fontSize: "clamp(2rem, 7vw, 6rem)",
                  fontWeight: 900,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: char === " " ? "transparent" : "var(--fg)",
                  width: char === " " ? "0.5em" : "auto",
                  lineHeight: 1,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>

          {/* Counter */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              position: "absolute",
              bottom: "2.5rem",
              right: "2.5rem",
              fontSize: "0.7rem",
              letterSpacing: "0.25em",
              color: "#555",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {String(Math.round(count)).padStart(3, "0")}
          </motion.span>

          {/* Progress bar */}
          <motion.div
            className="loader-bar"
            style={{ width: `${count}%` }}
            transition={{ ease: "linear" }}
          />

          {/* Subtitle */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              position: "absolute",
              bottom: "2.5rem",
              left: "2.5rem",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#444",
            }}
          >
            Portfolio — 2026
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
