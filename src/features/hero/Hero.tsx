"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SKILLS_MARQUEE = [
  "React",
  "TypeScript",
  "Node.js",
  "Next.js",
  "Tailwind CSS",
  "SQL",
  "REST APIs",
  "UI/UX Design",
  "React",
  "TypeScript",
  "Node.js",
  "Next.js",
  "Tailwind CSS",
  "SQL",
  "REST APIs",
  "UI/UX Design",
];

function SplitWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "block", overflow: "hidden" }}
    >
      <motion.span
        style={{ display: "block" }}
        initial={{ y: "105%" }}
        animate={inView ? { y: "0%" } : { y: "105%" }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.span>
    </span>
  );
}

export default function Hero({ started }: { started: boolean }) {
  const ref = useRef(null);

  return (
    <section className="hero-section" ref={ref}>
      {/* Top nav bar */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={started ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
        style={{
          position: "absolute",
          top: "2rem",
          left: "2.5rem",
          right: "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#6a6a7a",
          }}
        >
          Gabriel Glatz — 2026
        </span>
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {["Sobre", "Skills", "Projetos", "Contato"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#6a6a7a",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
            >
              {item}
            </a>
          ))}
        </div>
      </motion.nav>

      {/* Eyebrow */}
      <motion.p
        className="hero-eyebrow"
        initial={{ opacity: 0, y: 12 }}
        animate={started ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        Jaraguá do Sul, SC — Disponível para novos projetos
      </motion.p>

      {/* Main headline */}
      <h1 className="hero-headline">
        <SplitWords text="Gabriel" delay={started ? 0.35 : 99} />
        <SplitWords
          text="Glatz"
          className="spaced"
          delay={started ? 0.5 : 99}
        />
      </h1>

      {/* Bottom row */}
      <div className="hero-bottom">
        <motion.p
          className="hero-desc"
          initial={{ opacity: 0, y: 16 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.75 }}
        >
          Desenvolvedor de Software especializado em criar experiências web
          modernas. React · TypeScript · Node.js — do design ao deploy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <a href="#contato" className="hero-cta">
            <span>Vamos conversar</span>
            <svg
              width="14"
              height="14"
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

      {/* Marquee strip */}
      <motion.div
        className="marquee-wrap"
        style={{
          marginTop: "4rem",
          marginLeft: "-2.5rem",
          marginRight: "-2.5rem",
        }}
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="marquee-track">
          {SKILLS_MARQUEE.map((skill, i) => (
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
