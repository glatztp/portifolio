"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const PROJECTS = [
  {
    num: "01",
    title: "Portfolio",
    sub: "Este Site",
    tech: ["Next.js", "TypeScript", "Framer Motion", "Tailwind CSS"],
    desc: "Portfólio pessoal com animações de scroll, loading screen e design inspirado nos melhores sites do Awwwards.",
    year: "2026",
    link: "#",
  },
  {
    num: "02",
    title: "E-Commerce",
    sub: "Loja Online",
    tech: ["React", "Node.js", "SQL", "REST API"],
    desc: "Plataforma de e-commerce completa com painel admin, carrinho, checkout e integração com pagamentos.",
    year: "2025",
    link: "#",
  },
  {
    num: "03",
    title: "Dashboard",
    sub: "Analytics",
    tech: ["React", "TypeScript", "Recharts", "Node.js"],
    desc: "Dashboard de analytics com gráficos interativos, relatórios em tempo real e exportação de dados.",
    year: "2025",
    link: "#",
  },
  {
    num: "04",
    title: "Landing Page",
    sub: "Produto SaaS",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    desc: "Landing page de alta conversão para produto SaaS com animações, depoimentos e CTA estratégico.",
    year: "2024",
    link: "#",
  },
  {
    num: "05",
    title: "App Mobile",
    sub: "React Native",
    tech: ["React Native", "Expo", "Firebase"],
    desc: "Aplicativo mobile de gerenciamento de tarefas com sincronização em tempo real e notificações push.",
    year: "2024",
    link: "#",
  },
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

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // sticky horizontal scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // translate from 0 to -(total width - viewport). Each card ~420px + gap.
  // 5 cards: translate to roughly -(5-1) * 460px = -1840px adjusted by vw
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(PROJECTS.length - 1) * 34}vw`],
  );

  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-80px" });

  return (
    <section id="projetos" className="projects-section">
      {/* Section header — normal flow, above sticky */}
      <div className="projects-header" ref={titleRef}>
        <div className="section-label">
          <span className="section-label__num">03</span>
          <span className="section-label__text">Projetos</span>
        </div>
        <div className="projects-title-wrap">
          <RevealLine>
            <h2 className="projects-heading">Projetos em</h2>
          </RevealLine>
          <RevealLine delay={0.1}>
            <h2 className="projects-heading projects-heading--accent">
              Destaque
            </h2>
          </RevealLine>
        </div>
        <motion.p
          className="projects-subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          Role para explorar →
        </motion.p>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={containerRef}
        style={{ height: `${PROJECTS.length * 100}vh` }}
        className="projects-scroll-container"
      >
        <div className="projects-sticky">
          {/* Side label rotated */}
          <div className="projects-side-label">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i}>WORK&nbsp;&nbsp;</span>
            ))}
          </div>

          {/* Cards track */}
          <motion.div className="projects-track" style={{ x }}>
            {PROJECTS.map((p, i) => (
              <ProjectCard
                key={p.num}
                project={p}
                index={i}
                scrollYProgress={scrollYProgress}
                total={PROJECTS.length}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  scrollYProgress,
  total,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  total: number;
}) {
  // each card fades in as its segment becomes active
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, start - 0.05), start + 0.05, end - 0.05, end],
    [0.3, 1, 1, 0.3],
  );
  const scale = useTransform(
    scrollYProgress,
    [Math.max(0, start - 0.05), start + 0.08],
    [0.94, 1],
  );

  return (
    <motion.article className="project-card" style={{ opacity, scale }}>
      {/* Card top */}
      <div className="project-card__top">
        <span className="project-card__num">{project.num}</span>
        <span className="project-card__year">{project.year}</span>
      </div>

      {/* Image placeholder */}
      <div className="project-card__img">
        <div className="project-card__img-inner">
          <span>{project.num}</span>
        </div>
        <a href={project.link} className="project-card__overlay">
          <span>Ver Projeto</span>
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 13L13 1M13 1H5M13 1V9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      {/* Card info */}
      <div className="project-card__info">
        <div>
          <p className="project-card__sub">{project.sub}</p>
          <h3 className="project-card__title">{project.title}</h3>
          <p className="project-card__desc">{project.desc}</p>
        </div>
        <div className="project-card__tech">
          {project.tech.map((t) => (
            <span key={t} className="project-card__tag">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
