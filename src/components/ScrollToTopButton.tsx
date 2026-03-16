import React, {
  useEffect, useLayoutEffect, useRef, useState, useCallback,
} from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

// ─── palette ──────────────────────────────────────────────────────────────────
const P = {
  red:    "#E8453C",
  yellow: "#F5B800",
  blue:   "#3D4FC4",
  purple: "#a07ed4",
};
const PALETTE = [P.red, P.yellow, P.blue, P.purple] as const;

// colour that matches which quarter of the page the user is on
const quarterColor = (pct: number) => {
  if (pct < 0.25) return P.red;
  if (pct < 0.50) return P.yellow;
  if (pct < 0.75) return P.blue;
  return P.purple;
};

// ─── utils ────────────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const pick    = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];
const shuffle = <T,>(a: T[]): T[] => [...a].sort(() => Math.random() - 0.5);
const seq     = (n: number) => Array.from({ length: n }, (_, i) => i);

const forceTop = () => {
  try { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); } catch { /**/ }
  window.scroll(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

// ─── ring ─────────────────────────────────────────────────────────────────────
const SZ = 58, SW = 3;
const RR = (SZ - SW * 2) / 2;
const CIRC = 2 * Math.PI * RR;

function Ring({ pct, color }: { pct: number; color: string }) {
  return (
    <svg width={SZ} height={SZ} viewBox={`0 0 ${SZ} ${SZ}`}
      style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)", pointerEvents: "none" }}>
      <circle cx={SZ/2} cy={SZ/2} r={RR} fill="none"
        stroke="rgba(255,255,255,0.08)" strokeWidth={SW} />
      <motion.circle cx={SZ/2} cy={SZ/2} r={RR} fill="none"
        strokeLinecap="round" strokeDasharray={CIRC}
        animate={{ stroke: color, strokeDashoffset: CIRC * (1 - pct) }}
        transition={{ stroke: { duration: 0.5 }, strokeDashoffset: { duration: 0.08, ease: "linear" } }}
        strokeWidth={SW}
      />
    </svg>
  );
}

// ─── curtain: corners ─────────────────────────────────────────────────────────
// 4 brand-colored circles burst from the 4 corners and swallow the screen
const CORNERS = [
  { top: 0,    left: 0    },
  { top: 0,    right: 0   },
  { bottom: 0, left: 0    },
  { bottom: 0, right: 0   },
] as const;

function Corners({ colors }: { colors: string[] }) {
  return (
    <>
      {CORNERS.map((pos, i) => (
        <motion.div key={i}
          variants={{
            show: { scale: 1,   transition: { duration: 0.6, delay: i * 0.06, ease: EASE } },
            hide: { scale: 0,   transition: { duration: 0.5, delay: i * 0.04, ease: EASE } },
          }}
          initial={{ scale: 0 }}
          animate="show"
          exit="hide"
          style={{
            position: "absolute",
            ...pos,
            // large enough to cover the full diagonal from any corner
            width: "200vmax", height: "200vmax",
            // each circle's center sits at the corner
            ...("right" in pos ? { transform: "translate(50%, -50%)" } : {}),
            ...("top" in pos && "left" in pos && !("right" in pos) ? { transform: "translate(-50%, -50%)" } : {}),
            ...("bottom" in pos && "left" in pos && !("right" in pos) ? { transform: "translate(-50%, 50%)" } : {}),
            ...("bottom" in pos && "right" in pos ? { transform: "translate(50%, 50%)" } : {}),
            borderRadius: "50%",
            background: colors[i % colors.length],
            opacity: 0.96,
          }}
        />
      ))}
    </>
  );
}

