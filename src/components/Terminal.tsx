"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScreenGlitch from "./ScreenGlitch";
import TermWin from "./terminal/TermWin";

interface TermInst {
  uid: number;
  z: number;
  idx: number;
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
