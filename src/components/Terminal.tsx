"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import ScreenGlitch from "./ScreenGlitch";

interface Line {
  id: number;
  type: "banner" | "input" | "output" | "error" | "hint";
  content: string;
}
interface TermInst {
  uid: number;
  z: number;
  idx: number;
}

const COMMANDS: Record<string, string[]> = {
  help: [
    "  comandos disponíveis",
    "",
    "  ── info ─────────────────────────────────────",
    "  whoami     sobre o dev",
    "  skills     stack técnica completa",
    "  projects   projetos recentes",
    "  contact    formas de contato",
    "  github     link para o GitHub",
    "  cv         currículo / resume",
    "  ls         listar seções do portfólio",
    "  cat        cat readme.md  |  cat .secret",
    "",
    "  ── diversão ─────────────────────────────────",
    "  joke       piada de dev (não recomendado)",
    "  coffee     status de cafeína",
    "  flip       flip a coin",
    "  matrix     ???",
    "",
    "  ── terminal ─────────────────────────────────",
    "  new        abrir novo terminal",
    "  clear      limpar o terminal",
    "  exit       fechar esta janela (ou Esc)",
    "",
  ],
  whoami: [
    "  Gabriel Glatz",
    "  ",
    "  Cargo      Software Developer",
    "  Stack      React  TypeScript  Node.js  Next.js",
    "  Cidade     Brasil",
    "  Foco       Interfaces modernas, DX e performance",
    "",
    "  Apaixonado por código limpo e UI/UX bem feito.",
  ],
  skills: [
    "  ── Frontend ─────────────────────────────────",
    "   React  Next.js  TypeScript  Tailwind",
    "   Framer Motion  CSS  HTML",
    "  ── Backend ──────────────────────────────────",
    "   Node.js  REST APIs  SQL  PostgreSQL",
    "  ── Tools ────────────────────────────────────",
    "   Git  Docker  Figma  VS Code",
    "  ── Soft Skills ──────────────────────────────",
    "   Design thinking  Clean code  SOLID  DX",
    "",
  ],
  projects: [
    "  01  E-Commerce       React  Node.js  SQL  REST API",
    "  02  Dashboard        React  TypeScript  Recharts",
    "  03  Landing Page     Next.js  Tailwind  Framer Motion",
    "  04  App Mobile       React Native  Expo  Firebase",
    "",
    "  ↓  acesse a seção #projetos para ver mais detalhes",
  ],
  contact: [
    "  Email      gabrielfellipeglatz@gmail.com",
    "  GitHub     github.com/glatztp",
    "  LinkedIn   linkedin.com/in/gabriel-glatz",
    "",
    "  ↓  role até #contato ou use o formulário no site",
  ],
  github: [
    "  ┌─────────────────────────────────────┐",
    "  │   github.com/glatztp                │",
    "  └─────────────────────────────────────┘",
    "",
    "  Repositórios públicos, projetos e contribuições.",
    "  https://github.com/glatztp",
  ],
  cv: [
    "  ┌─────────────────────────────────────┐",
    "  │   Currículo / Resume                │",
    "  └─────────────────────────────────────┘",
    "",
    "  Arquivo não disponível ainda.",
    "  Entre em contato via email para solicitar:",
    "  gabrielfellipeglatz@gmail.com",
  ],
  ls: [
    "  drwxr-xr-x  hero/",
    "  drwxr-xr-x  sobre/",
    "  drwxr-xr-x  projetos/",
    "  drwxr-xr-x  skills/",
    "  drwxr-xr-x  experiencia/",
    "  drwxr-xr-x  contato/",
    "  -rw-r--r--  README.md",
    "  -rw-r--r--  .secret  (acesso negado)",
    "",
    "  dica: role a página para explorar cada seção",
  ],
  "cat readme.md": [
    "  # portifolio",
    "",
    "  Olá! Eu sou Gabriel Glatz, dev apaixonado por",
    "  interfaces bonitas e código que funciona de verdade.",
    "",
    "  Este portfólio foi feito com:",
    "   Next.js  TypeScript  Tailwind  Framer Motion",
    "",
    "  Fique à vontade para explorar. Se curtiu,",
    "  manda um 'contact' aqui no terminal :)",
  ],
  "cat .secret": [
    "  cat: .secret: Permissão negada.",
    "",
    "  ...ou é?",
    "",
    "  ───────────────────────────────────",
    "  TOKEN=gl4tz_n4o_e_assim_q_se_h4cka",
    "  ───────────────────────────────────",
    "",
    "  brincadeira. não tem nada aqui.",
  ],
  joke: [
    "  um homem entra numa biblioteca e pede:",
    "",
    '  "um hamburguer e uma coca, por favor."',
    "",
    "  a bibliotecária responde:",
    "",
    '  "senhor, isso é uma biblioteca!"',
    "",
    "  o homem coça a cabeça, abaixa a voz",
    "  e sussurra:",
    "",
    '  "um hamburguer e uma coca, por favor."',
    "",
  ],
  coffee: [
    "  ☕  status de cafeína atual",
    "",
    "  [██████████████████░░]  92%",
    "",
    "  última recarga: há pouco",
    "  próxima recarga: em breve",
    "  modo de operação: MAXIMUM OVERDRIVE",
    "",
    "  nota: sem café não há commits.",
  ],
  flip: [], // handled dynamically in execute()
  sudo: [
    "  sudo: permissão negada.",
    "",
    "  Você acha que é o Linus Torvalds agora?",
    "  Tenta não.",
  ],
};

