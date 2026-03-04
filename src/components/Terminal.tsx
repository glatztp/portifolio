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
    " comandos disponíveis ",
    "  whoami     informações sobre o dev                 ",
    "  skills     stack técnica completa                  ",
    "  projects   projetos recentes                       ",
    "  contact    formas de entrar em contato             ",
    "  github     link para o GitHub                      ",
    "  cv         download do currículo                   ",
    "  ls         listar seções do portfólio              ",
    "  joke       piada de dev (perigo)                   ",
    "  matrix     ???                                     ",
    "  sudo       tente se achar esperto                  ",
    "  new        abrir novo terminal                     ",
    "  clear      limpar o terminal                       ",
    "  exit       fechar esta janela (ou Esc)             ",
    "",
  ],
  whoami: [
    "  Gabriel Glatz",
    "  ",
    "  Cargo      Software Developer",
    "  Stack      React  TypeScript  Node.js  Next.js",
    "  Cidade     Brasil ",
    "  Status      Disponível para trabalho",
    "  Foco       Interfaces modernas, DX e performance",
    "",
    "   Apaixonado por código limpo e UI/UX bem feito",
  ],
  skills: [
    "   Frontend ",
    "    React  Next.js  TypeScript  Tailwind  ",
    "   Backend ",
    "    Node.js  REST APIs  SQL  PostgreSQL   ",
    "   Tools ",
    "    Git  Docker  Figma  VS Code           ",
    "   Soft Skills ",
    "    Design thinking  Clean code  SOLID     ",
    "  ",
  ],
  projects: [
    "  01   E-Commerce    React  Node.js  SQL  REST API",
    "  02   Dashboard     React  TypeScript  Recharts",
    "  03   Landing Page  Next.js  Tailwind  Framer Motion",
    "  04   App Mobile    React Native  Expo  Firebase",
    "",
    "   acesse a seção #projetos para ver mais detalhes",
  ],
  contact: [
    "    Email     gabrielfellipeglatz@gmail.com",
    "    GitHub    github.com/glatztp",
    "    LinkedIn  linkedin.com/in/gabrielglatz",
    "",
    "   role até #contato ou use o formulário no site",
  ],
  github: [
    "  ",
    "      github.com/glatztp                 ",
    "  ",
    "",
    "  Repositórios públicos, projetos e contribuições.",
    "   https://github.com/glatztp",
  ],
  cv: [
    "  ",
    "      Currículo / Resume                 ",
    "  ",
    "",
    "    Arquivo não disponível ainda.",
    "  Entre em contato via email para solicitar:",
    "   gabrielfellipeglatz@gmail.com",
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
  joke: [
    "  Por que o dev foi ao médico?",
    "",
    "  ............",
    "",
    '  Porque não conseguia parar de fazer "commits"! ',
    "",
    "  ",
    '  "99 bugs no código, corrijo 1, agora tem 127."   anon',
  ],
  sudo: [
    "  sudo: permissão negada.",
    "",
    "  Você acha que é o Linus Torvalds agora?",
    "  Tenta não. ",
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
let _gid = 0;
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

  const ox = Math.min(
    40 + inst.idx * 32,
    (typeof window !== "undefined" ? window.innerWidth : 800) - 720,
  );
  const oy = Math.min(
    60 + inst.idx * 28,
    (typeof window !== "undefined" ? window.innerHeight : 600) - 540,
  );

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
      const res = COMMANDS[t];
      if (res) {
        res.forEach((l) => nl.push(mkLine("output", l)));
        nl.push(mkLine("output", ""));
      } else {
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
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
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
              gap: "0.9rem",
              padding: "1.5rem",
              textAlign: "center",
              borderRadius: "0 0 12px 12px",
            }}
          >
            <div style={{ fontSize: "1.5rem" }}>⚠️</div>
            <p
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#ffbd2e",
                fontWeight: 700,
              }}
            >
              aviso de fotossensibilidade
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "rgba(237,232,220,0.55)",
                lineHeight: 1.7,
                maxWidth: 340,
              }}
            >
              este efeito contém{" "}
              <strong style={{ color: "#ede8dc" }}>
                luzes piscantes, flashes e movimentos bruscos
              </strong>
              .
              <br />
              Pode causar desconforto em pessoas com epilepsia fotossensitiva.
            </p>
            <div
              style={{ display: "flex", gap: "0.75rem", marginTop: "0.4rem" }}
            >
              <button
                onClick={confirmMatrix}
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  background: "#ff5f56",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "0.45rem 1.1rem",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                [Y] confirmar
              </button>
              <button
                onClick={cancelMatrix}
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  background: "transparent",
                  color: "rgba(237,232,220,0.45)",
                  border: "1px solid rgba(237,232,220,0.15)",
                  borderRadius: 6,
                  padding: "0.45rem 1.1rem",
                  cursor: "pointer",
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
      <ScreenGlitch active={glitching} onDone={() => setGlitching(false)} />
    </>
  );
}
