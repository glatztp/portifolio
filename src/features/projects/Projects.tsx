"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValueEvent,
} from "framer-motion";

const PROJECTS = [
  {
    num: "01",
    title: "E-Commerce",
    sub: "Loja Online",
    tech: ["React", "Node.js", "SQL", "REST API"],
    desc: "Plataforma de e-commerce completa com painel admin, carrinho, checkout e integração com pagamentos.",
    year: "2025",
    link: "#",
    colorA: "#a07ed4",
    colorB: "#6b3fa0",
  },
  {
    num: "02",
    title: "Dashboard",
    sub: "Analytics",
    tech: ["React", "TypeScript", "Recharts", "Node.js"],
    desc: "Dashboard de analytics com gráficos interativos, relatórios em tempo real e exportação de dados.",
    year: "2025",
    link: "#",
    colorA: "#4fa8d4",
    colorB: "#1a5c8a",
  },
  {
    num: "03",
    title: "Landing Page",
    sub: "Produto SaaS",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    desc: "Landing page de alta conversão para produto SaaS com animações, depoimentos e CTA estratégico.",
    year: "2024",
    link: "#",
    colorA: "#d47e4f",
    colorB: "#8a3a1a",
  },
  {
    num: "04",
    title: "App Mobile",
    sub: "React Native",
    tech: ["React Native", "Expo", "Firebase"],
    desc: "Aplicativo mobile de gerenciamento de tarefas com sincronização em tempo real e notificações push.",
    year: "2024",
    link: "#",
    colorA: "#4fd4a0",
    colorB: "#1a6b50",
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

function MobileProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.article
      ref={ref}
      className="project-card-mobile"
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        className="pcm__img"
        style={
          {
            "--ca": project.colorA,
            "--cb": project.colorB,
          } as React.CSSProperties
        }
      >
        <svg
          className="pcm__blob"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M44.5,-62.7C56.5,-52.6,63.7,-37.4,68.3,-21.4C72.9,-5.4,74.8,11.4,69.6,25.9C64.4,40.4,52.1,52.6,37.8,61.1C23.4,69.6,7,74.4,-9.8,73.5C-26.6,72.6,-43.8,65.9,-56.5,54.4C-69.2,42.8,-77.4,26.3,-78.2,9.4C-79.1,-7.5,-72.6,-24.8,-62.2,-38.6C-51.8,-52.4,-37.5,-62.7,-22.3,-70.3C-7,-77.9,9.2,-82.8,23.7,-78.5C38.3,-74.2,51.4,-60.7,44.5,-62.7Z"
            transform="translate(100 100)"
          />
        </svg>
        <span className="pcm__num">{project.num}</span>
        <a href={project.link} className="pcm__link-btn">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 13L13 1M13 1H5M13 1V9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Ver Projeto
        </a>
      </div>
      <div className="pcm__body">
        <div className="pcm__meta">
          <span className="pcm__sub">{project.sub}</span>
          <span className="pcm__year">{project.year}</span>
        </div>
        <h3 className="pcm__title">{project.title}</h3>
        <p className="pcm__desc">{project.desc}</p>
        <div className="pcm__tags">
          {project.tech.map((t) => (
            <span key={t} className="pcm__tag">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(
      PROJECTS.length - 1,
      Math.floor(v * PROJECTS.length + 0.5),
    );
    setActiveIndex(idx);
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(PROJECTS.length - 1) * 34}vw`],
  );

  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-80px" });

  return (
    <section id="projetos" className="projects-section">
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
          {isMobile ? "Role para ver mais ↓" : "Role para explorar →"}
        </motion.p>
      </div>

      {/* ── MOBILE: vertical cards ── */}
      {isMobile && (
        <div className="projects-mobile-list">
          {PROJECTS.map((p, i) => (
            <MobileProjectCard key={p.num} project={p} index={i} />
          ))}
        </div>
      )}

      {/* ── DESKTOP: horizontal scroll ── */}
      {!isMobile && (
        <div
          ref={containerRef}
          style={{ height: `${PROJECTS.length * 100}vh` }}
          className="projects-scroll-container"
        >
          <div className="projects-sticky">
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
            {/* Progress dots */}
            <div className="projects-dots">
              {PROJECTS.map((p, i) => (
                <div
                  key={p.num}
                  className={`projects-dot${i === activeIndex ? " projects-dot--active" : ""}`}
                />
              ))}
            </div>
            {/* Counter */}
            <div className="projects-counter">
              <span className="projects-counter__current">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className="projects-counter__sep" />
              <span className="projects-counter__total">
                {String(PROJECTS.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      )}
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
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, start - 0.05), start + 0.05, end - 0.05, end],
    [0.25, 1, 1, 0.25],
  );
  const scale = useTransform(
    scrollYProgress,
    [Math.max(0, start - 0.05), start + 0.08],
    [0.93, 1],
  );

  return (
    <motion.article className="project-card" style={{ opacity, scale }}>
      <div className="project-card__top">
        <span className="project-card__num">{project.num}</span>
        <span className="project-card__year">{project.year}</span>
      </div>
      <div
        className="project-card__img"
        style={
          {
            "--ca": project.colorA,
            "--cb": project.colorB,
          } as React.CSSProperties
        }
      >
        <div className="project-card__img-inner">
          <svg
            className="project-card__blob"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M44.5,-62.7C56.5,-52.6,63.7,-37.4,68.3,-21.4C72.9,-5.4,74.8,11.4,69.6,25.9C64.4,40.4,52.1,52.6,37.8,61.1C23.4,69.6,7,74.4,-9.8,73.5C-26.6,72.6,-43.8,65.9,-56.5,54.4C-69.2,42.8,-77.4,26.3,-78.2,9.4C-79.1,-7.5,-72.6,-24.8,-62.2,-38.6C-51.8,-52.4,-37.5,-62.7,-22.3,-70.3C-7,-77.9,9.2,-82.8,23.7,-78.5C38.3,-74.2,51.4,-60.7,44.5,-62.7Z"
              transform="translate(100 100)"
            />
          </svg>
          <span className="project-card__big-num">{project.num}</span>
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
      <div className="project-card__info">
        <div>
          <p className="project-card__sub">{project.sub}</p>
          <h3 className="project-card__title">{project.title}</h3>
          <p className="project-card__desc">{project.desc}</p>
        </div>
        <div className="project-card__bottom">
          <div className="project-card__tech">
            {project.tech.map((t) => (
              <span key={t} className="project-card__tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