const BANNER: string[] = [
  "   ██████╗ ██╗      █████╗ ████████╗███████╗",
  "  ██╔════╝ ██║     ██╔══██╗╚══██╔══╝╚══███╔╝",
  "  ██║  ███╗██║     ███████║   ██║     ███╔╝ ",
  "  ██║   ██║██║     ██╔══██║   ██║    ███╔╝  ",
  "  ╚██████╔╝███████╗██║  ██║   ██║   ███████╗",
  "   ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝",
  "",
  "  Portfolio Terminal    type 'help' to start",
  "  ",
];

const PROMPT = "visitor@glatz:~$";
let _gid = typeof window !== "undefined" ? Date.now() : 1e12;
const mkLine = (type: Line["type"], content: string): Line => ({
  id: _gid++,
  type,
  content,
});

function TermWin({
  inst,
  focused,
  onFocus,
  onClose,
  onNew,
  onMatrix,
}: {
  inst: TermInst;
  focused: boolean;
  onFocus: (uid: number) => void;
  onClose: (uid: number) => void;
  onNew: () => void;
  onMatrix?: () => void;
}) {
  const [lines, setLines] = useState<Line[]>(() =>
    BANNER.map((l) => mkLine("banner", l)),
  );
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [showWarning, setShowWarning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  useEffect(() => {
    if (focused) inputRef.current?.focus();
  }, [focused]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const winW = typeof window !== "undefined" ? window.innerWidth : 800;
  const winH = typeof window !== "undefined" ? window.innerHeight : 600;
  const termW = Math.min(680, winW * 0.94);
  const termH = Math.min(520, winH * 0.88);
  const ox = isMobile
    ? Math.max(0, (winW - termW) / 2)
    : Math.min(Math.max(8, 40 + inst.idx * 32), Math.max(8, winW - termW - 8));
  const oy = isMobile
    ? Math.max(0, winH * 0.08)
    : Math.min(Math.max(8, 60 + inst.idx * 28), Math.max(8, winH - termH - 8));

  const execute = useCallback(
    (cmd: string) => {
      const t = cmd.trim().toLowerCase();
      const nl: Line[] = [mkLine("input", `${PROMPT} ${cmd}`)];
      if (t === "") {
        setLines((p) => [...p, ...nl]);
        return;
      }
      if (t === "clear") {
        setLines([]);
        return;
      }
      if (t === "exit" || t === "q") {
        onClose(inst.uid);
        return;
      }
      if (t === "new") {
        onNew();
        nl.push(
          mkLine("output", "   novo terminal aberto"),
          mkLine("output", ""),
        );
        setLines((p) => [...p, ...nl]);
        setHist((p) => [t, ...p.slice(0, 49)]);
        setHistIdx(-1);
        return;
      }
      if (t === "matrix") {
        setShowWarning(true);
        setHist((p) => [t, ...p.slice(0, 49)]);
        setHistIdx(-1);
        return;
      }
      if (t === "flip") {
        const result = Math.random() < 0.5 ? "  🪙  CARA" : "  🪙  COROA";
        nl.push(
          mkLine("output", result),
          mkLine("hint", "  (melhor de 3? tenta de novo)"),
          mkLine("output", ""),
        );
        setLines((p) => [...p, ...nl]);
        setHist((p) => [t, ...p.slice(0, 49)]);
        setHistIdx(-1);
        return;
      }
      if (t === "cat") {
        nl.push(
          mkLine("hint", "  uso: cat <arquivo>"),
          mkLine("hint", "  arquivos disponíveis: readme.md  .secret"),
          mkLine("output", ""),
        );
        setLines((p) => [...p, ...nl]);
        setHist((p) => [t, ...p.slice(0, 49)]);
        setHistIdx(-1);
        return;
      }
      const res = COMMANDS[t];
      if (res && res.length > 0) {
        res.forEach((l) => nl.push(mkLine("output", l)));
        nl.push(mkLine("output", ""));
      } else if (!res) {
        nl.push(
          mkLine("error", `  command not found: ${t}`),
          mkLine("hint", "  type 'help' para ver os comandos"),
          mkLine("output", ""),
        );
      }
      setLines((p) => [...p, ...nl]);
      setHist((p) => [t, ...p.slice(0, 49)]);
      setHistIdx(-1);
    },
    [inst.uid, onClose, onNew],
  );

  const confirmMatrix = useCallback(() => {
    setShowWarning(false);
    const steps: { d: number; text: string; type: Line["type"] }[] = [
      {
        d: 100,
        text: "  [SYS] iniciando protocolo de acesso root...",
        type: "output",
      },
      {
        d: 500,
        text: "  > estabelecendo conexão com o kernel...",
        type: "output",
      },
      {
        d: 950,
        text: "  > bypassando firewall............. [OK]",
        type: "output",
      },
      {
        d: 1300,
        text: "  > descriptografando memória RAM......",
        type: "output",
      },
      { d: 1650, text: "  !! ACESSO CONCEDIDO — NÍVEL ROOT !!", type: "error" },
      { d: 1950, text: "  ██ CORROMPENDO DADOS DO SISTEMA ██", type: "error" },
      {
        d: 2200,
        text: "  ██████████████████████████████  100%",
        type: "error",
      },
    ];
    steps.forEach(({ d, text, type }) =>
      setTimeout(() => setLines((p) => [...p, mkLine(type, text)]), d),
    );
    setTimeout(() => onMatrix?.(), 2400);
  }, [onMatrix]);

  const cancelMatrix = useCallback(() => {
    setShowWarning(false);
    setLines((p) => [
      ...p,
      mkLine("hint", "  operação cancelada."),
      mkLine("output", ""),
    ]);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const onKD = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showWarning) {
      if (e.key.toLowerCase() === "y") {
        e.preventDefault();
        confirmMatrix();
      }
      if (e.key.toLowerCase() === "n" || e.key === "Escape") {
        e.preventDefault();
        cancelMatrix();
      }
      return;
    }
    if (e.key === "Enter") {
      execute(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const n = Math.min(histIdx + 1, hist.length - 1);
      setHistIdx(n);
      setInput(hist[n] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = Math.max(histIdx - 1, -1);
      setHistIdx(n);
      setInput(n === -1 ? "" : hist[n]);
    }
  };

  return (
    <motion.div
      drag={!isMobile}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        left: 8,
        top: 8,
        right: Math.max(8, winW - termW - 8),
        bottom: Math.max(8, winH - termH - 8),
      }}
      className="terminal-window"
      style={{
        position: "fixed",
        top: oy,
        left: ox,
        zIndex: 8000 + inst.z,
        boxShadow: focused
          ? "0 28px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(160,126,212,0.3)"
          : "0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
      }}
      initial={{ opacity: 0, scale: 0.94, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 10 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      onMouseDown={() => onFocus(inst.uid)}
    >
      <div
        className="terminal-titlebar"
        style={{ cursor: "grab", userSelect: "none" }}
        onPointerDown={(e) => {
          onFocus(inst.uid);
          dragControls.start(e);
        }}
      >
        <div className="terminal-dots">
          <button
            className="terminal-dot terminal-dot--red"
            onClick={(e) => {
              e.stopPropagation();
              onClose(inst.uid);
            }}
            title="Fechar"
          />
          <span className="terminal-dot terminal-dot--yellow" title="" />
          <span
            className="terminal-dot terminal-dot--green"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              onNew();
            }}
            title="Novo terminal"
          />
        </div>
        <span className="terminal-title">
          glatz terminal{inst.idx > 0 ? ` (${inst.idx + 1})` : ""}
        </span>
      </div>

      <div
        className="terminal-body"
        data-lenis-prevent
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className={`terminal-line terminal-line--${line.type}`}
          >
            {line.content}
          </div>
        ))}
        <div className="terminal-input-row">
          <span className="terminal-prompt">{PROMPT}</span>
          <input
            ref={inputRef}
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKD}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
        <div ref={bottomRef} />

        {/* ⚠️ epilepsy warning overlay */}
        {showWarning && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(8,6,18,0.96)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(0.5rem,2vw,0.9rem)",
              padding: "clamp(0.9rem,3vw,1.5rem)",
              textAlign: "center",
              borderRadius: "0 0 12px 12px",
              overflowY: "auto",
            }}
          >
            <div style={{ fontSize: "clamp(1.1rem,4vw,1.5rem)" }}>⚠️</div>
            <p
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "clamp(0.58rem,2vw,0.72rem)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#ffbd2e",
                fontWeight: 700,
              }}
            >
              aviso de fotossensibilidade
            </p>
            <p
              style={{
                fontSize: "clamp(0.66rem,2.2vw,0.8rem)",
                color: "rgba(237,232,220,0.55)",
                lineHeight: 1.65,
                maxWidth: "min(340px,100%)",
              }}
            >
              este efeito contém{" "}
              <strong style={{ color: "#ede8dc" }}>
                luzes piscantes, flashes e movimentos bruscos
              </strong>
              . Pode causar desconforto em pessoas com epilepsia fotossensitiva.
            </p>
            <div
              className="terminal-warning-actions"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.6rem",
                marginTop: "0.3rem",
                width: "100%",
              }}
            >
              <button
                onClick={confirmMatrix}
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "clamp(0.65rem,2vw,0.75rem)",
                  letterSpacing: "0.1em",
                  background: "#ff5f56",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "0.5rem 1.2rem",
                  cursor: "pointer",
                  fontWeight: 700,
                  flex: "1 1 auto",
                  minWidth: "7rem",
                }}
              >
                [Y] confirmar
              </button>
              <button
                onClick={cancelMatrix}
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "clamp(0.65rem,2vw,0.75rem)",
                  letterSpacing: "0.1em",
                  background: "transparent",
                  color: "rgba(237,232,220,0.45)",
                  border: "1px solid rgba(237,232,220,0.15)",
                  borderRadius: 6,
                  padding: "0.5rem 1.2rem",
                  cursor: "pointer",
                  flex: "1 1 auto",
                  minWidth: "7rem",
                }}
              >
                [N] cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

