"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const JOBS = [
  {
    period: "2025 – Presente",
    type: "Tempo Integral",
    title: "Desenvolvedor de Sistemas Jr",
    company: "Grupo Malwee",
    location: "Jaraguá do Sul, SC",
    desc: "Atuação como Desenvolvedor de Sistemas Jr, contribuindo para aplicações internas e melhorias em plataformas web.",
    highlights: [
      "Onboarding técnico e contribuição para features internas",
      "Participação em revisão de código e correções de bugs",
      "Aprimoramento de processos de deploy e CI",
    ],
  },
  {
    period: "2024 – 2025",
    type: "Meio Período",
    title: "Jovem Aprendiz em Desenvolvimento de Sistemas",
    company: "Grupo Malwee",
    location: "Jaraguá do Sul, SC",
    desc: "Desenvolvimento de aplicações web modernas e sistemas internos utilizando React, TypeScript e Node.js.",
    highlights: [
      "Interfaces responsivas com React e Tailwind CSS",
      "APIs RESTful com Node.js",
      "Otimizações de performance e UX",
    ],
  },
  {
    period: "2023 – Presente",
    type: "Freelancer",
    title: "Desenvolvedor Web Freelancer",
    company: "Freelancer",
    location: "Remoto",
    desc: "Desenvolvimento de sites e aplicações web para diversos clientes, focando em soluções eficientes e design responsivo.",
    highlights: [
      "5+ sites responsivos com React",
      "Soluções customizadas com JavaScript",
      "Manutenção e otimização de sites",
    ],
  },
];

const EDUCATION = [
  {
    period: "2024 – 2025",
    type: "Técnico",
    title: "Técnico em Desenvolvimento de Sistemas",
    company: "SENAI",
    location: "Jaraguá do Sul, SC",
    desc: "Formação técnica completa em desenvolvimento de sistemas.",
    highlights: [
      "Java, JavaScript, Python e C#",
      "Projetos web e mobile",
      "Metodologias ágeis",
    ],
  },
];

const highlightVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const highlightItem = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

function TimelineItem({
  item,
  index,
  isLast,
}: {
  item: (typeof JOBS)[0];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const baseDelay = index * 0.12;
  const cardNum = String(index + 1).padStart(2, "0");

  return (
    <div ref={ref} className="timeline-item">
      {/* Left track: dot + vertical line */}
      <div className="timeline-track">
        <motion.div
          className="timeline-dot-outer"
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: baseDelay, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            style={{
              position: "absolute",
              inset: -5,
              borderRadius: "50%",
              border: "1px solid rgba(160,126,212,0.5)",
            }}
            initial={{ scale: 0.7, opacity: 0.8 }}
            animate={inView ? { scale: 2.2, opacity: 0 } : {}}
            transition={{ duration: 1.4, delay: baseDelay + 0.3, ease: "easeOut" }}
          />
          <div className="timeline-dot-inner" />
        </motion.div>

        {!isLast && (
          <div className="timeline-line">
            <motion.div
              className="timeline-line__fill"
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.6, delay: baseDelay + 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        )}
      </div>

      {/* Card */}
      <motion.div
        className="timeline-content"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.75,
          delay: baseDelay + 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={{
          y: -3,
          transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        {/* Ghost number in bg */}
        <span className="timeline-card-num" aria-hidden>
          {cardNum}
        </span>

        <motion.div
          className="timeline-meta"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: baseDelay + 0.22 }}
        >
          <span className="timeline-period">{item.period}</span>
          <span className="timeline-type">{item.type}</span>
        </motion.div>

        <h3 className="timeline-title">{item.title}</h3>
        <div className="timeline-org">
          <span className="timeline-company-name">{item.company}</span>
          <span className="timeline-location">{item.location}</span>
        </div>
        <p className="timeline-desc">{item.desc}</p>

        <motion.ul
          className="timeline-highlights"
          variants={highlightVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {item.highlights.map((h) => (
            <motion.li key={h} variants={highlightItem}>
              <span className="timeline-bullet" />
              {h}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
}

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

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bigNumY = useTransform(scrollYProgress, [0, 0.6], ["20px", "-60px"]);
  const bigNumOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.55, 0.7],
    [0, 0.06, 0.06, 0],
  );

  return (
    <section id="experiencia" className="experience-section" ref={sectionRef}>
      <motion.span
        className="experience-bg-number"
        style={{ y: bigNumY, opacity: bigNumOpacity }}
        aria-hidden
      >
        05
      </motion.span>
      <div className="section-label">
        <span className="section-label__num">05</span>
        <span className="section-label__text">Experiência</span>
      </div>

      <div className="experience-heading-wrap">
        <RevealLine>
          <h2 className="experience-heading">Jornada</h2>
        </RevealLine>
        <RevealLine delay={0.1}>
          <h2 className="experience-heading experience-heading--accent">
            Profissional
          </h2>
        </RevealLine>
      </div>

      <div className="experience-grid">
        <div>
          <motion.p
            className="experience-col-label"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Experiência Profissional
          </motion.p>
          <div className="timeline">
            {JOBS.map((job, i) => (
              <TimelineItem
                key={job.title + job.period}
                item={job}
                index={i}
                isLast={i === JOBS.length - 1}
              />
            ))}
          </div>
        </div>
        <div>
          <motion.p
            className="experience-col-label"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Educação
          </motion.p>
          <div className="timeline">
            {EDUCATION.map((edu, i) => (
              <TimelineItem
                key={edu.title}
                item={edu}
                index={i}
                isLast={true}
              />
            ))}
          </div>
          <motion.div
            className="learning-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{
              y: -3,
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
            }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="learning-card__icon">✦</div>
            <p className="learning-card__title">Aprendizado Contínuo</p>
            <p className="learning-card__desc">
              Sempre expandindo conhecimentos através de cursos, certificações e
              projetos práticos. Atualmente focando em padrões avançados do
              React, cloud e práticas modernas de desenvolvimento.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
