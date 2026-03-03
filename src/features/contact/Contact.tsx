"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

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

const FIELDS = [
  { id: "name", label: "Nome", placeholder: "Seu nome", type: "text" },
  { id: "email", label: "Email", placeholder: "seu@email.com", type: "email" },
  {
    id: "subject",
    label: "Assunto",
    placeholder: "DiscussÃ£o do projeto",
    type: "text",
  },
];

export default function Contact() {
  const [focused, setFocused] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contato" className="contact-section">
      <div className="section-label">
        <span className="section-label__num">06</span>
        <span className="section-label__text">Contato</span>
      </div>

      <div className="contact-heading-wrap">
        <RevealLine>
          <h2 className="contact-heading">Vamos</h2>
        </RevealLine>
        <RevealLine delay={0.08}>
          <h2 className="contact-heading contact-heading--accent">Trabalhar</h2>
        </RevealLine>
        <RevealLine delay={0.16}>
          <h2 className="contact-heading contact-heading--outline">Juntos.</h2>
        </RevealLine>
      </div>

      <div className="contact-grid">
        <motion.div
          className="contact-info"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="contact-info__desc">
            Tem um projeto em mente? Adoraria saber sobre ele. Vamos criar algo
            incrÃ­vel juntos. Normalmente respondo em atÃ© 24 horas.
          </p>

          <div className="contact-links">
            <a
              href="mailto:gabrielfellipeglatz@gmail.com"
              className="contact-link"
            >
              <span className="contact-link__label">Email</span>
              <span className="contact-link__value">
                gabrielfellipeglatz@gmail.com
              </span>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 13L13 1M13 1H5M13 1V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="https://github.com/glatztp"
              target="_blank"
              rel="noreferrer"
              className="contact-link"
            >
              <span className="contact-link__label">GitHub</span>
              <span className="contact-link__value">github.com/glatztp</span>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 13L13 1M13 1H5M13 1V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/gabriel-glatz"
              target="_blank"
              rel="noreferrer"
              className="contact-link"
            >
              <span className="contact-link__label">LinkedIn</span>
              <span className="contact-link__value">
                linkedin.com/in/gabriel-glatz
              </span>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 13L13 1M13 1H5M13 1V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="https://instagram.com/glatztp"
              target="_blank"
              rel="noreferrer"
              className="contact-link"
            >
              <span className="contact-link__label">Instagram</span>
              <span className="contact-link__value">instagram.com/glatztp</span>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
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

          <div className="contact-availability">
            <span className="contact-availability__dot" />
            <div>
              <p className="contact-availability__title">
                DisponÃ­vel para novos projetos
              </p>
              <p className="contact-availability__desc">
                Aberto para freelance e oportunidades de tempo integral.
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {sent ? (
            <motion.div
              className="contact-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="contact-success__icon">âœ“</div>
              <p>Mensagem enviada! Retornarei em breve.</p>
            </motion.div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="contact-form"
            >
              {FIELDS.map((f, i) => (
                <motion.div
                  key={f.id}
                  className={`contact-field ${focused === f.id ? "contact-field--focused" : ""}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 * i,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <label className="contact-field__label" htmlFor={f.id}>
                    {f.label} *
                  </label>
                  <input
                    id={f.id}
                    type={f.type}
                    placeholder={f.placeholder}
                    className="contact-field__input"
                    required
                    onFocus={() => setFocused(f.id)}
                    onBlur={() => setFocused(null)}
                  />
                  <div className="contact-field__line" />
                </motion.div>
              ))}

              <motion.div
                className={`contact-field contact-field--textarea ${focused === "message" ? "contact-field--focused" : ""}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <label className="contact-field__label" htmlFor="message">
                  Mensagem *
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Conte-me sobre seu projeto..."
                  className="contact-field__input contact-field__textarea"
                  required
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                />
                <div className="contact-field__line" />
              </motion.div>

              <motion.button
                type="submit"
                className="contact-submit"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Enviar Mensagem</span>
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 13L13 1M13 1H5M13 1V9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
