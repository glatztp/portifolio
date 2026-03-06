"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const CATEGORIES = [
  {
    label: "Frontend",
    icon: "◈",
    color: "#a07ed4",
    desc: "Interfaces modernas, responsivas e animadas com foco em UX.",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML / CSS",
      "Tailwind CSS",
      "Framer Motion",
    ],
  },
  {
    label: "Backend",
    icon: "◉",
    color: "#4fa8d4",
    desc: "APIs REST, banco de dados e lógica de negócio no servidor.",
    skills: ["Node.js", "REST APIs", "SQL"],
  },
  {
    label: "Ferramentas",
    icon: "◆",
    color: "#d47e4f",
    desc: "Fluxo de trabalho do código ao deploy com as ferramentas certas.",
    skills: ["Git / GitHub", "Figma", "VS Code", "Vercel"],
  },
];

const MARQUEE_ITEMS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "HTML / CSS",
  "Tailwind CSS",
  "Framer Motion",
  "Node.js",
  "REST APIs",
  "SQL",
  "Git / GitHub",
  "Figma",
  "VS Code",
  "Vercel",
  "Docker",
  "NPM",
];

function RevealLine({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <motion.div
        initial={{ y: "105%" }}
        animate={inView ? { y: "0%" } : {}}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Skills() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="skills" className="skills-section">
      <div className="skills-header-row">
        <span className="skills-header-num" aria-hidden>
          04
        </span>
        <div className="skills-header-content">
          <div className="skills-heading-wrap">
            <RevealLine>
              <h2 className="skills-heading">Stack &</h2>
            </RevealLine>
            <RevealLine delay={0.1}>
              <h2 className="skills-heading skills-heading--accent">
                Tecnologias
              </h2>
            </RevealLine>
          </div>
          <p className="skills-header-desc">
            As tecnologias que uso no dia a dia para construir produtos reais.
          </p>
        </div>
      </div>

      <div className="skills-marquee-area">
        <div className="skills-marquee">
          <div className="skills-marquee__track skills-marquee__track--fwd">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
              <span key={i} className="skills-marquee__item">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category cards ── */}
      <div className="skills-inner">
        <div className="skills-cards">
          {CATEGORIES.map((cat, ci) => (
            <motion.div
              key={cat.label}
              className={`skills-card${hovered === ci ? " skills-card--active" : ""}`}
              style={{ "--cat-color": cat.color } as React.CSSProperties}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: ci * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              onHoverStart={() => setHovered(ci)}
              onHoverEnd={() => setHovered(null)}
            >
              {/* top accent line */}
              <div className="skills-card__line" />

              <div className="skills-card__head">
                <span className="skills-card__icon">{cat.icon}</span>
                <span className="skills-card__label">{cat.label}</span>
                <span className="skills-card__count">
                  {String(cat.skills.length).padStart(2, "0")}
                </span>
              </div>

              <p className="skills-card__desc">{cat.desc}</p>

              <div className="skills-card__chips">
                {cat.skills.map((s, si) => (
                  <motion.span
                    key={s}
                    className="skills-chip"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: ci * 0.06 + si * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
