"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const JOBS = [
  {
    period: "2025 â€” Presente",
    type: "Tempo Integral",
    title: "Desenvolvedor de Sistemas Jr",
    company: "Grupo Malwee",
    location: "JaraguÃ¡ do Sul, SC",
    desc: "AtuaÃ§Ã£o como Desenvolvedor de Sistemas Jr, contribuindo para aplicaÃ§Ãµes internas e melhorias em plataformas web.",
    highlights: [
      "Onboarding tÃ©cnico e contribuiÃ§Ã£o para features internas",
      "ParticipaÃ§Ã£o em revisÃ£o de cÃ³digo e correÃ§Ãµes de bugs",
      "Aprimoramento de processos de deploy e CI",
    ],
  },
  {
    period: "2024 â€” 2025",
    type: "Meio PerÃ­odo",
    title: "Desenvolvedor de Software",
    company: "Grupo Malwee",
    location: "JaraguÃ¡ do Sul, SC",
    desc: "Desenvolvimento de aplicaÃ§Ãµes web modernas e sistemas internos utilizando React, TypeScript e Node.js.",
    highlights: [
      "Interfaces responsivas com React e Tailwind CSS",
      "APIs RESTful com Node.js e integraÃ§Ã£o SQL",
      "OtimizaÃ§Ãµes de performance e UX",
    ],
  },
  {
    period: "2023 â€” Presente",
    type: "Freelancer",
    title: "Desenvolvedor Web Freelancer",
    company: "Freelancer",
    location: "Remoto",
    desc: "Desenvolvimento de sites e aplicaÃ§Ãµes web para diversos clientes, focando em soluÃ§Ãµes eficientes e design responsivo.",
    highlights: [
      "5+ sites responsivos com React",
      "SoluÃ§Ãµes customizadas com JavaScript",
      "ManutenÃ§Ã£o e otimizaÃ§Ã£o de sites",
    ],
  },
];

const EDUCATION = [
  {
    period: "2024 â€” 2025",
    type: "TÃ©cnico",
    title: "TÃ©cnico em Desenvolvimento de Sistemas",
    company: "SENAI",
    location: "JaraguÃ¡ do Sul, SC",
    desc: "FormaÃ§Ã£o tÃ©cnica completa em desenvolvimento de sistemas.",
    highlights: [
      "Java, JavaScript, Python e C#",
      "Projetos web e mobile",
      "Metodologias Ã¡geis",
    ],
  },
];

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

  return (
    <div ref={ref} className="timeline-item">
      {!isLast && (
        <div className="timeline-line">
          <motion.div
            className="timeline-line__fill"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      )}
      <motion.div
        className="timeline-dot"
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{
          duration: 0.4,
          delay: index * 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
      <motion.div
        className="timeline-content"
        initial={{ opacity: 0, x: -24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{
          duration: 0.8,
          delay: index * 0.08 + 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="timeline-meta">
          <span className="timeline-period">{item.period}</span>
          <span className="timeline-type">{item.type}</span>
        </div>
        <h3 className="timeline-title">{item.title}</h3>
        <p className="timeline-company">
          {item.company} â€” <span>{item.location}</span>
        </p>
        <p className="timeline-desc">{item.desc}</p>
        <ul className="timeline-highlights">
          {item.highlights.map((h) => (
            <li key={h}>
              <span className="timeline-bullet" />
              {h}
            </li>
          ))}
        </ul>
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
  return (
    <section id="experiencia" className="experience-section">
      <div className="section-label">
        <span className="section-label__num">05</span>
        <span className="section-label__text">ExperiÃªncia</span>
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            ExperiÃªncia Profissional
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            EducaÃ§Ã£o
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
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="timeline-dot"
              style={{
                position: "relative",
                transform: "none",
                top: "auto",
                left: "auto",
                marginBottom: "1rem",
              }}
            />
            <p className="learning-card__title">Aprendizado ContÃ­nuo</p>
            <p className="learning-card__desc">
              Sempre expandindo conhecimentos atravÃ©s de cursos, certificaÃ§Ãµes e
              projetos prÃ¡ticos. Atualmente focando em padrÃµes avanÃ§ados do
              React, cloud e prÃ¡ticas modernas de desenvolvimento.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
