"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const STATS = [
  { value: "5+", label: "Projetos ConcluÃ­dos" },
  { value: "2+", label: "Anos de ExperiÃªncia" },
  { value: "100%", label: "SatisfaÃ§Ã£o do Cliente" },
  { value: "âˆž", label: "XÃ­caras de CafÃ©" },
];

const VALUES = [
  {
    icon: "01",
    title: "InovaÃ§Ã£o em Primeiro",
    desc: "Sempre explorando tecnologias de ponta e soluÃ§Ãµes criativas para entregar resultados excepcionais.",
  },
  {
    icon: "02",
    title: "Design Centrado",
    desc: "Cada interface criada com a experiÃªncia do usuÃ¡rio como prioridade mÃ¡xima.",
  },
  {
    icon: "03",
    title: "CÃ³digo Limpo",
    desc: "CÃ³digo sustentÃ¡vel, escalÃ¡vel e bem documentado que resiste ao teste do tempo.",
  },
  {
    icon: "04",
    title: "Aprendizado ContÃ­nuo",
    desc: "Constantemente aprendendo novas tecnologias e melhores prÃ¡ticas.",
  },
];

function RevealLine({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} style={{ overflow: "hidden" }} className={className}>
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

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="sobre" className="about-section" ref={sectionRef}>
      <div className="section-label">
        <span className="section-label__num">02</span>
        <span className="section-label__text">Sobre</span>
      </div>
      <div className="about-grid">
        <div className="about-text-col">
          <RevealLine>
            <h2 className="about-heading">Dev que entrega</h2>
          </RevealLine>
          <RevealLine delay={0.08}>
            <h2 className="about-heading about-heading--accent">
              experiÃªncias
            </h2>
          </RevealLine>
          <RevealLine delay={0.16}>
            <h2 className="about-heading about-heading--outline">reais.</h2>
          </RevealLine>

          <FadeIn delay={0.3}>
            <p className="about-desc">
              Sou um desenvolvedor de software especializado em criar aplicaÃ§Ãµes
              web modernas e responsivas. Com experiÃªncia em React, TypeScript e
              Node.js, foco em entregar soluÃ§Ãµes que combinam funcionalidade
              excepcional com experiÃªncias intuitivas.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="about-desc" style={{ marginTop: "1rem" }}>
              Quando nÃ£o estou codificando, exploro novas tecnologias e
              contribuo para projetos open-source.
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <a href="#contato" className="about-cta">
              <span>Diga OlÃ¡</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 13L13 1M13 1H5M13 1V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </FadeIn>
        </div>
        <div className="about-right-col">
          <div className="about-img-wrap">
            <motion.div className="about-img-inner" style={{ y: imgY }}>
              <div className="about-img-placeholder">
                <span>GG</span>
              </div>
            </motion.div>
            <div className="about-img-tag">
              <span className="about-img-tag__dot" />
              DisponÃ­vel para projetos
            </div>
          </div>
        </div>
      </div>
      <div className="about-stats">
        {STATS.map((s, i) => (
          <FadeIn key={s.label} delay={0.1 * i}>
            <div className="about-stat">
              <span className="about-stat__value">{s.value}</span>
              <span className="about-stat__label">{s.label}</span>
            </div>
          </FadeIn>
        ))}
      </div>
      <div className="about-values">
        <FadeIn>
          <p className="about-values-title">Meus Valores</p>
        </FadeIn>
        <div className="about-values-grid">
          {VALUES.map((v, i) => (
            <FadeIn key={v.title} delay={0.1 * i}>
              <div className="value-card">
                <span className="value-card__num">{v.icon}</span>
                <h3 className="value-card__title">{v.title}</h3>
                <p className="value-card__desc">{v.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