let _uid = 0;
let _zc = 0;

export default function EasterEggTerminal() {
  const [terms, setTerms] = useState<TermInst[]>([]);
  const [focused, setFocused] = useState<number | null>(null);
  const spawnCount = useRef(0);
  const [glitching, setGlitching] = useState(false);

  const triggerMatrix = useCallback(() => setGlitching(true), []);

  const openNew = useCallback(() => {
    const uid = _uid++;
    const idx = spawnCount.current++;
    setTerms((p) => [...p, { uid, z: ++_zc, idx }]);
    setFocused(uid);
  }, []);

  const closeOne = useCallback((uid: number) => {
    setTerms((p) => p.filter((t) => t.uid !== uid));
    setFocused((p) => (p === uid ? null : p));
  }, []);

  const focusOne = useCallback((uid: number) => {
    setTerms((p) => p.map((t) => (t.uid === uid ? { ...t, z: ++_zc } : t)));
    setFocused(uid);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "/") {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        openNew();
      }
      if (e.key === "Escape" && terms.length > 0) {
        const top = [...terms].sort((a, b) => b.z - a.z)[0];
        if (top) closeOne(top.uid);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [openNew, closeOne, terms]);

  return (
    <>
      <motion.div
        className="terminal-hint-badge"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 3 }}
        onClick={openNew}
        title="Abrir terminal  (atalho: /)"
      >
        <span className="terminal-hint-slash">/</span>
        <span className="terminal-hint-text">terminal</span>
      </motion.div>

      <AnimatePresence>
        {terms.map((inst) => (
          <TermWin
            key={inst.uid}
            inst={inst}
            focused={focused === inst.uid}
            onFocus={focusOne}
            onClose={closeOne}
            onNew={openNew}
            onMatrix={triggerMatrix}
          />
        ))}
      </AnimatePresence>
      <ScreenGlitch
        active={glitching}
        onDone={() => {
          setGlitching(false);
          document.documentElement.classList.add("matrix-mode");
        }}
      />
    </>
  );
}