// ─── curtain: columns ─────────────────────────────────────────────────────────
function Columns({ colors }: { colors: string[] }) {
  const [dir] = useState(() => pick(["up", "down"] as const));
  const N = colors.length;
  return (
    <>
      {colors.map((bg, i) => (
        <motion.div key={i}
          variants={{
            show: { y: 0,
              transition: { duration: 0.52, delay: i * 0.04, ease: EASE } },
            hide: { y: dir === "up" ? "-102%" : "102%",
              transition: { duration: 0.46, delay: i * 0.035, ease: EASE } },
          }}
          initial={{ y: dir === "up" ? "102%" : "-102%" }}
          animate="show" exit="hide"
          style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${(i / N) * 100}%`,
            width: `${100 / N + 0.4}%`,
            background: bg,
            // inner shadow to give depth between columns
            boxShadow: "inset -3px 0 18px rgba(0,0,0,0.2)",
          }}
        />
      ))}
    </>
  );
}

// ─── curtain: mosaic ──────────────────────────────────────────────────────────
function Mosaic({ colors }: { colors: string[] }) {
  const COLS = 11, ROWS = 7, TOTAL = COLS * ROWS;
  const [order] = useState(() => shuffle(seq(TOTAL)));
  return (
    <div style={{
      position: "absolute", inset: 0, display: "grid",
      gridTemplateColumns: `repeat(${COLS}, 1fr)`,
      gridTemplateRows:    `repeat(${ROWS}, 1fr)`,
    }}>
      {order.map((rank, i) => {
        const t = rank / TOTAL;
        return (
          <motion.div key={i}
            variants={{
              show: { opacity: 1, scale: 1,
                transition: { duration: 0.22, delay: t * 0.4, ease: [0.34, 1.56, 0.64, 1] } },
              hide: { opacity: 0, scale: 0.3,
                transition: { duration: 0.16, delay: t * 0.28, ease: "easeIn" } },
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate="show" exit="hide"
            style={{ background: colors[i % colors.length] }}
          />
        );
      })}
    </div>
  );
}

// ─── curtain: diagonal shards ─────────────────────────────────────────────────
// skewed stripes entering from alternating sides — looks like diagonal slashes
function Diagonal({ colors }: { colors: string[] }) {
  const N = colors.length;
  return (
    // overflow hidden so the skewed strips don't leak outside viewport
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {colors.map((bg, i) => {
        const fromLeft = i % 2 === 0;
        return (
          <motion.div key={i}
            variants={{
              show: { x: 0,
                transition: { duration: 0.48, delay: i * 0.042, ease: EASE } },
              hide: { x: fromLeft ? "-120%" : "120%",
                transition: { duration: 0.42, delay: i * 0.036, ease: EASE } },
            }}
            initial={{ x: fromLeft ? "-120%" : "120%" }}
            animate="show" exit="hide"
            style={{
              position: "absolute", top: "-10%", bottom: "-10%",
              left: `${(i / N) * 100 - 2}%`,
              width: `${100 / N + 4}%`,
              background: bg,
              transform: "skewX(-12deg)",
              transformOrigin: "center",
              boxShadow: "inset -4px 0 20px rgba(0,0,0,0.18)",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── mode type ────────────────────────────────────────────────────────────────
type Mode = "corners" | "columns" | "mosaic" | "diagonal";
const MODES: readonly Mode[] = ["corners", "columns", "mosaic", "diagonal"];

// ─── main ─────────────────────────────────────────────────────────────────────
export default function ScrollToTopButton() {
  const [pct,     setPct]     = useState(0);
  const [visible, setVisible] = useState(false);
  const [curtain, setCurtain] = useState(false);
  const [mode,    setMode]    = useState<Mode>("corners");
  const [colors,  setColors]  = useState<string[]>([...PALETTE]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // spring-animate the button background color
  const btnColor = quarterColor(pct);

  // ── scroll progress ──────────────────────────────────────────────────────
  useEffect(() => {
    const fn = () => {
      const p = window.scrollY /
        Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setPct(p);
      setVisible(p > 0.06);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ── scroll teleport as soon as curtain mounts ────────────────────────────
  useLayoutEffect(() => {
    if (curtain) forceTop();
  }, [curtain]);

  // ── click ────────────────────────────────────────────────────────────────
  const handleClick = useCallback(() => {
    forceTop();                           // always, unconditionally
    setMode(pick(MODES));
    setColors(shuffle([...PALETTE]));
    setCurtain(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurtain(false);
      timerRef.current = null;
    }, 1600);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const stripes = Array.from({ length: 8 }, (_, i) => colors[i % colors.length]);

  return (
    <>
      {/* ── button ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.4, y: 24 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{ opacity: 0,   scale: 0.4,  y: 24 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            style={{
              position: "fixed", bottom: "2rem", right: "2rem",
              zIndex: 12000, width: SZ, height: SZ,
            }}
          >
            <Ring pct={pct} color={btnColor} />

            <motion.button
              aria-label="Ir ao topo"
              onClick={handleClick}
              animate={{ background: btnColor }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              whileHover={{
                scale: 1.14,
                boxShadow: `0 0 0 6px ${btnColor}33, 0 8px 32px ${btnColor}55`,
              }}
              whileTap={{ scale: 0.82, rotate: -12 }}
              style={{
                position: "absolute", inset: SW + 2,
                border: "none", outline: "none", cursor: "pointer",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 2px 0 rgba(0,0,0,0.22), 0 6px 28px ${btnColor}44, inset 0 1px 0 rgba(255,255,255,0.2)`,
              }}
            >
              {/* arrow — geometric, not rounded */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M12 20V4" />
                <path d="M5 11L12 4l7 7" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── curtain ───────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {curtain && (
          <motion.div key={`curtain-${mode}`}
            style={{
              position: "fixed", inset: 0,
              zIndex: 20000, overflow: "hidden",
              pointerEvents: "all",
            }}
          >
            {mode === "corners"  && <Corners  colors={stripes} />}
            {mode === "columns"  && <Columns  colors={stripes} />}
            {mode === "mosaic"   && <Mosaic   colors={stripes} />}
            {mode === "diagonal" && <Diagonal colors={stripes} />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}