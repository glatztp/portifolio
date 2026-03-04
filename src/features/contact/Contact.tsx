"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/* ─── Ease shared ─── */
const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Variants ─── */
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const linkContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
};

const linkVariants = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
};

const formVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* ─── RevealLine ─── */
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
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─── Arrow SVG ─── */
function Arrow({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path
        d="M1 13L13 1M13 1H5M13 1V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── ContactLink ─── */
function ContactLink({
  href,
  label,
  value,
  external,
}: {
  href: string;
  label: string;
  value: string;
  external?: boolean;
}) {
  return (
    <motion.a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="contact-link"
      variants={linkVariants}
      whileHover="hovered"
      initial="rest"
      animate="rest"
    >
      <span className="contact-link__label">{label}</span>
      <span className="contact-link__value">{value}</span>
      <motion.span
        variants={{
          rest: { x: 0, y: 0 },
          hovered: { x: 3, y: -3, transition: { duration: 0.3, ease: EASE } },
        }}
        style={{ display: "flex", alignItems: "center" }}
      >
        <Arrow size={12} />
      </motion.span>
    </motion.a>
  );
}

const FIELDS = [
  { id: "name", label: "Nome", placeholder: "Seu nome", type: "text" },
  { id: "email", label: "Email", placeholder: "seu@email.com", type: "email" },
  {
    id: "subject",
    label: "Assunto",
    placeholder: "Discussão do projeto",
    type: "text",
  },
];

export default function Contact() {
  const [focused, setFocused] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 0.6], [20, -60]);
  const bigNumY = useSpring(rawY, { stiffness: 60, damping: 20 });
  const bigNumOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.55, 0.7],
    [0, 0.06, 0.06, 0],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contato" className="contact-section" ref={sectionRef}>
      {/* Bg giant number — spring parallax */}
      <motion.span
        className="contact-bg-number"
        style={{ y: bigNumY, opacity: bigNumOpacity }}
        aria-hidden
      >
        06
      </motion.span>

      {/* Section label */}
      <motion.div
        className="section-label"
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <span className="section-label__num">06</span>
        <span className="section-label__text">Contato</span>
      </motion.div>

      {/* Heading */}
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
        {/* ── Left info column ── */}
        <motion.div
          className="contact-info"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.p className="contact-info__desc" variants={itemVariants}>
            Tem um projeto em mente? Adoraria saber sobre ele. Vamos criar algo
            incrível juntos. Normalmente respondo em até 24 horas.
          </motion.p>

          <motion.div
            className="contact-links"
            variants={linkContainerVariants}
          >
            <ContactLink
              href="mailto:gabrielfellipeglatz@gmail.com"
              label="Email"
              value="gabrielfellipeglatz@gmail.com"
            />
            <ContactLink
              href="https://github.com/glatztp"
              label="GitHub"
              value="github.com/glatztp"
              external
            />
            <ContactLink
              href="https://linkedin.com/in/gabriel-glatz"
              label="LinkedIn"
              value="linkedin.com/in/gabriel-glatz"
              external
            />
            <ContactLink
              href="https://instagram.com/glatztp"
              label="Instagram"
              value="instagram.com/glatztp"
              external
            />
          </motion.div>

          <motion.div className="contact-availability" variants={itemVariants}>
            <span className="contact-availability__dot" />
            <div>
              <p className="contact-availability__title">
                Disponível para novos projetos
              </p>
              <p className="contact-availability__desc">
                Aberto para freelance e oportunidades de tempo integral.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right form column ── */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, delay: 0.25, ease: EASE }}
        >
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                className="contact-success"
                initial={{ opacity: 0, scale: 0.88, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: -16 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <motion.div
                  className="contact-success__icon"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                >
                  ✓
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
                >
                  Mensagem enviada! Retornarei em breve.
                </motion.p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                onSubmit={handleSubmit}
                className="contact-form"
                variants={formVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }}
              >
                {FIELDS.map((f) => (
                  <motion.div
                    key={f.id}
                    className={`contact-field ${focused === f.id ? "contact-field--focused" : ""}`}
                    variants={fieldVariants}
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
                  variants={fieldVariants}
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
                  variants={fieldVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.span
                    initial={false}
                    whileHover={{ x: -2 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    Enviar Mensagem
                  </motion.span>
                  <motion.span
                    style={{ display: "flex", alignItems: "center" }}
                    initial={false}
                    whileHover={{ x: 3, y: -3 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <Arrow size={16} />
                  </motion.span>
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
