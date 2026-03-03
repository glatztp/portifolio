"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const CATEGORIES = [
  {
    label: "Frontend",
    skills: [
      { name: "React", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "TypeScript", level: 85 },
      { name: "Tailwind CSS", level: 88 },
      { name: "Framer Motion", level: 75 },
    ],
  },
  {
    label: "Backend",
    skills: [
      { name: "Node.js", level: 80 },
      { name: "REST APIs", level: 82 },
      { name: "SQL", level: 75 },
      { name: "tRPC", level: 70 },
    ],
  },
  {
    label: "Design & Ferramentas",
    skills: [
      { name: "Figma", level: 72 },
      { name: "UI/UX Design", level: 70 },
      { name: "Git / GitHub", level: 85 },
      { name: "Docker", level: 55 },
    ],
  },
];

const TECH_LIST = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Tailwind CSS",
  "Figma",
  "Git",
  "SQL",
  "REST API",
  "tRPC",
  "Framer Motion",
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

function SkillBar({
  name,
  level,
  delay,
}: {
  name: string;
  level: number;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="skill-bar">
      <div className="skill-bar__header">
        <span className="skill-bar__name">{name}</span>
        <motion.span
          className="skill-bar__level"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.5 }}
        >
          {level}%
        </motion.span>
      </div>
      <div className="skill-bar__track">
        <motion.div
          className="skill-bar__fill"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: level / 100 } : {}}
          transition={{
            duration: 1.2,
            delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}

export default function SkillsSection() {
  return (
    <section id="skills" className="skills-section">
      {/* Label */}
      <div className="section-label">
        <span className="section-label__num">04</span>
        <span className="section-label__text">Habilidades</span>
      </div>

      {/* Heading */}
      <div className="skills-heading-wrap">
        <RevealLine>
          <h2 className="skills-heading">Stack &</h2>
        </RevealLine>
        <RevealLine delay={0.1}>
          <h2 className="skills-heading skills-heading--accent">Tecnologias</h2>
        </RevealLine>
      </div>

      {/* Tech bubbles */}
      <div className="skills-bubbles">
        {TECH_LIST.map((t, i) => (
          <motion.span
            key={t}
            className="skill-bubble"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ scale: 1.08, borderColor: "var(--accent)" }}
          >
            {t}
          </motion.span>
        ))}
      </div>

      {/* Category bars */}
      <div className="skills-categories">
        {CATEGORIES.map((cat, ci) => (
          <motion.div
            key={cat.label}
            className="skills-category"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.7,
              delay: ci * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="skills-category__label">{cat.label}</p>
            <div className="skills-category__bars">
              {cat.skills.map((s, si) => (
                <SkillBar
                  key={s.name}
                  name={s.name}
                  level={s.level}
                  delay={ci * 0.08 + si * 0.06}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
