export type Session = {
  uid: number;
  authenticated?: boolean;
  scanned?: boolean;
  connected?: string | null;
  steps: string[];
};

export type SessionWithFs = Session & {
  fs?: FileSystem;
  explorerOpen?: boolean;
};

export type FileSystem = {
  files: Record<string, string>;
  dirs: Set<string>;
  cwd: string;
};

const sessions = new Map<number, Session>();

export function initSession(uid: number) {
  if (!sessions.has(uid)) {
    sessions.set(uid, {
      uid,
      authenticated: false,
      scanned: false,
      connected: null,
      steps: [],
    });
  }
}

export function getSession(uid: number): Session | undefined {
  return sessions.get(uid);
}

export type OkResult = {
  ok: true;
  msg?: string;
  targets?: string[];
  secrets?: Record<string, string>;
  creds?: Record<string, string>;
  path?: string;
  content?: string;
  files?: string[];
  dirs?: string[];
  explorerOpen?: boolean;
};

export type ErrResult = { ok: false; msg: string };

export type Result = OkResult | ErrResult;

export function login(uid: number, user: string, pass: string): Result {
  initSession(uid);
  const s = sessions.get(uid)!;
  if (user === "admin" && pass === "glatz") {
    s.authenticated = true;
    s.steps.push("login");
    return { ok: true, msg: "login bem-sucedido" };
  }
  return { ok: false, msg: "login falhou: usuário/senha inválidos" };
}

export function logout(uid: number): Result {
  initSession(uid);
  const s = sessions.get(uid)!;
  s.authenticated = false;
  s.steps.push("logout");
  s.scanned = false;
  s.connected = null;
  return { ok: true, msg: "desconectado" };
}

export function scan(uid: number): Result {
  initSession(uid);
  const s = sessions.get(uid)!;
  s.scanned = true;
  s.steps.push("scan");
  return { ok: true, targets: ["db.local", "cache.local", "admin.panel"] };
}

export function connect(uid: number, target: string): Result {
  initSession(uid);
  const s = sessions.get(uid)!;
  if (!s.scanned)
    return {
      ok: false,
      msg: "nenhum alvo encontrado. execute 'scan' primeiro.",
    };
  const allowed = ["db.local", "cache.local", "admin.panel"];
  if (!allowed.includes(target))
    return { ok: false, msg: `alvo '${target}' não encontrado` };
  s.connected = target;
  s.steps.push(`connect:${target}`);
  return { ok: true, msg: `conectado em ${target}` };
}

export function dumpSecrets(uid: number): Result {
  initSession(uid);
  const s = sessions.get(uid)!;
  if (s.connected === "db.local" || s.authenticated) {
    s.steps.push("dump");
    return {
      ok: true,
      secrets: {
        DB_USER: "glatz_user",
        DB_PASS: "p4ssw0rd_rela",
        TOKEN: "S3CR3T-PORTFOLIO-XXXX",
      },
    };
  }
  return {
    ok: false,
    msg: "acesso negado. autentique-se ou conecte ao db.local",
  };
}

export function fetchCredsSequence(uid: number): Result {
  initSession(uid);
  const s = sessions.get(uid)!;
  const hasLogin = s.steps.includes("login");
  const connectedAdmin = s.steps.find((st) =>
    st.startsWith("connect:admin.panel"),
  );
  const scanned = s.steps.includes("scan");
  if (scanned && connectedAdmin && hasLogin) {
    s.steps.push("fetchcreds");
    return { ok: true, creds: { ADMIN_TOKEN: "ADMIN-PORTFOLIO-FAKE-0001" } };
  }
  return {
    ok: false,
    msg: "sequência incompleta. tenta: scan -> connect admin.panel -> login admin <senha>",
  };
}

export function resetSession(uid: number) {
  sessions.delete(uid);
}

export function debugSessions() {
  return Array.from(sessions.values());
}

export function initFs(uid: number) {
  initSession(uid);
  const s = sessions.get(uid)! as SessionWithFs;
  // lazy init
  if (!s.fs) {
    s.fs = {
      files: {} as Record<string, string>,
      dirs: new Set<string>(["/"]),
      cwd: "/home/visitor",
    };
  }
}

export function listFs(uid: number): { files: string[]; dirs: string[] } {
  initFs(uid);
  const s = sessions.get(uid)! as SessionWithFs;
  const fs = s.fs!;
  return { files: Object.keys(fs.files), dirs: Array.from(fs.dirs) };
}

export function touchFile(uid: number, path: string, content = ""): Result {
  initFs(uid);
  const s = sessions.get(uid)! as SessionWithFs;
  const fs = s.fs!;
  fs.files[path] = content;
  return { ok: true, path };
}

export function mkdirDir(uid: number, path: string): Result {
  initFs(uid);
  const s = sessions.get(uid)! as SessionWithFs;
  const fs = s.fs!;
  fs.dirs.add(path);
  return { ok: true, path };
}

export function rmFile(uid: number, path: string): Result {
  initFs(uid);
  const s = sessions.get(uid)! as SessionWithFs;
  const fs = s.fs!;
  if (fs.files[path]) {
    delete fs.files[path];
    return { ok: true, path };
  }
  return { ok: false, msg: `arquivo '${path}' não encontrado` };
}

export function rmdirDir(uid: number, path: string): Result {
  initFs(uid);
  const s = sessions.get(uid)! as SessionWithFs;
  const fs = s.fs!;
  // only remove if empty (no files with prefix)
  const hasChildren = Object.keys(fs.files).some(
    (f) => f.startsWith(path + "/") || f === path,
  );
  if (hasChildren) return { ok: false, msg: `pasta '${path}' não vazia` };
  if (fs.dirs.has(path)) {
    fs.dirs.delete(path);
    return { ok: true, path };
  }
  return { ok: false, msg: `pasta '${path}' não encontrada` };
}

export function readFile(uid: number, path: string): Result {
  initFs(uid);
  const s = sessions.get(uid)! as SessionWithFs;
  const fs = s.fs!;
  if (fs.files[path] !== undefined)
    return { ok: true, content: fs.files[path] };
  return { ok: false, msg: `arquivo '${path}' não encontrado` };
}

export function writeFile(uid: number, path: string, content: string): Result {
  initFs(uid);
  const s = sessions.get(uid)! as SessionWithFs;
  const fs = s.fs!;
  fs.files[path] = content;
  return { ok: true, path };
}

export function openExplorer(uid: number): Result {
  initSession(uid);
  const s = sessions.get(uid)! as SessionWithFs;
  s.explorerOpen = true;
  return { ok: true, explorerOpen: true };
}

export function closeExplorer(uid: number): Result {
  initSession(uid);
  const s = sessions.get(uid)! as SessionWithFs;
  s.explorerOpen = false;
  return { ok: true, explorerOpen: false };
}
