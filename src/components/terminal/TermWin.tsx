import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion"; // Removido useDragControls
import { COMMANDS, BANNER, PROMPT, mkLine } from "./TerminalCommands";
import type { Line } from "./TerminalCommands";
import * as TerminalState from "./TerminalState";

interface TermInst {
  uid: number;
  z: number;
  idx: number;
}

interface Note {
  text: string;
}

interface Todo {
  text: string;
  done: boolean;
}

interface ActiveTimer {
  id: ReturnType<typeof setInterval>;
  label: string;
  endsAt: number;
}

const COPY_TARGETS: Record<string, string> = {
  email: "gabrielfellipeglatz@gmail.com",
  github: "https://github.com/glatztp",
  linkedin: "https://linkedin.com/in/gabriel-glatz",
  portfolio: "https://glatz.dev",
};

const OPEN_TARGETS: Record<string, string> = {
  github: "https://github.com/glatztp",
  linkedin: "https://linkedin.com/in/gabriel-glatz",
  email: "mailto:gabrielfellipeglatz@gmail.com",
  projects: "#projects",
  contact: "#contact",
  portfolio: "https://glatz.dev",
};

const GOTO_SECTIONS: Record<string, string> = {
  top: "#hero",
  hero: "#hero",
  about: "#sobre",
  sobre: "#sobre",
  projects: "#projects",
  projetos: "#projetos",
  skills: "#skills",
  contact: "#contact",
  contato: "#contato",
};

function resolveCmd(key: string): string[] | null {
  const entry = COMMANDS[key];
  if (!entry) return null;
  return typeof entry === "function" ? entry() : entry;
}

function push(nl: Line[], rows: string[], type: Line["type"] = "output") {
  rows.forEach((r) => nl.push(mkLine(type, r)));
}

