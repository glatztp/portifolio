"use client";

import { motion } from "framer-motion";

const NAV = ["Sobre", "Projetos", "Contato"];
const STRIPES = ["#e8453c", "#f5b800", "#3d4fc4"];
const MARQUEE = [
  "React",
  "TypeScript",
  "Node.js",
  "Next.js",
  "Tailwind CSS",
  "UI/UX",
  "SQL",
  "REST APIs",
  "React",
  "TypeScript",
  "Node.js",
  "Next.js",
  "Tailwind CSS",
  "UI/UX",
  "SQL",
  "REST APIs",
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero({ started }: { started: boolean }) {
  return (
    <section className="hero-section">
      {/* ── Nav ─────────────────────────────────────────────── */}
      <motion.nav
        className="hero-nav"
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.1 }}
      >
        <span className="hero-nav__brand">GG</span>
        <div className="hero-nav__links">
          {NAV.map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hero-nav__link"
              initial={{ opacity: 0, y: -6 }}
              animate={started ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.07, ease }}
            >
              {item}
            </motion.a>
          ))}
        </div>
      </motion.nav>

      {/* ── Decorative shape ─────────────────────────────── */}
      <motion.div
        className="hero-deco"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.5 }}
      >
        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer ring */}
          <circle cx="250" cy="250" r="238" stroke="rgba(237,232,220,0.07)" strokeWidth="1" />

          {/* Rotating dashed ring (counter-clockwise) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 250 250"
              to="0 250 250"
              dur="120s"
              repeatCount="indefinite"
            />
            <circle cx="250" cy="250" r="238" stroke="rgba(61,79,196,0.07)" strokeWidth="1" strokeDasharray="1 28" />
          </g>

          {/* Mid dashed ring (clockwise) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 250 250"
              to="360 250 250"
              dur="80s"
              repeatCount="indefinite"
            />
            <circle cx="250" cy="250" r="195" stroke="rgba(160,126,212,0.1)" strokeWidth="1" strokeDasharray="3 14" />
          </g>

          {/* Inner solid ring */}
          <circle cx="250" cy="250" r="130" stroke="rgba(237,232,220,0.05)" strokeWidth="1" />

          {/* Axis lines */}
          <line x1="12" y1="250" x2="488" y2="250" stroke="rgba(237,232,220,0.035)" strokeWidth="1" />
          <line x1="250" y1="12" x2="250" y2="488" stroke="rgba(237,232,220,0.035)" strokeWidth="1" />

          {/* Tick marks at compass points */}
          <line x1="250" y1="4"   x2="250" y2="22"  stroke="rgba(245,184,0,0.55)"   strokeWidth="1.5" strokeLinecap="round" />
          <line x1="478" y1="250" x2="496" y2="250" stroke="rgba(61,79,196,0.55)"   strokeWidth="1.5" strokeLinecap="round" />
          <line x1="250" y1="478" x2="250" y2="496" stroke="rgba(232,69,60,0.5)"    strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4"   y1="250" x2="22"  y2="250" stroke="rgba(160,126,212,0.5)"  strokeWidth="1.5" strokeLinecap="round" />

          {/* Dots at compass edges */}
          <circle cx="250" cy="12"  r="2.5" fill="rgba(245,184,0,0.65)" />
          <circle cx="488" cy="250" r="2.5" fill="rgba(61,79,196,0.65)" />
          <circle cx="250" cy="488" r="2.5" fill="rgba(232,69,60,0.55)" />
          <circle cx="12"  cy="250" r="2.5" fill="rgba(160,126,212,0.55)" />

          {/* 45° corner dots on outer ring */}
          <circle cx="418" cy="82"  r="1.5" fill="rgba(237,232,220,0.15)" />
          <circle cx="82"  cy="82"  r="1.5" fill="rgba(237,232,220,0.15)" />
          <circle cx="418" cy="418" r="1.5" fill="rgba(237,232,220,0.15)" />
          <circle cx="82"  cy="418" r="1.5" fill="rgba(237,232,220,0.15)" />

          {/* Center crosshair */}
          <line x1="232" y1="250" x2="268" y2="250" stroke="rgba(237,232,220,0.2)" strokeWidth="1" />
          <line x1="250" y1="232" x2="250" y2="268" stroke="rgba(237,232,220,0.2)" strokeWidth="1" />
          <circle cx="250" cy="250" r="10" stroke="rgba(160,126,212,0.22)" strokeWidth="1" />
          <circle cx="250" cy="250" r="3"  fill="rgba(160,126,212,0.65)" />
        </svg>
      </motion.div>
      

      {/* ── Main grid ───────────────────────────────────────── */}
      <div className="hero-main">
        {/* Left col */}
        <div className="hero-left">
          {/* Role tag */}
          <motion.div
            className="hero-role-tag"
            initial={{ opacity: 0 }}
            animate={started ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <span className="hero-role-dot" />
            Software Developer
          </motion.div>

          {/* Name */}
          <h1 className="hero-headline">
            <div style={{ overflow: "hidden" }}>
              <motion.span
                className="hero-name-first"
                initial={{ y: "110%", opacity: 0 }}
                animate={started ? { y: "0%", opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.25, ease }}
                style={{ display: "block" }}
              >
                Gabriel
              </motion.span>
            </div>
            <div style={{ overflow: "hidden" }}>
              <motion.span
                className="hero-name-last"
                initial={{ y: "108%", filter: "blur(12px)" }}
                animate={started ? { y: "0%", filter: "blur(0px)" } : {}}
                transition={{ duration: 1.0, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: "block" }}
              >
                Glatz
              </motion.span>
            </div>
          </h1>

          {/* Stripe bar */}
          <div className="hero-stripes">
            {STRIPES.map((color, i) => (
              <motion.span
                key={color}
                className="hero-stripe"
                style={{ background: color }}
                initial={{ scaleX: 0 }}
                animate={started ? { scaleX: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.62 + i * 0.07, ease }}
              />
            ))}
          </div>

          {/* Desc */}
          <motion.p
            className="hero-desc"
            initial={{ opacity: 0, y: 8 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.82, ease }}
          >
            Interfaces modernas do design ao deploy —{" "}
            <span style={{ color: "var(--fg)", opacity: 0.6 }}>
              React · TypeScript · Node.js
            </span>
          </motion.p>
        </div>

        {/* Right col */}
        <div className="hero-right">
          {/* Available badge */}
          <motion.div
            className="hero-available"
            initial={{ opacity: 0 }}
            animate={started ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <span className="hero-available__dot" />
            Disponível
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.85, ease }}
          >
            <a href="#contato" className="hero-cta">
              <span>Vamos conversar</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
              >
                <path
                  d="M1 13L13 1M13 1H5M13 1V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── Marquee ─────────────────────────────────────────── */}
      <motion.div
        className="marquee-wrap"
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        <div className="marquee-track">
          {MARQUEE.map((skill, i) => (
            <span key={i} className="marquee-item">
              {skill}
              <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
