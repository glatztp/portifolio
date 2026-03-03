"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STRIPES: [string, number][] = [
  ["#e8453c", 1.0],
  ["#f5b800", 0.72],
  ["#3d4fc4", 0.48],
];

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
          setTimeout(() => setDone(true), 500);
          return 100;
        }
        const step = prev < 60 ? Math.random() * 3 + 1 : Math.random() * 7 + 2;
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
          exit={{ y: "-102%" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            className="loader-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            loading
          </motion.span>
          <motion.div
            className="loader-counter"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="loader-counter__digits">
              {String(Math.round(count)).padStart(2, "0")}
            </span>
            <span className="loader-counter__pct">%</span>
          </motion.div>
          <motion.div
            className="loader-stripes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            {STRIPES.map(([color, ratio]) => (
              <div key={color} className="loader-stripe-track">
                <motion.div
                  className="loader-stripe-fill"
                  style={{
                    background: color,
                    width: `${Math.min(count / ratio, 100)}%`,
                    transition: "width 0.12s linear",
                  }}
                />
              </div>
            ))}
          </motion.div>
          <div
            className="loader-bar"
            style={{ width: `${count}%`, transition: "width 0.08s linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
