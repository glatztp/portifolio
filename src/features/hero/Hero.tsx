"use client";

import { motion } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";
import ThemeToggle from "@/components/ThemeToggle";

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
      <motion.nav
        className="hero-nav"
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.1 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span className="hero-nav__brand">
          <ThemeToggle />
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
        </div>
      </motion.nav>
      <div className="hero-main">
        <div className="hero-left">
          <motion.div
            className="hero-role-tag"
            initial={{ opacity: 0 }}
            animate={started ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <span className="hero-role-dot" />
            Software Developer
          </motion.div>
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
                transition={{
                  duration: 1.0,
                  delay: 0.38,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ display: "block" }}
              >
                Glatz
              </motion.span>
            </div>
          </h1>
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
          <motion.p
            className="hero-desc"
            initial={{ opacity: 0, y: 8 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.82, ease }}
          >
            Interfaces modernas do design ao deploy –{" "}
            <span style={{ color: "var(--fg)", opacity: 0.6 }}>
              React · TypeScript · Node.js
            </span>
          </motion.p>
        </div>
        <div className="hero-right">
          <motion.div
            className="hero-available"
            initial={{ opacity: 0 }}
            animate={started ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <span className="hero-available__dot" />
            Disponível
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.85, ease }}
          >
            <MagneticButton>
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
            </MagneticButton>
          </motion.div>
        </div>
      </div>
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