function triggerDownload(
  content: string,
  filename: string,
  mimeType = "text/plain",
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function genUUID(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function safeCalc(expr: string): number | null {
  try {
    const clean = expr.replace(/[^0-9+\-*/.() \t%]/g, "").trim();
    if (!clean) return null;
    const result = Function(`"use strict"; return (${clean})`)();
    if (typeof result !== "number" || !isFinite(result)) return null;
    return result;
  } catch {
    return null;
  }
}

function buildVCard(): string {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:Gabriel Glatz",
    "N:Glatz;Gabriel;;;",
    "TITLE:Software Developer",
    "EMAIL;TYPE=INTERNET:gabrielfellipeglatz@gmail.com",
    "URL:https://github.com/glatztp",
    "URL:https://linkedin.com/in/gabriel-glatz",
    "NOTE:React · TypeScript · Next.js",
    "END:VCARD",
  ].join("\n");
}

export default function TermWin({
  inst,
  focused,
  onFocus,
  onClose,
  onNew,
  onMatrix,
  onGoto,
}: {
  inst: TermInst;
  focused: boolean;
  onFocus: (uid: number) => void;
  onClose: (uid: number) => void;
  onNew: () => void;
  onMatrix?: () => void;
  onGoto?: (sectionId: string) => void;
}) {
  const [lines, setLines] = useState<Line[]>(() =>
    BANNER.map((l) => mkLine("banner", l)),
  );
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [showWarning, setShowWarning] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<Map<string, ActiveTimer>>(new Map());

  const winW = typeof window !== "undefined" ? window.innerWidth : 800;
  const winH = typeof window !== "undefined" ? window.innerHeight : 600;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const baseTermW = Math.min(680, winW * 0.94);
  const baseTermH = Math.min(520, winH * 0.88);
  const baseOx = isMobile
    ? Math.max(0, (winW - baseTermW) / 2)
    : Math.min(
        Math.max(8, 40 + inst.idx * 32),
        Math.max(8, winW - baseTermW - 8),
      );
  const baseOy = isMobile
    ? Math.max(0, winH * 0.08)
    : Math.min(
        Math.max(8, 60 + inst.idx * 28),
        Math.max(8, winH - baseTermH - 8),
      );

  const MIN_W = 280;
  const MIN_H = 140;
  const MAX_W = Math.max(300, winW - 16);
  const MAX_H = Math.max(200, winH - 16);

  const [size, setSize] = useState(() => ({ w: baseTermW, h: baseTermH }));
  const [pos, setPos] = useState(() => ({ left: baseOx, top: baseOy }));
  
  const resizingRef = useRef<null | {
    dir: string;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
    startLeft: number;
    startTop: number;
  }>(null);
  const winRef = useRef<HTMLDivElement>(null);

  const clamp = (v: number, a: number, b: number) =>
    Math.max(a, Math.min(b, v));

  useEffect(() => {
    if (focused) inputRef.current?.focus();
  }, [focused]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearInterval(t.id));
    };
  }, []);

  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMobile) return; 
    
    onFocus(inst.uid);
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = pos.left;
    const startTop = pos.top;
    const currentW = size.w;
    const currentH = size.h;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      
      const newLeft = clamp(startLeft + dx, 8, Math.max(8, winW - currentW - 8));
      const newTop = clamp(startTop + dy, 8, Math.max(8, winH - currentH - 8));
      
      setPos({ left: newLeft, top: newTop });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const startResize =
    (dir: string) => (e: React.PointerEvent<HTMLDivElement>) => {
      e.stopPropagation();
      resizingRef.current = {
        dir,
        startX: e.clientX,
        startY: e.clientY,
        startW: size.w,
        startH: size.h,
        startLeft: pos.left,
        startTop: pos.top,
      };

      const onMove = (ev: PointerEvent) => {
        const r = resizingRef.current;
        if (!r) return;
        const dx = ev.clientX - r.startX;
        const dy = ev.clientY - r.startY;
        let newW = r.startW;
        let newH = r.startH;
        let newLeft = r.startLeft;
        let newTop = r.startTop;

        if (r.dir.includes("right"))
          newW = Math.min(MAX_W, Math.max(MIN_W, r.startW + dx));
        if (r.dir.includes("left")) {
          newW = Math.min(MAX_W, Math.max(MIN_W, r.startW - dx));
          newLeft = r.startLeft + dx;
        }
        if (r.dir.includes("bottom"))
          newH = Math.min(MAX_H, Math.max(MIN_H, r.startH + dy));
        if (r.dir.includes("top")) {
          newH = Math.min(MAX_H, Math.max(MIN_H, r.startH - dy));
          newTop = r.startTop + dy;
        }

        newLeft = Math.max(8, Math.min(newLeft, winW - newW - 8));
        newTop = Math.max(8, Math.min(newTop, winH - newH - 8));

        setSize({ w: newW, h: newH });
        setPos({ left: newLeft, top: newTop });
      };

      const onUp = () => {
        resizingRef.current = null;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        setTimeout(() => inputRef.current?.focus(), 50);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };

  const commit = useCallback((nl: Line[], raw: string) => {
    setLines((p) => [...p, ...nl]);
    if (raw.trim()) setHist((p) => [raw.trim(), ...p.slice(0, 49)]);
    setHistIdx(-1);
  }, []);

  const appendLines = useCallback((...newLines: Line[]) => {
    setLines((p) => [...p, ...newLines]);
  }, []);

  const execute = useCallback(
    (cmd: string) => {
      const raw = cmd.trim();
      const t = raw.toLowerCase();
      const nl: Line[] = [mkLine("input", `${PROMPT} ${cmd}`)];

      if (!raw) {
        setLines((p) => [...p, ...nl]);
        return;
      }
      if (t === "clear" || t === "cls") {
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
          mkLine("output", "  novo terminal aberto"),
          mkLine("output", ""),
        );
        commit(nl, raw);
        return;
      }

      if (t === "matrix") {
        setShowWarning(true);
        if (raw.trim()) setHist((p) => [raw.trim(), ...p.slice(0, 49)]);
        setHistIdx(-1);
        return;
      }

      if (t === "flip") {
        const r = Math.random() < 0.5 ? "  [ CARA  ]" : "  [ COROA ]";
        nl.push(
          mkLine("output", r),
          mkLine("hint", "  (melhor de 3?)"),
          mkLine("output", ""),
        );
        commit(nl, raw);
        return;
      }

      if (t.startsWith("echo ")) {
        nl.push(mkLine("output", `  ${raw.slice(5)}`), mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "history") {
        if (hist.length === 0)
          nl.push(mkLine("hint", "  (sem historico ainda)"));
        else
          hist
            .slice()
            .reverse()
            .forEach((h, i) =>
              nl.push(
                mkLine("output", `  ${String(i + 1).padStart(3, " ")}  ${h}`),
              ),
            );
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "pwd") {
        nl.push(mkLine("output", "  /home/visitor"), mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "date") {
        nl.push(
          mkLine(
            "output",
            `  ${new Date().toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "medium" })}`,
          ),
          mkLine("output", ""),
        );
        commit(nl, raw);
        return;
      }

      if (t === "uptime" || t === "status") {
        push(nl, resolveCmd(t) ?? []);
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "cat") {
        nl.push(
          mkLine("hint", "  uso: cat <arquivo>"),
          mkLine(
            "hint",
            "  disponiveis: readme.md  .secret  .gitconfig  .bashrc",
          ),
          mkLine("output", ""),
        );
        commit(nl, raw);
        return;
      }

      if (t.startsWith("cat ")) {
        const file = t.slice(4).trim();
        const res = resolveCmd(`cat ${file}`);
        res
          ? push(nl, res)
          : nl.push(
              mkLine("error", `  cat: ${file}: No such file or directory`),
            );
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t.startsWith("touch ")) {
        const f = raw.slice(6).trim();
        nl.push(
          f
            ? mkLine("output", `  touch: created '${f}'`)
            : mkLine("hint", "  uso: touch <arquivo>"),
        );
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t.startsWith("mkdir ")) {
        const d = raw.slice(6).trim();
        nl.push(
          d
            ? mkLine("output", `  mkdir: created '${d}'`)
            : mkLine("hint", "  uso: mkdir <pasta>"),
        );
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t.startsWith("rm ")) {
        if (t === "rm -rf /" || t === "sudo rm -rf /") {
          push(nl, resolveCmd("sudo rm -rf /") ?? []);
        } else {
          const f = raw.slice(3).trim();
          nl.push(
            f
              ? mkLine("output", `  removed '${f}'`)
              : mkLine("hint", "  uso: rm <arquivo>"),
          );
        }
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t.startsWith("rmdir ")) {
        const d = raw.slice(6).trim();
        nl.push(
          d
            ? mkLine("output", `  rmdir: removed '${d}'`)
            : mkLine("hint", "  uso: rmdir <pasta>"),
        );
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t.startsWith("man")) {
        push(nl, resolveCmd("man") ?? []);
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t.startsWith("login ") || t === "login") {
        TerminalState.initSession(inst.uid);
        const parts = raw.split(/\s+/);
        const r = TerminalState.login(inst.uid, parts[1] ?? "", parts[2] ?? "");
        nl.push(
          r.ok ? mkLine("output", `  ${r.msg}`) : mkLine("error", `  ${r.msg}`),
        );
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "logout") {
        TerminalState.initSession(inst.uid);
        const r = TerminalState.logout(inst.uid);
        nl.push(mkLine("output", `  ${r.msg}`), mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "scan") {
        TerminalState.initSession(inst.uid);
        const r = TerminalState.scan(inst.uid);
        push(nl, r.ok && r.targets ? (resolveCmd("scan") ?? []) : []);
        if (!r.ok) nl.push(mkLine("error", `  ${r.msg}`));
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t.startsWith("connect ")) {
        TerminalState.initSession(inst.uid);
        const target = raw.slice(8).trim();
        const r = TerminalState.connect(inst.uid, target);
        nl.push(
          r.ok
            ? mkLine("output", `  ${r.msg ?? "conectado"}`)
            : mkLine("error", `  ${r.msg}`),
        );
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "dump") {
        TerminalState.initSession(inst.uid);
        const r = TerminalState.dumpSecrets(inst.uid);
        if (r.ok && r.secrets)
          Object.entries(r.secrets).forEach(([k, v]) =>
            nl.push(mkLine("output", `  ${k}=${v}`)),
          );
        else nl.push(mkLine("error", `  ${r.msg}`));
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "getcreds") {
        TerminalState.initSession(inst.uid);
        const r = TerminalState.fetchCredsSequence(inst.uid);
        if (r.ok && r.creds)
          Object.entries(r.creds).forEach(([k, v]) =>
            nl.push(mkLine("output", `  ${k}=${v}`)),
          );
        else nl.push(mkLine("hint", `  ${r.msg ?? "sequencia incompleta"}`));
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t.startsWith("which ")) {
        const known: Record<string, string> = {
          node: "/usr/local/bin/node",
          npm: "/usr/local/bin/npm",
          git: "/usr/bin/git",
          code: "/usr/local/bin/code",
          bash: "/bin/bash",
          zsh: "/usr/bin/zsh",
          python: "/usr/bin/python3",
          docker: "/usr/bin/docker",
        };
        const arg = t.slice(6).trim();
        nl.push(
          known[arg]
            ? mkLine("output", `  ${known[arg]}`)
            : mkLine("error", `  which: no ${arg} in PATH`),
        );
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t.startsWith("ping ")) {
        const host = t.slice(5).trim();
        const ip = `${~~(Math.random() * 200 + 50)}.${~~(Math.random() * 200)}.${~~(Math.random() * 100)}.${~~(Math.random() * 254 + 1)}`;
        const ms = (Math.random() * 20 + 10).toFixed(1);
        nl.push(
          mkLine("output", `  PING ${host} (${ip})`),
          mkLine("output", `  64 bytes  icmp_seq=0  time=${ms} ms`),
          mkLine(
            "output",
            `  64 bytes  icmp_seq=1  time=${(+ms - 0.3).toFixed(1)} ms`,
          ),
          mkLine(
            "output",
            `  64 bytes  icmp_seq=2  time=${(+ms + 0.2).toFixed(1)} ms`,
          ),
          mkLine("output", ""),
          mkLine("output", `  3 packets  0% loss  avg=${ms} ms`),
          mkLine("output", ""),
        );
        commit(nl, raw);
        return;
      }

      if (t.startsWith("ssh ") && t !== "ssh") {
        const host = t.slice(4).trim();
        if (host === "glatz@glatz.dev" || host === "glatz.dev")
          push(nl, resolveCmd("ssh glatz@glatz.dev") ?? []);
        else
          nl.push(
            mkLine("output", `  Connecting to ${host}...`),
            mkLine("error", `  ssh: connect to ${host}: Connection refused`),
          );
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t.startsWith("curl ")) {
        const url = raw.slice(5).trim();
        if (url.includes("github.com/users/glatztp"))
          push(
            nl,
            resolveCmd("curl https://api.github.com/users/glatztp") ?? [],
          );
        else if (url.startsWith("https://") || url.startsWith("http://"))
          nl.push(mkLine("error", "  curl: (22) 404 Not Found"));
        else nl.push(mkLine("error", "  curl: URL invalida"));
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t.startsWith("sudo ")) {
        const sub = t.slice(5).trim();
        push(
          nl,
          sub === "rm -rf /" || sub === "rm -rf /*"
            ? (resolveCmd("sudo rm -rf /") ?? [])
            : (resolveCmd("sudo") ?? []),
        );
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t.startsWith("git")) {
        const res = resolveCmd(t);
        if (res) push(nl, res);
        else {
          nl.push(
            mkLine("error", `  git: '${raw.slice(4)}' is not a git command`),
          );
          nl.push(
            mkLine(
              "hint",
              "  tente: git log  git status  git branch  git diff",
            ),
          );
        }
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t.startsWith("npm")) {
        const res = resolveCmd(t);
        if (res) push(nl, res);
        else {
          nl.push(mkLine("error", "  npm: comando nao reconhecido"));
          nl.push(
            mkLine("hint", "  tente: npm run dev  npm run build  npm install"),
          );
        }
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t.startsWith("find")) {
        push(nl, resolveCmd("find . -name '*.tsx'") ?? []);
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }
      if (t.startsWith("grep")) {
        push(nl, resolveCmd("grep -r 'Gabriel' .") ?? []);
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "uname" || t === "uname -a") {
        push(nl, resolveCmd(t) ?? []);
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "ls" || t === "ls -la" || t === "ls -l" || t === "ls -a") {
        push(nl, resolveCmd(t === "ls" ? "ls" : "ls -la") ?? []);
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "ps" || t === "ps aux" || t === "ps -aux") {
        push(nl, resolveCmd(t === "ps" ? "ps" : "ps aux") ?? []);
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      // ── open <destino> — abre link real ──────────────────────────────────
      if (t.startsWith("open ")) {
        const target = t.slice(5).trim();
        const url = OPEN_TARGETS[target];
        if (url) {
          if (url.startsWith("#")) {
            const sectionId = GOTO_SECTIONS[target] ?? url;
            if (onGoto) {
              onGoto(sectionId);
              nl.push(mkLine("output", `  goto: scrolling to '${target}'`));
            } else {
              const el = document.querySelector(url);
              if (el) el.scrollIntoView({ behavior: "smooth" });
              nl.push(mkLine("output", `  goto: scrolling to '${target}'`));
            }
          } else {
            window.open(url, "_blank", "noopener,noreferrer");
            nl.push(mkLine("output", `  opening: ${url}`));
          }
        } else {
          nl.push(mkLine("error", `  open: '${target}' nao reconhecido`));
          nl.push(
            mkLine(
              "hint",
              "  opcoes: github  linkedin  email  projects  contact",
            ),
          );
        }
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "open") {
        push(nl, resolveCmd("open") ?? []);
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      // ── copy <campo> — copia para clipboard ───────────────────────────────
      if (t.startsWith("copy ")) {
        const target = t.slice(5).trim();
        const val = COPY_TARGETS[target];
        if (val) {
          nl.push(mkLine("output", `  copiando ${target}...`));
          commit(nl, raw);
          navigator.clipboard
            .writeText(val)
            .then(() =>
              appendLines(
                mkLine("output", `  copied: ${val}`),
                mkLine("output", ""),
              ),
            )
            .catch(() =>
              appendLines(
                mkLine("error", "  clipboard: permissao negada"),
                mkLine("output", ""),
              ),
            );
        } else {
          nl.push(mkLine("error", `  copy: '${target}' nao reconhecido`));
          nl.push(
            mkLine("hint", "  opcoes: email  github  linkedin  portfolio"),
          );
          nl.push(mkLine("output", ""));
          commit(nl, raw);
        }
        return;
      }

      if (t === "copy") {
        push(nl, resolveCmd("copy") ?? []);
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      // ── download <arquivo> ────────────────────────────────────────────────
      if (t.startsWith("download ")) {
        const target = t.slice(9).trim();

        if (target === "vcard") {
          triggerDownload(buildVCard(), "gabriel-glatz.vcf", "text/vcard");
          nl.push(mkLine("output", "  download iniciado: gabriel-glatz.vcf"));
          nl.push(mkLine("hint", "  abra o arquivo para salvar o contato"));
        } else if (target === "log") {
          const logContent = hist
            .slice()
            .reverse()
            .map((cmd, i) => `${String(i + 1).padStart(3, "0")}  ${cmd}`)
            .join("\n");
          const content = `glatz-terminal session log\n${new Date().toISOString()}\n${"─".repeat(40)}\n${logContent}\n`;
          triggerDownload(content, `terminal-log-${Date.now()}.txt`);
          nl.push(mkLine("output", "  download iniciado: terminal-log.txt"));
        } else {
          nl.push(mkLine("error", `  download: '${target}' nao reconhecido`));
          nl.push(mkLine("hint", "  opcoes: vcard  log"));
        }

        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "download") {
        push(nl, resolveCmd("download") ?? []);
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      // ── goto <secao> — scroll na pagina ───────────────────────────────────
      if (t.startsWith("goto ")) {
        const target = t.slice(5).trim();
        const sectionId = GOTO_SECTIONS[target];
        if (sectionId) {
          if (onGoto) {
            onGoto(sectionId);
          } else {
            const el = document.querySelector(sectionId);
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }
          nl.push(mkLine("output", `  scrolling to: ${target}`));
        } else {
          nl.push(mkLine("error", `  goto: '${target}' nao encontrado`));
          nl.push(
            mkLine("hint", "  opcoes: top  about  projects  skills  contact"),
          );
        }
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "goto") {
        push(nl, resolveCmd("goto") ?? []);
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      // ── calc <expressao> ─────────────────────────────────────────────────
      if (t.startsWith("calc ")) {
        const expr = raw.slice(5).trim();
        const result = safeCalc(expr);
        if (result !== null) {
          nl.push(mkLine("output", `  ${expr} = ${result}`));
        } else {
          nl.push(mkLine("error", "  calc: expressao invalida"));
          nl.push(mkLine("hint", "  ex: calc 2 + 2  |  calc (50 * 1.1)"));
        }
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "calc") {
        push(nl, resolveCmd("calc") ?? []);
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      // ── uuid ──────────────────────────────────────────────────────────────
      if (t === "uuid") {
        const id = genUUID();
        nl.push(mkLine("output", `  ${id}`));
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        navigator.clipboard?.writeText(id).catch(() => {});
        return;
      }

      // ── timestamp ─────────────────────────────────────────────────────────
      if (t === "timestamp") {
        const now = Date.now();
        nl.push(
          mkLine("output", `  ms   ${now}`),
          mkLine("output", `  s    ${Math.floor(now / 1000)}`),
          mkLine("output", `  iso  ${new Date(now).toISOString()}`),
          mkLine("output", ""),
        );
        commit(nl, raw);
        return;
      }

      // ── base64 encode/decode <texto> ──────────────────────────────────────
      if (t.startsWith("base64 ")) {
        const parts = raw.slice(7).split(" ");
        const action = parts[0]?.toLowerCase();
        const text = parts.slice(1).join(" ");

        if (!text) {
          push(nl, resolveCmd("base64") ?? []);
          nl.push(mkLine("output", ""));
          commit(nl, raw);
          return;
        }

        try {
          if (action === "encode") {
            nl.push(
              mkLine("output", `  ${btoa(unescape(encodeURIComponent(text)))}`),
            );
          } else if (action === "decode") {
            nl.push(
              mkLine("output", `  ${decodeURIComponent(escape(atob(text)))}`),
            );
          } else {
            nl.push(
              mkLine("error", "  base64: acao invalida"),
              mkLine("hint", "  use: encode ou decode"),
            );
          }
        } catch {
          nl.push(mkLine("error", "  base64: texto invalido para decode"));
        }

        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "base64") {
        push(nl, resolveCmd("base64") ?? []);
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      // ── timer <minutos> ───────────────────────────────────────────────────
      if (t.startsWith("timer ")) {
        const arg = t.slice(6).trim();

        if (arg === "stop" || arg === "cancel") {
          if (timersRef.current.size === 0) {
            nl.push(mkLine("hint", "  nenhum timer ativo"));
          } else {
            timersRef.current.forEach((timer) => clearInterval(timer.id));
            timersRef.current.clear();
            nl.push(mkLine("output", "  todos os timers cancelados"));
          }
          nl.push(mkLine("output", ""));
          commit(nl, raw);
          return;
        }

        if (arg === "list") {
          if (timersRef.current.size === 0) {
            nl.push(mkLine("hint", "  nenhum timer ativo"));
          } else {
            timersRef.current.forEach((timer) => {
              const remaining = Math.max(
                0,
                Math.ceil((timer.endsAt - Date.now()) / 60000),
              );
              nl.push(
                mkLine(
                  "output",
                  `  ${timer.label}  —  ${remaining} min restantes`,
                ),
              );
            });
          }
          nl.push(mkLine("output", ""));
          commit(nl, raw);
          return;
        }

        const minutes = parseFloat(arg);
        if (isNaN(minutes) || minutes <= 0 || minutes > 480) {
          nl.push(mkLine("error", "  timer: valor invalido (1–480 minutos)"));
          nl.push(mkLine("output", ""));
          commit(nl, raw);
          return;
        }

        const timerId = `t_${Date.now()}`;
        const endsAt = Date.now() + minutes * 60 * 1000;
        const label = `timer ${minutes}min`;

        nl.push(mkLine("output", `  timer iniciado: ${minutes} min`));
        nl.push(mkLine("hint", `  use 'timer stop' para cancelar`));

        const intervalMs = Math.min(60000, minutes * 60000 * 0.25);
        let notified = false;

        const intervalId = setInterval(() => {
          const remaining = Math.ceil((endsAt - Date.now()) / 60000);

          if (Date.now() >= endsAt && !notified) {
            notified = true;
            clearInterval(intervalId);
            timersRef.current.delete(timerId);
            appendLines(
              mkLine("hint", `  timer: ${minutes} min concluido!`),
              mkLine("output", ""),
            );
            if (
              typeof window !== "undefined" &&
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification(`Timer: ${minutes} min`, {
                body: "Tempo esgotado!",
              });
            }
          } else if (
            remaining > 0 &&
            remaining % Math.max(1, Math.floor(minutes / 4)) === 0
          ) {
            appendLines(
              mkLine("output", `  timer: ${remaining} min restantes`),
            );
          }
        }, intervalMs);

        timersRef.current.set(timerId, { id: intervalId, label, endsAt });
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      if (t === "timer") {
        push(nl, resolveCmd("timer") ?? []);
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      // ── note ─────────────────────────────────────────────────────────────
      if (t.startsWith("note ") || t === "note") {
        const rest = raw.slice(5).trim();
        const action = rest.split(" ")[0]?.toLowerCase();

        if (action === "add") {
          const text = rest.slice(4).trim();
          if (!text) {
            nl.push(mkLine("hint", "  uso: note add <texto>"));
          } else {
            setNotes((prev) => {
              const updated = [...prev, { text }];
              nl.push(
                mkLine(
                  "output",
                  `  nota ${updated.length} adicionada: ${text}`,
                ),
              );
              return updated;
            });
          }
        } else if (action === "list") {
          if (notes.length === 0) {
            nl.push(mkLine("hint", "  nenhuma nota. use: note add <texto>"));
          } else {
            nl.push(mkLine("output", "  NOTAS"));
            nl.push(
              mkLine("output", "  ─────────────────────────────────────────"),
            );
            notes.forEach((n, i) =>
              nl.push(
                mkLine(
                  "output",
                  `  ${String(i + 1).padStart(2, " ")}. ${n.text}`,
                ),
              ),
            );
          }
        } else if (action === "clear") {
          setNotes([]);
          nl.push(mkLine("output", "  notas apagadas"));
        } else {
          push(nl, resolveCmd("note") ?? []);
        }

        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      // ── todo ──────────────────────────────────────────────────────────────
      if (t.startsWith("todo ") || t === "todo") {
        const rest = raw.slice(5).trim();
        const action = rest.split(" ")[0]?.toLowerCase();

        if (action === "add") {
          const text = rest.slice(4).trim();
          if (!text) {
            nl.push(mkLine("hint", "  uso: todo add <tarefa>"));
          } else {
            setTodos((prev) => {
              const updated = [...prev, { text, done: false }];
              nl.push(
                mkLine(
                  "output",
                  `  tarefa ${updated.length} adicionada: ${text}`,
                ),
              );
              return updated;
            });
          }
        } else if (action === "list") {
          if (todos.length === 0) {
            nl.push(mkLine("hint", "  nenhuma tarefa. use: todo add <tarefa>"));
          } else {
            nl.push(mkLine("output", "  TODO LIST"));
            nl.push(
              mkLine("output", "  ─────────────────────────────────────────"),
            );
            todos.forEach((item, i) => {
              const status = item.done ? "[x]" : "[ ]";
              nl.push(
                mkLine(
                  "output",
                  `  ${status} ${String(i + 1).padStart(2, " ")}. ${item.text}`,
                ),
              );
            });
            const done = todos.filter((x) => x.done).length;
            nl.push(mkLine("hint", `  ${done}/${todos.length} concluidas`));
          }
        } else if (action === "done") {
          const n = parseInt(rest.split(" ")[1] ?? "");
          if (isNaN(n) || n < 1 || n > todos.length) {
            nl.push(
              mkLine("error", `  todo: indice invalido (1–${todos.length})`),
            );
          } else {
            setTodos((prev) =>
              prev.map((item, i) =>
                i === n - 1 ? { ...item, done: true } : item,
              ),
            );
            nl.push(mkLine("output", `  tarefa ${n} marcada como concluida`));
          }
        } else if (action === "clear") {
          setTodos([]);
          nl.push(mkLine("output", "  lista de tarefas apagada"));
        } else {
          push(nl, resolveCmd("todo") ?? []);
        }

        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      // ── share ─────────────────────────────────────────────────────────────
      if (t === "share") {
        const shareData = {
          title: "Gabriel Glatz — Portfolio",
          text: "Confira o portfolio de Gabriel Glatz, Software Developer.",
          url: "https://glatz.dev",
        };

        if (navigator.share) {
          nl.push(mkLine("output", "  abrindo Web Share API..."));
          commit(nl, raw);
          navigator
            .share(shareData)
            .then(() =>
              appendLines(
                mkLine("output", "  compartilhado com sucesso"),
                mkLine("output", ""),
              ),
            )
            .catch(() =>
              appendLines(
                mkLine("hint", "  compartilhamento cancelado"),
                mkLine("output", ""),
              ),
            );
        } else {
          navigator.clipboard?.writeText(shareData.url).catch(() => {});
          nl.push(mkLine("output", "  URL copiada: https://glatz.dev"));
          nl.push(
            mkLine("hint", "  Web Share API nao disponivel neste browser"),
          );
          nl.push(mkLine("output", ""));
          commit(nl, raw);
        }
        return;
      }

      // ── tweet ─────────────────────────────────────────────────────────────
      if (t === "tweet") {
        const text = encodeURIComponent(
          "Acabei de visitar o portfolio de @gabrielglatz — muito bom! https://glatz.dev",
        );
        window.open(
          `https://twitter.com/intent/tweet?text=${text}`,
          "_blank",
          "noopener,noreferrer",
        );
        nl.push(mkLine("output", "  abrindo Twitter..."));
        nl.push(mkLine("output", ""));
        commit(nl, raw);
        return;
      }

      // ── fallback COMMANDS dict ─────────────────────────────────────────────
      const res = resolveCmd(t);
      if (res && res.length > 0) {
        push(nl, res);
        nl.push(mkLine("output", ""));
      } else if (!res) {
        nl.push(
          mkLine("error", `  command not found: ${raw}`),
          mkLine("hint", "  type 'help' para ver os comandos"),
          mkLine("output", ""),
        );
      }
      commit(nl, raw);
    },
    [inst.uid, hist, notes, todos, onClose, onNew, onGoto, commit, appendLines],
  );

  const confirmMatrix = useCallback(() => {
    setShowWarning(false);
    const steps: { d: number; text: string; type: Line["type"] }[] = [
      { d: 100, text: "  [SYS] iniciando protocolo root...", type: "output" },
      { d: 500, text: "  > conectando ao kernel...", type: "output" },
      {
        d: 950,
        text: "  > bypassando firewall............ [OK]",
        type: "output",
      },
      { d: 1300, text: "  > descriptografando memoria RAM...", type: "output" },
      { d: 1650, text: "  !! ACESSO CONCEDIDO — NIVEL ROOT !!", type: "error" },
      { d: 1950, text: "  ## CORROMPENDO DADOS DO SISTEMA ##", type: "error" },
      {
        d: 2200,
        text: "  ##################################  100%",
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
      mkLine("hint", "  operacao cancelada."),
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
    } else if (e.key === "Tab") {
      e.preventDefault();
      const partial = input.toLowerCase().trim();
      if (!partial) return;
      const candidates = Object.keys(COMMANDS).filter((k) =>
        k.startsWith(partial),
      );
      if (candidates.length === 1) {
        setInput(candidates[0]);
      } else if (candidates.length > 1) {
        const nl = [
          mkLine("input", `${PROMPT} ${input}`),
          mkLine("hint", `  ${candidates.slice(0, 10).join("  ")}`),
          mkLine("output", ""),
        ];
        setLines((p) => [...p, ...nl]);
      }
    }
  };

  return (
    <>
      <motion.div
        ref={winRef}
        className="terminal-window"
        style={{
          position: "fixed",
          top: pos.top,
          left: pos.left,
          width: size.w,
          height: size.h,
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
          onPointerDown={startDrag} // Usando nossa nova função
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
            <span className="terminal-dot terminal-dot--yellow" />
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

        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {(
            ["top-left", "top-right", "bottom-left", "bottom-right"] as const
          ).map((dir) => (
            <div
              key={dir}
              onPointerDown={startResize(dir)}
              style={{
                position: "absolute",
                width: 12,
                height: 12,
                ...(dir.includes("top") ? { top: 0 } : { bottom: 0 }),
                ...(dir.includes("left") ? { left: 0 } : { right: 0 }),
                cursor:
                  dir === "top-left" || dir === "bottom-right"
                    ? "nwse-resize"
                    : "nesw-resize",
                pointerEvents: "auto",
              }}
            />
          ))}
          <div
            onPointerDown={startResize("top")}
            style={{
              position: "absolute",
              left: 12,
              right: 12,
              top: 0,
              height: 6,
              cursor: "ns-resize",
              pointerEvents: "auto",
            }}
          />
          <div
            onPointerDown={startResize("bottom")}
            style={{
              position: "absolute",
              left: 12,
              right: 12,
              bottom: 0,
              height: 6,
              cursor: "ns-resize",
              pointerEvents: "auto",
            }}
          />
          <div
            onPointerDown={startResize("left")}
            style={{
              position: "absolute",
              top: 12,
              bottom: 12,
              left: 0,
              width: 6,
              cursor: "ew-resize",
              pointerEvents: "auto",
            }}
          />
          <div
            onPointerDown={startResize("right")}
            style={{
              position: "absolute",
              top: 12,
              bottom: 12,
              right: 0,
              width: 6,
              cursor: "ew-resize",
              pointerEvents: "auto",
            }}
          />
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
                este efeito contem{" "}
                <strong style={{ color: "#ede8dc" }}>
                  luzes piscantes, flashes e movimentos bruscos
                </strong>
                . Pode causar desconforto em pessoas com epilepsia
                fotossensitiva.
              </p>
              <div
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
    </>
  );
}