"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const NAV_LINKS = [
  { label: "Sobre", href: "#sobre" },
  { label: "Skills", href: "#skills" },
  { label: "Projetos", href: "#projetos" },
  { label: "Experiência", href: "#experiência" },
  { label: "Contato", href: "#contato" },
];

const SOCIAL = [
  { label: "GitHub", href: "https://github.com/glatztp" },
  { label: "LinkedIn", href: "https://linkedin.com/in/gabriel-glatz" },
];

const EMAIL = "gabriel@email.com";
const LOCATION = "Jaraguá do Sul, SC";
const STRIPES = ["#e8453c", "#f5b800", "#3d4fc4"];

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_BACK = [0.34, 1.56, 0.64, 1] as const;

const boxVariants = {
  hidden: { y: 60, opacity: 0, filter: "blur(8px)" },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE, delay: 0.3 + i * 0.08 },
  }),
};

const letterVariants = {
  hidden: { y: "120%", opacity: 0, rotateX: -40 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    rotateX: 0,
    transition: { duration: 0.65, ease: EASE_BACK, delay: 0.5 + i * 0.065 },
  }),
};

const stripeVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: (i: number) => ({
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: EASE, delay: 0.6 + i * 0.12 },
  }),
};

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: false, amount: 0.12 });

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const gabriel = "GABRIEL".split("");
  const glatz = "GLATZ".split("");

  return (
    <footer ref={footerRef} className="site-footer">
      {/* animated top border */}
      <motion.span
        className="footer-topline"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.1, ease: EASE, delay: 0 }}
      />

      {/* TOP ROW */}
      <div className="footer-top">
        <motion.div
          className="footer-contact-row"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: {} }}
        >
          {[
            {
              href: "#contato",
              icon: (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 21C12 21 5 13.5 5 8.5a7 7 0 0114 0C19 13.5 12 21 12 21z" />
                  <circle cx="12" cy="8.5" r="2.5" />
                </svg>
              ),
              label: LOCATION,
              external: false,
            },
            {
              href: SOCIAL[0].href,
              icon: (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                </svg>
              ),
              label: "GitHub",
              external: true,
            },
            {
              href: SOCIAL[1].href,
              icon: (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              ),
              label: "LinkedIn",
              external: true,
            },
          ].map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              {...(item.external
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
              className="footer-contact-box"
              variants={boxVariants}
              custom={i}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <span className="footer-contact-icon">{item.icon}</span>
              <span className="footer-contact-label">{item.label}</span>
            </motion.a>
          ))}

          <motion.span
            className="footer-contact-box footer-email-box"
            variants={boxVariants}
            custom={3}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <span className="footer-contact-icon">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
              </svg>
            </span>
            <span className="footer-contact-label">{EMAIL}</span>
            <button className="footer-copy-btn" onClick={copyEmail}>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              {copied ? "copiado!" : "copiar"}
            </button>
          </motion.span>
        </motion.div>

        {/* Badge */}
        <motion.div
          className="footer-badge"
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, opacity: 1, rotate: 0 } : {}}
          transition={{ duration: 1, ease: EASE_BACK, delay: 0.4 }}
        >
          <svg className="footer-badge-ring" viewBox="0 0 100 100">
            <defs>
              <path
                id="badge-circle"
                d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              />
            </defs>
            <text fontSize="10" fill="var(--bg)" letterSpacing="3">
              <textPath href="#badge-circle">
                GABRIEL GLATZ DEV PORTFOLIO{" "}
              </textPath>
            </text>
          </svg>
          <span className="footer-badge-center">GG</span>
        </motion.div>
      </div>

      {/* HERO NAME */}
      <div className="footer-hero">
        <div className="footer-name-block">
          {/* Name rows (GABRIEL + GLATZ stacked) */}
          <div className="footer-name-rows">
            <div className="footer-name-letters" aria-label="GABRIEL">
              {gabriel.map((ch, i) => (
                <div key={i} className="footer-letter-clip">
                  <motion.span
                    className="footer-bigname"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={letterVariants}
                    custom={i}
                  >
                    {ch}
                  </motion.span>
                </div>
              ))}
            </div>
            <div className="footer-name-letters" aria-label="GLATZ">
              {glatz.map((ch, i) => (
                <div key={i} className="footer-letter-clip">
                  <motion.span
                    className="footer-bigname"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={letterVariants}
                    custom={gabriel.length + 1 + i}
                  >
                    {ch}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>

          {/* Stripes — spans full height of both name rows */}
          <div className="footer-stripes">
            {STRIPES.map((color, i) => (
              <motion.span
                key={color}
                className="footer-stripe"
                style={{ background: color, transformOrigin: "left" }}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={stripeVariants}
                custom={i}
              />
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <motion.div
        className="footer-bar"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: EASE, delay: 1.2 }}
      >
        <div className="footer-bar-social">
          {SOCIAL.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="footer-bar-link"
            >
              {s.label}
            </a>
          ))}
        </div>
        <nav className="footer-bar-social">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="footer-bar-link">
              {l.label}
            </a>
          ))}
        </nav>
        <p className="footer-bar-copy">
          Gabriel Glatz 2026 &mdash; Software Developer
        </p>
      </motion.div>
    </footer>
  );
}
