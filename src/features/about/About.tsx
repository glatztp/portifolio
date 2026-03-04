"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

const STATS = [
  { value: "5+", label: "Projetos Concluídos" },
  { value: "2+", label: "Anos de Experiência" },
  { value: "100%", label: "Satisfação do Cliente" },
  { value: "∞", label: "Xícaras de Café" },
];

const VALUES = [
  {
    icon: "01",
    title: "Inovação em Primeiro",
    desc: "Sempre explorando tecnologias de ponta e soluções criativas para entregar resultados excepcionais.",
  },
  {
    icon: "02",
    title: "Design Centrado",
    desc: "Cada interface criada com a experiência do usuário como prioridade máxima.",
  },
  {
    icon: "03",
    title: "Código Limpo",
    desc: "Código sustentável, escalável e bem documentado que resiste ao teste do tempo.",
  },
  {
    icon: "04",
    title: "Aprendizado Contínuo",
    desc: "Constantemente aprendendo novas tecnologias e melhores práticas.",
  },
];

function RevealLine({
  children,
  delay = 0,
  className = "",
  overflowVisible = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  overflowVisible?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div
      ref={ref}
      style={
        overflowVisible
          ? { clipPath: "inset(-1em 0 0 0)" }
          : { overflow: "hidden" }
      }
      className={className}
    >
      <motion.div
        initial={{ y: "110%", skewY: 3 }}
        animate={inView ? { y: "0%", skewY: 0 } : {}}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
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
  fromX = 0,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  fromX?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24, x: fromX, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ target }: { target: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const num = parseInt(target, 10);
  const isNumeric = !isNaN(num);
  const suffix = target.replace(/[0-9]/g, "");
  const [displayed, setDisplayed] = useState(isNumeric ? "0" : target);

  useEffect(() => {
    if (!inView || !isNumeric) return;
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = num / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= num) {
        setDisplayed(num + suffix);
        clearInterval(timer);
      } else {
        setDisplayed(Math.floor(start) + suffix);
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, isNumeric, num, suffix]);

  return <span ref={ref}>{displayed}</span>;
}

export default function About() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const headingX = useTransform(scrollYProgress, [0, 0.5], ["0%", "-2%"]);

  const smoothImgY = useSpring(imgY, { stiffness: 60, damping: 18 });
  const smoothHeadingX = useSpring(headingX, { stiffness: 50, damping: 22 });

  const bigNumY = useTransform(scrollYProgress, [0, 0.6], ["20px", "-60px"]);
  const bigNumOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.55, 0.7],
    [0, 0.06, 0.06, 0],
  );

  return (
    <section id="sobre" className="about-section" ref={sectionRef}>
      <motion.span
        className="about-bg-number"
        style={{ y: bigNumY, opacity: bigNumOpacity }}
        aria-hidden
      >
        02
      </motion.span>

      <div className="section-label">
        <span className="section-label__num">02</span>
        <span className="section-label__text">Sobre</span>
      </div>
      <div className="about-grid">
        <div className="about-text-col">
          <motion.div
            className="about-heading-group"
            style={{ x: smoothHeadingX }}
          >
            <RevealLine>
              <h2 className="about-heading">Dev que entrega</h2>
            </RevealLine>
            <RevealLine delay={0.1} overflowVisible>
              <h2 className="about-heading about-heading--accent">
                experiências
              </h2>
            </RevealLine>
            <RevealLine delay={0.2}>
              <h2 className="about-heading about-heading--outline">reais.</h2>
            </RevealLine>
          </motion.div>

          <FadeIn delay={0.3}>
            <p className="about-desc">
              Sou um desenvolvedor de software especializado em criar aplicações
              web modernas e responsivas. Com experiência em React, TypeScript e
              Node.js, foco em entregar soluções que combinam funcionalidade
              excepcional com experiências intuitivas.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="about-desc" style={{ marginTop: "1rem" }}>
              Quando não estou codificando, exploro novas tecnologias e
              contribuo para projetos open-source.
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <a href="#contato" className="about-cta">
              <span>Diga Olá</span>
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

        {/* <div className="about-right-col">
          <FadeIn delay={0.2} fromX={30}>
            <div className="about-img-wrap">
              <span className="about-img-corner about-img-corner--tl" />
              <span className="about-img-corner about-img-corner--br" />

              <motion.div className="about-img-inner" style={{ y: smoothImgY }}>
                 <Image
                  src="/profile.png"
                  alt="Foto de perfil"
                  width={380}
                  height={507}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                  priority
                /> 
                <div className="about-img-overlay" />
              </motion.div>

              <div className="about-img-tag">
                <span className="about-img-tag__dot" />
                Disponível para projetos
              </div>
            </div>
          </FadeIn>
        </div> */}
      </div>

      <div className="about-stats">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            className="about-stat"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.7,
              delay: 0.08 * i,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className="about-stat__value">
              <CountUp target={s.value} />
            </span>
            <span className="about-stat__label">{s.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="about-values">
        <FadeIn>
          <p className="about-values-title">Meus Valores</p>
        </FadeIn>
        <div className="about-values-grid">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              className="value-card"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.75,
                delay: 0.1 * i,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
            >
              <span className="value-card__num">{v.icon}</span>
              <h3 className="value-card__title">{v.title}</h3>
              <p className="value-card__desc">{v.desc}</p>
              <motion.span
                className="value-card__bar"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 * i + 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
