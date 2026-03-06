export interface Line {
  id: number;
  type: "banner" | "input" | "output" | "error" | "hint";
  content: string;
}

let _gid = typeof window !== "undefined" ? Date.now() : 1e12;
export const mkLine = (type: Line["type"], content: string): Line => ({
  id: _gid++,
  type,
  content,
});

export const PROMPT = "visitor@glatz:~$";

const _upSince = new Date(Date.now() - 1000 * 60 * 60 * 3.4);
export const _uptimeStr = () => {
  const d = Math.floor((Date.now() - _upSince.getTime()) / 1000);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = d % 60;
  return `${h}h ${m}m ${s}s`;
};

const hrow = (a: string, b = "") => `  ${a.padEnd(36)}${b}`;

export const COMMANDS: Record<string, string[] | (() => string[])> = {
  whoami: [
    "  Gabriel Glatz",
    "  Software Developer",
    "  ─────────────────────────────────────────",
    "  Stack      React  TypeScript  Next.js",
    "  Backend    Node.js  PostgreSQL  REST",
    "  Local      Brasil",
    "  Foco       Interfaces, DX e performance",
    "  ─────────────────────────────────────────",
    "  Entusiasta por codigo limpo e UX bem feito.",
  ],

  about: [
    "  Gabriel Glatz — Software Developer",
    "  ─────────────────────────────────────────",
    "  Foco em interfaces rapidas, acessiveis",
    "  e com experiencia de usuario bem pensada.",
    "",
    "  Aberto a novas oportunidades.",
    "  use 'contact' para entrar em contato.",
  ],

  skills: [
    "  FRONTEND",
    "  ─────────────────────────────────────────",
    "  React  Next.js  TypeScript  Tailwind CSS",
    "  Framer Motion  HTML  CSS  Storybook",
    "",
    "  BACKEND",
    "  ─────────────────────────────────────────",
    "  Node.js  REST APIs  PostgreSQL  Prisma ORM",
    "",
    "  FERRAMENTAS",
    "  ─────────────────────────────────────────",
    "  Git  Docker  Figma  VS Code  Vercel",
    "",
    "  SOFT SKILLS",
    "  ─────────────────────────────────────────",
    "  Design Thinking  Clean Code  SOLID  DX",
  ],

  stack: [
    "  Linguagens    TypeScript  JavaScript  SQL",
    "  Frameworks    React  Next.js",
    "  Estilo        Tailwind CSS  CSS Modules",
    "  Banco         PostgreSQL  SQLite  Prisma",
    "  DevOps        Docker  Vercel  Railway",
    "  Testes        Vitest  Testing Library",
  ],

  lang: [
    "  PROFICIENCIA",
    "  ─────────────────────────────────────────",
    "  TypeScript   ####################  expert",
    "  JavaScript   ####################  expert",
    "  HTML/CSS     ####################  expert",
    "  SQL          ################       avancado",
    "  Python       ############           medio",
    "  Bash         ########               basico",
  ],

  projects: [
    "  01  E-Commerce",
    "      React  Node.js  PostgreSQL  REST API",
    "      Carrinho, checkout, admin, autenticacao",
    "  ─────────────────────────────────────────",
    "  02  Dashboard Analytics",
    "      React  TypeScript  Recharts  TanStack Query",
    "      Graficos, filtros, exportacao de dados",
    "  ─────────────────────────────────────────",
    "  03  Landing Page SaaS",
    "      Next.js  Tailwind  Framer Motion",
    "      Animacoes, SEO, 99/100 Lighthouse",
    "  ─────────────────────────────────────────",
    "  use 'open projects' para ver no site",
  ],

  experience: [
    "  Desenvolvedor Frontend          2024 — atual",
    "  Freelance",
    "  ─────────────────────────────────────────",
    "  Stack: React  Next.js  TypeScript  Node.js",
    "  Desenvolvimento de interfaces e sistemas web.",
    "",
    "  Desenvolvedor Web               2023 — 2024",
    "  Projetos pessoais e colaborativos",
    "  ─────────────────────────────────────────",
    "  Stack: React  Node.js  SQL  REST API",
    "  Construcao de projetos full-stack do zero.",
  ],

  contact: [
    "  CONTATO",
    "  ─────────────────────────────────────────",
    "  Email      gabrielfellipeglatz@gmail.com",
    "  GitHub     github.com/glatztp",
    "  LinkedIn   linkedin.com/in/gabriel-glatz",
    "  ─────────────────────────────────────────",
    "  use 'open contact' para o formulario",
  ],

  links: [
    "  GitHub      https://github.com/glatztp",
    "  LinkedIn    https://linkedin.com/in/gabriel-glatz",
    "  Email       gabrielfellipeglatz@gmail.com",
    "  Portfolio   https://glatz.dev",
  ],

  github: [
    "  github.com/glatztp",
    "  ─────────────────────────────────────────",
    "  Repositorios publicos, projetos open-source",
    "  e contribuicoes.",
  ],

  cv: [
    "  Curriculo / Resume",
    "  ─────────────────────────────────────────",
    "  Disponivel sob solicitacao.",
    "  Email: gabrielfellipeglatz@gmail.com",
  ],

  open: [
    "  uso: open <destino>",
    "  ─────────────────────────────────────────",
    "  github     abre github.com/glatztp",
    "  linkedin   abre linkedin",
    "  email      abre cliente de email",
    "  projects   abre secao de projetos",
    "  contact    abre secao de contato",
  ],

  copy: [
    "  uso: copy <campo>",
    "  ─────────────────────────────────────────",
    "  email      copia o email",
    "  github     copia URL do github",
    "  linkedin   copia URL do linkedin",
  ],

  download: [
    "  uso: download <arquivo>",
    "  ─────────────────────────────────────────",
    "  vcard      baixa contato (.vcf)",
    "  log        baixa historico da sessao (.txt)",
  ],

  goto: [
    "  uso: goto <secao>",
    "  ─────────────────────────────────────────",
    "  top        volta ao topo",
    "  about      secao sobre",
    "  projects   secao projetos",
    "  skills     secao skills",
    "  contact    secao contato",
  ],

  calc: [
    "  uso: calc <expressao>",
    "  ─────────────────────────────────────────",
    "  calc 2 + 2",
    "  calc 100 * 1.1",
    "  calc (50 + 30) / 4",
  ],

  uuid: ["  gera um UUID v4 unico"],

  timestamp: ["  retorna o Unix timestamp atual (ms e s)"],

  base64: [
    "  uso: base64 encode <texto>",
    "       base64 decode <texto>",
    "  ─────────────────────────────────────────",
    "  ex: base64 encode Gabriel",
    "  ex: base64 decode R2FicmllbA==",
  ],

  timer: [
    "  uso: timer <minutos>",
    "  ─────────────────────────────────────────",
    "  timer 25   inicia pomodoro de 25 min",
    "  timer 5    lembrete em 5 minutos",
    "  ex: timer stop  cancela todos",
  ],

  note: [
    "  uso: note <acao> [texto]",
    "  ─────────────────────────────────────────",
    "  note add <texto>   adiciona nota",
    "  note list          lista todas as notas",
    "  note clear         apaga todas as notas",
  ],

  todo: [
    "  uso: todo <acao> [texto]",
    "  ─────────────────────────────────────────",
    "  todo add <tarefa>  adiciona tarefa",
    "  todo list          lista tarefas",
    "  todo done <n>      marca tarefa N como feita",
    "  todo clear         apaga todas",
  ],

  share: ["  compartilha este portfolio via Web Share API"],

  tweet: ["  abre twitter com texto pre-definido sobre o portfolio"],

  ls: [
    "  drwxr-xr-x   hero/",
    "  drwxr-xr-x   sobre/",
    "  drwxr-xr-x   projetos/",
    "  drwxr-xr-x   skills/",
    "  drwxr-xr-x   experiencia/",
    "  drwxr-xr-x   contato/",
    "  -rw-r--r--   README.md",
    "  -rw-r--r--   .secret",
    "",
    "  use 'ls -la' para listagem completa",
  ],

  "ls -la": [
    "  total 64",
    "  drwxr-xr-x  8 glatz  4096 Mar 5 09:00  .",
    "  drwxr-xr-x  3 root   4096 Jan 1 00:00  ..",
    "  -rw-------  1 glatz   420 Mar 5 08:55  .bash_history",
    "  -rw-r--r--  1 glatz   220 Jan 1 00:00  .bashrc",
    "  -rw-r--r--  1 glatz    80 Mar 5 00:00  .gitconfig",
    "  -r--------  1 glatz    64 Mar 5 00:00  .secret",
    "  drwxr-xr-x  2 glatz  4096 Mar 5 09:00  hero/",
    "  drwxr-xr-x  2 glatz  4096 Mar 5 09:00  sobre/",
    "  drwxr-xr-x  2 glatz  4096 Mar 5 09:00  projetos/",
    "  drwxr-xr-x  2 glatz  4096 Mar 5 09:00  skills/",
    "  drwxr-xr-x  2 glatz  4096 Mar 5 09:00  contato/",
    "  -rw-r--r--  1 glatz  1024 Mar 5 09:00  README.md",
  ],

  tree: [
    "  .",
    "  |-- hero/         index.tsx",
    "  |-- sobre/        index.tsx",
    "  |-- projetos/",
    "  |   |-- ecommerce.tsx",
    "  |   |-- dashboard.tsx",
    "  |   `-- landing.tsx",
    "  |-- skills/       index.tsx",
    "  |-- experiencia/  index.tsx",
    "  |-- contato/      index.tsx",
    "  |-- README.md",
    "  `-- .secret",
    "",
    "  7 directories, 9 files",
  ],

  "cat readme.md": [
    "  README.md",
    "  ─────────────────────────────────────────",
    "",
    "  # portfolio — Gabriel Glatz",
    "",
    "  Dev entusiasta por interfaces bonitas",
    "  e codigo que funciona de verdade.",
    "",
    "  Feito com:",
    "  Next.js  TypeScript  Tailwind  Framer Motion",
    "",
    "  Explore as secoes. Se curtiu,",
    "  manda um 'contact' aqui no terminal.",
  ],

  "cat .secret": [
    "  cat: .secret: Permission denied",
    "",
    "  ...ou sera que nao?",
    "  ─────────────────────────────────────────",
    "  TOKEN  = gl4tz_n4o_e_assim_q_se_h4cka",
    "  PASS   = **************************",
    "  SECRET = nada_aqui_pode_ir_embora",
    "  ─────────────────────────────────────────",
    "  brincadeira. pode ir embora.",
  ],

  "cat .gitconfig": [
    "  [user]",
    "    name   = Gabriel Glatz",
    "    email  = gabrielfellipeglatz@gmail.com",
    "",
    "  [core]",
    "    editor   = code --wait",
    "    autocrlf = input",
    "",
    "  [alias]",
    "    st   = status",
    "    lg   = log --oneline --graph",
    "    undo = reset HEAD~1",
  ],

  "cat .bashrc": [
    "  # .bashrc — glatz-machine",
    "",
    "  export EDITOR='code'",
    "  export NODE_ENV='development'",
    "  export COFFEE_LEVEL='high'",
    "",
    "  alias gs='git status'",
    "  alias gl='git log --oneline'",
    "  alias dev='npm run dev'",
    "  alias cls='clear'",
    "",
    "  echo 'ready to ship something cool.'",
  ],

  neofetch: () => [
    "",
    "  #######          visitor@glatz-machine",
    " #       #         ─────────────────────────────────",
    "# ##   ## #        OS       GlatzOS 1.0.0",
    "# ####### #        Host     Next.js 14 / Vercel",
    "# ##   ## #        Kernel   TypeScript 5.x",
    " #       #         Shell    zsh + glatz-terminal",
    "  #######          CPU      React 18 @ 60fps",
    "                   Memory   useState + zustand",
    "                   Style    Tailwind + Framer Motion",
    "                   Theme    Dark",
    "                   Term     glatz-terminal v1.0.0",
    "",
  ],

  uptime: () => [`  up ${_uptimeStr()}   load: 0.42  0.37  0.31`],

  uname: [
    "  Linux glatz-machine 6.1.0-portfolio #1 SMP PREEMPT",
    "  x86_64 GNU/Linux",
  ],

  "uname -a": [
    "  Linux glatz-machine 6.1.0-portfolio #1 SMP PREEMPT_DYNAMIC",
    "  Thu Mar 5 09:00:00 UTC 2026 x86_64 GNU/Linux",
  ],

  hostname: ["  glatz-machine.local"],

  version: [
    "  glatz-terminal   v1.0.0",
    "  built with       React + TypeScript",
    "  engine           Next.js 14",
  ],

  date: () => [
    `  ${new Date().toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "medium" })}`,
  ],

  pwd: ["  /home/visitor"],

  status: () => [
    "  SYSTEM STATUS",
    "  ─────────────────────────────────────────",
    `  Uptime     ${_uptimeStr()}`,
    "  CPU        0.42 load avg",
    "  Memory     2.8G / 8G  (35%)",
    "  Disk       18G / 50G  (38%)",
    "  Network    online",
    "  Build      passing",
    "  Deploy     vercel / production",
  ],

  top: [
    "  up 3h 24m   1 user   load: 0.42 0.37 0.31",
    "  Tasks: 5 total  1 running  4 sleeping",
    "  Cpu:  2.3% us   0.7% sy   96.8% id",
    "  Mem:  8192M total  2847M used  3421M free",
    "  ─────────────────────────────────────────",
    "  PID   USER    %CPU  %MEM  COMMAND",
    "    2   glatz    2.3   4.7  node (next dev)",
    "    3   glatz    0.1   0.8  tailwind --watch",
    "    1   glatz    0.0   0.1  bash",
    "    4   glatz    0.0   0.3  glatz-terminal",
  ],

  "ps aux": [
    "  USER     PID   %CPU  %MEM  COMMAND",
    "  ─────────────────────────────────────────",
    "  glatz      1    0.0   0.1  bash",
    "  glatz      2    2.3   4.7  node (next dev)",
    "  glatz      3    0.1   0.8  tailwind --watch",
    "  glatz      4    0.0   0.3  glatz-terminal",
  ],

  ps: [
    "  PID   TTY    TIME      CMD",
    "  ─────────────────────────────────────────",
    "  1     tty1   00:00:01  bash",
    "  2     tty1   00:00:03  node",
    "  3     tty1   00:00:00  next",
    "  4     tty1   00:00:00  glatz-terminal",
  ],

  free: [
    "           total      used      free",
    "  ─────────────────────────────────────────",
    "  Mem       8192 MB   2847 MB   3421 MB",
    "  Swap      2048 MB      0 MB   2048 MB",
  ],

  df: [
    "  Filesystem   Size   Used  Avail  Use%  Mount",
    "  ─────────────────────────────────────────────",
    "  /dev/sda1     50G    18G    30G   38%  /",
    "  /dev/sda2    100G    42G    58G   42%  /home",
    "  tmpfs          4G     1M     4G    1%  /dev/shm",
  ],

  env: [
    "  NODE_ENV        = production",
    "  NEXT_PUBLIC_URL = https://glatz.dev",
    "  GITHUB          = github.com/glatztp",
    "  LINKEDIN        = linkedin.com/in/gabriel-glatz",
    "  EDITOR          = code",
    "  COFFEE_LEVEL    = high",
    "  MUSIC           = lofi-hiphop",
    "  THEME           = dark",
    "  MOOD            = building_cool_stuff",
  ],

  who: ["  visitor   tty1   2026-03-05 09:00 (:0)"],

  "git log": [
    "  * a3f91c2  (HEAD -> main, origin/main)",
    "  |  feat: terminal interativo com easter eggs",
    "  |  Gabriel Glatz — Wed Mar 5 09:00 2026",
    "  |",
    "  * 7b2e4d1",
    "  |  feat: animacoes com Framer Motion",
    "  |  Gabriel Glatz — Tue Mar 4 22:14 2026",
    "  |",
    "  * 1c9a88f",
    "  |  chore: setup Next.js + Tailwind + TypeScript",
    "  |  Gabriel Glatz — Mon Mar 3 18:30 2026",
    "  |",
    "  * 0d1e2b3",
    "     init: first commit",
    "     Gabriel Glatz — Sun Mar 2 11:00 2026",
  ],

  "git log --oneline": [
    "  a3f91c2  feat: terminal interativo",
    "  7b2e4d1  feat: animacoes Framer Motion",
    "  1c9a88f  chore: setup Next.js + Tailwind",
    "  0d1e2b3  init: first commit",
  ],

  "git status": [
    "  On branch main",
    "  Your branch is up to date with 'origin/main'.",
    "",
    "  nothing to commit, working tree clean",
  ],

  "git branch": [
    "  * main",
    "    dev",
    "    feat/terminal",
    "    fix/mobile-layout",
  ],

  "git diff": [
    "  diff --git a/terminal/commands.ts b/terminal/commands.ts",
    "  --- a/terminal/commands.ts",
    "  +++ b/terminal/commands.ts",
    "  @@ -1,3 +1,12 @@",
    "  + open, copy, download, goto",
    "  + calc, uuid, timestamp, base64",
    "  + timer, note, todo, share",
  ],

  "git stash": [
    "  Saved working directory and index state",
    "  WIP on main: a3f91c2 feat: terminal interativo",
  ],

  "git stash list": [
    "  stash@{0}: WIP on main: terminal interativo",
    "  stash@{1}: WIP on dev: animacoes em progresso",
  ],

  "git shortlog": [
    "  Gabriel Glatz (12):",
    "    init: first commit",
    "    chore: setup Next.js + Tailwind",
    "    feat: hero / sobre / projetos / skills / contato",
    "    feat: animacoes com Framer Motion",
    "    fix: mobile layout",
    "    refactor: componentes reutilizaveis",
    "    feat: terminal interativo",
    "    feat: easter eggs",
    "    chore: deploy producao",
  ],

  "npm run dev": [
    "  > portfolio@1.0.0 dev",
    "  > next dev",
    "",
    "   - Next.js 14.2.0",
    "   - Local:   http://localhost:3000",
    "   - Network: http://192.168.1.100:3000",
    "",
    "  ready in 843ms",
    "  (voce ja esta aqui.)",
  ],

  "npm run build": [
    "  > portfolio@1.0.0 build",
    "  > next build",
    "",
    "  Linting and checking types   ..  done",
    "  Optimized production build   ..  done",
    "  Compiled successfully",
    "  Generating static pages (6/6) .  done",
    "",
    "  Route           Size        First Load JS",
    "  /               4.21 kB     92.4 kB",
    "  /404             182 B      83.4 kB",
  ],

  "npm install": [
    "  added 847 packages in 12s",
    "  183 packages are looking for funding",
    "  found 0 vulnerabilities",
  ],

  "npm run lint": [
    "  > next lint",
    "",
    "  0 errors   0 warnings",
    "  Codigo limpo.",
  ],

  "npm outdated": [
    "  Package          Current  Latest",
    "  ─────────────────────────────────────────",
    "  framer-motion     10.18   11.0.0",
    "  typescript         5.3    5.4.0",
    "  tailwindcss        3.4    3.4.1",
  ],

  node: [
    "  Welcome to Node.js v20.11.0.",
    "  > _",
    "",
    "  (simulacao — use um terminal real para codigo)",
  ],

  ping: [
    "  PING github.com (140.82.114.4)",
    "  ─────────────────────────────────────────",
    "  64 bytes  icmp_seq=0  time=18.3 ms",
    "  64 bytes  icmp_seq=1  time=17.9 ms",
    "  64 bytes  icmp_seq=2  time=18.1 ms",
    "",
    "  3 packets  0% loss  avg=18.1 ms",
  ],

  traceroute: [
    "  traceroute to glatz.dev (76.76.21.21)",
    "  ─────────────────────────────────────────",
    "   1  192.168.1.1       1.2 ms",
    "   2  10.0.0.1          4.5 ms",
    "   3  72.14.215.1       8.1 ms",
    "   4  142.250.68.14    12.4 ms",
    "   5  76.76.21.21      18.3 ms  glatz.dev",
    "",
    "  Destino alcancado em 5 saltos.",
  ],

  ifconfig: [
    "  eth0   inet  192.168.1.100   mask 255.255.255.0",
    "         inet6 fe80::1         prefixlen 64",
    "         ether 00:1a:2b:3c:4d:5e",
    "",
    "  lo     inet  127.0.0.1       mask 255.0.0.0",
  ],

  whois: [
    "  Domain:     glatz.dev",
    "  Registrar:  Namecheap",
    "  Created:    2024-01-01",
    "  Expires:    2027-01-01",
    "  Status:     clientTransferProhibited",
    "  Owner:      Gabriel Glatz",
  ],

  nmap: [
    "  Nmap scan report for glatz.dev (76.76.21.21)",
    "  ─────────────────────────────────────────",
    "  PORT    STATE  SERVICE",
    "  80/tcp  open   http",
    "  443/tcp open   https",
    "",
    "  2 open ports.",
  ],

  "curl https://api.github.com/users/glatztp": [
    "  {",
    '    "login":        "glatztp",',
    '    "name":         "Gabriel Glatz",',
    '    "bio":          "Software Developer",',
    '    "public_repos": 18,',
    '    "followers":    42,',
    '    "location":     "Brasil"',
    "  }",
  ],

  "ssh glatz@glatz.dev": [
    "  Connecting to glatz.dev...",
    "  Added 'glatz.dev' to known hosts.",
    "  ─────────────────────────────────────────",
    "  Welcome back, Gabriel.",
    "  Last login: Wed Mar 5 09:00:00 2026",
    "  ─────────────────────────────────────────",
    "  glatz@glatz.dev:~$ _",
  ],

  vim: [
    "  VIM  Vi IMproved 9.0",
    "  ─────────────────────────────────────────",
    "  Para sair:  ESC  depois  :q!",
    "",
    "  Dica: use 'nano' se quiser algo simples.",
  ],

  nano: [
    "  GNU nano 7.2        README.md",
    "  ─────────────────────────────────────────",
    "  # portfolio — Gabriel Glatz",
    "  Software Developer",
    "  ─────────────────────────────────────────",
    "  ^X Sair   ^O Salvar   ^W Buscar",
  ],

  "find . -name '*.tsx'": [
    "  ./hero/index.tsx",
    "  ./sobre/index.tsx",
    "  ./projetos/ecommerce.tsx",
    "  ./projetos/dashboard.tsx",
    "  ./projetos/landing.tsx",
    "  ./skills/index.tsx",
    "  ./contato/index.tsx",
    "",
    "  7 arquivos encontrados",
  ],

  "grep -r 'Gabriel' .": [
    "  README.md:5:         Gabriel Glatz",
    "  sobre/index.tsx:3:   name: 'Gabriel Glatz'",
    "  contato/index.tsx:7: email: 'gabrielfellipeglatz@gmail.com'",
    "  hero/index.tsx:12:   <h1>Gabriel Glatz</h1>",
  ],

  which: ["  uso: which <binario>"],
  "which node":   ["  /usr/local/bin/node"],
  "which npm":    ["  /usr/local/bin/npm"],
  "which git":    ["  /usr/bin/git"],
  "which code":   ["  /usr/local/bin/code"],
  "which python": ["  /usr/bin/python3"],
  "which docker": ["  /usr/bin/docker"],
  "which bash":   ["  /bin/bash"],

  sudo: ["  sudo: permission denied", "  Tenta nao."],
  "sudo rm -rf /": ["  sudo: permission denied", "  O portfolio esta a salvo."],

  man: ["  man: indisponivel.  use 'help' para ver os comandos."],

  login: ["  uso: login <user> <senha>"],
  "login visitor 1234": () => [
    "  Autenticando...",
    `  Bem-vindo, visitor.  ${new Date().toLocaleTimeString("pt-BR")}`,
  ],
  logout: ["  Encerrando sessao.  Ate logo, visitor."],

  scan: [
    "  Varrendo rede...",
    "  ─────────────────────────────────────────",
    "  192.168.1.1    Router        porta 80",
    "  192.168.1.42   Desconhecido  porta 4242",
    "  192.168.1.100  localhost     voce esta aqui",
    "  ─────────────────────────────────────────",
    "  use 'connect 192.168.1.42' para continuar",
  ],

  "connect 192.168.1.42": [
    "  Conectando a 192.168.1.42:4242...",
    "  TLS handshake... ok",
    "  ─────────────────────────────────────────",
    "  SISTEMA DESCONHECIDO",
    "  Acesso restrito. Identifique-se.",
    "  ─────────────────────────────────────────",
    "  use 'dump' para tentar extrair dados",
  ],

  dump: [
    "  Extraindo dados...",
    "  [##################################]  100%",
    "  ─────────────────────────────────────────",
    "  name    = Gabriel Glatz",
    "  role    = Software Developer",
    "  stack   = React  TypeScript  Next.js",
    "  mood    = coding_mode_engaged",
    "  secret  = clean code e amor proprio",
    "  ─────────────────────────────────────────",
    "  Conexao encerrada pelo servidor remoto.",
  ],

  joke: [
    "  um homem entra numa biblioteca e pede:",
    "",
    '  "um hamburguer e uma coca, por favor."',
    "",
    "  a bibliotecaria responde:",
    "",
    '  "senhor, isso e uma biblioteca!"',
    "",
    "  o homem abaixa a voz e sussurra:",
    "",
    '  "um hamburguer e uma coca, por favor."',
  ],

  coffee: [
    "  COFFEE STATUS",
    "  ─────────────────────────────────────────",
    "  [####################....]  92%",
    "",
    "  ultima recarga    ha pouco",
    "  proxima recarga   em breve",
    "  modo              MAXIMUM OVERDRIVE",
    "  ─────────────────────────────────────────",
    "  sem cafe nao ha commits.",
  ],

  flip: [],

  fortune: () => {
    const q = [
      ['"A persistencia e o caminho do exito."', "— Charles Chaplin"],
      ['"Menos e mais."', "— Ludwig Mies van der Rohe"],
      ['"Codigo limpo e aquele escrito por', ' alguem que se importa."', "— Robert C. Martin"],
      ['"Primeiro faca funcionar,', ' depois faca funcionar rapido."', "— Kent Beck"],
      ['"Simplicidade e a sofisticacao final."', "— Leonardo da Vinci"],
    ];
    const pick = q[Math.floor(Math.random() * q.length)];
    return [
      "  ─────────────────────────────────────────",
      ...pick.map((l) => `  ${l}`),
      "  ─────────────────────────────────────────",
    ];
  },

  quote: () => {
    const q = [
      ['"Talk is cheap. Show me the code."', "— Linus Torvalds"],
      ['"Any fool can write code a computer can understand."', "— Martin Fowler"],
      ['"Debugging is twice as hard as writing', ' the code in the first place."', "— Brian Kernighan"],
      ['"Make it work, make it right, make it fast."', "— Kent Beck"],
      ['"First, solve the problem. Then, write the code."', "— John Johnson"],
    ];
    const pick = q[Math.floor(Math.random() * q.length)];
    return [
      "  ─────────────────────────────────────────",
      ...pick.map((l) => `  ${l}`),
      "  ─────────────────────────────────────────",
    ];
  },

  weather: [
    "  WEATHER — Glatz City",
    "  ─────────────────────────────────────────",
    "  Condicao    Ensolarado, alta criatividade",
    "  Temp        24 C",
    "  Vento       Levemente cafeinado",
    "  Previsao    Commits ao longo do dia",
  ],

  matrix: [],

  motd: [
    "  ─────────────────────────────────────────",
    "  MESSAGE OF THE DAY",
    "  ─────────────────────────────────────────",
    "  'Ship it. Iterate. Ship again.'",
    "",
    "  Hoje e um bom dia para criar algo novo.",
    "  ─────────────────────────────────────────",
  ],

  changelog: [
    "  CHANGELOG  glatz-terminal",
    "  ─────────────────────────────────────────",
    "  v1.0.0  Mar 2026",
    "  + 60+ comandos interativos",
    "  + historico com setas  (Up/Down)",
    "  + tab completion",
    "  + fullscreen e resize",
    "  + matrix mode",
    "  + open / copy / download reais",
    "  + calc / uuid / base64 / timer",
    "  + note / todo / goto / share",
    "",
    "  v0.3.0  Fev 2026",
    "  + animacoes Framer Motion",
    "  + dark mode global",
    "",
    "  v0.1.0  Jan 2026",
    "  + setup Next.js + Tailwind",
    "  ─────────────────────────────────────────",
  ],

  credits: [
    "  CREDITOS",
    "  ─────────────────────────────────────────",
    "  Design & Dev    Gabriel Glatz",
    "  Framework       Next.js 14",
    "  Estilo          Tailwind CSS",
    "  Animacoes       Framer Motion",
    "  Icones          Lucide React",
    "  Deploy          Vercel",
    "  ─────────────────────────────────────────",
    "  Feito com codigo limpo e cafe.",
  ],

  ascii: [
    "  (\\_/)",
    "  ( o.o)",
    "  / > []  codigo pronto.",
  ],

  bio: [
    "  Gabriel Glatz — Software Developer",
    "  Stack: React  TypeScript  Next.js",
  ],

  resume: [
    "  Curriculo disponivel sob solicitacao.",
    "  Email: gabrielfellipeglatz@gmail.com",
  ],

  history: [],
  clear: [], cls: [], exit: [], new: [],
  touch: ["  uso: touch <arquivo>"],
  mkdir: ["  uso: mkdir <pasta>"],
  rm:    ["  uso: rm <arquivo>"],
  rmdir: ["  uso: rmdir <pasta>"],
  echo:  ["  uso: echo <mensagem>"],

  help: [
    "  ─────────────────────────────────────────────────────────────────",
    "  GLATZ TERMINAL  v1.0.0",
    "  ─────────────────────────────────────────────────────────────────",
    hrow("  PORTFOLIO", "SISTEMA"),
    hrow("  ────────────────────────────────", "────────────────────────────────"),
    hrow("  whoami       sobre o dev", "neofetch     info do sistema"),
    hrow("  about        resumo pessoal", "uptime       tempo ativo"),
    hrow("  skills       stack tecnica", "status       painel sistema"),
    hrow("  lang         linguagens", "top          processos"),
    hrow("  experience   experiencia", "free         memoria RAM"),
    hrow("  projects     projetos", "df           disco"),
    hrow("  contact      contato", "env          variaveis"),
    hrow("  links        todos os links", "date         data e hora"),
    hrow("  github       github", "who          usuarios"),
    hrow("  cv           curriculo", "uname -a     kernel"),
    "  ─────────────────────────────────────────────────────────────────",
    hrow("  ACOES REAIS", "UTILITARIOS"),
    hrow("  ────────────────────────────────", "────────────────────────────────"),
    hrow("  open <destino>   abre link", "calc <expr>  calculadora"),
    hrow("  copy <campo>     clipboard", "uuid         gera UUID v4"),
    hrow("  download vcard   baixa .vcf", "timestamp    unix timestamp"),
    hrow("  download log     baixa log", "base64       encode/decode"),
    hrow("  goto <secao>     scroll", "timer <min>  pomodoro/timer"),
    hrow("  share            Web Share", "note         notas da sessao"),
    hrow("  tweet            abre twitter", "todo         lista de tarefas"),
    "  ─────────────────────────────────────────────────────────────────",
    hrow("  GIT", "REDE"),
    hrow("  ────────────────────────────────", "────────────────────────────────"),
    hrow("  git log      commits", "ping         pingar host"),
    hrow("  git log --oneline", "traceroute   rota de rede"),
    hrow("  git status   status repo", "ifconfig     interfaces"),
    hrow("  git branch   branches", "whois        info dominio"),
    hrow("  git diff     alteracoes", "nmap         portas abertas"),
    hrow("  git stash    stash", "curl         requisicao HTTP"),
    hrow("  git shortlog autores", "ssh          conectar server"),
    "  ─────────────────────────────────────────────────────────────────",
    hrow("  NPM / NODE", "ARQUIVOS"),
    hrow("  ────────────────────────────────", "────────────────────────────────"),
    hrow("  npm run dev  servidor local", "ls / ls -la  listar"),
    hrow("  npm run build  producao", "tree         arvore dirs"),
    hrow("  npm run lint   linting", "cat          ler arquivo"),
    hrow("  npm install  dependencias", "find         buscar arquivos"),
    hrow("  npm outdated versoes", "grep         buscar texto"),
    hrow("  node         REPL", "vim / nano   editores"),
    "  ─────────────────────────────────────────────────────────────────",
    hrow("  HACKER", "DIVERSAO"),
    hrow("  ────────────────────────────────", "────────────────────────────────"),
    hrow("  scan         varrer rede", "joke         piada dev"),
    hrow("  connect      conectar alvo", "coffee       nivel cafeina"),
    hrow("  dump         extrair dados", "flip         cara ou coroa"),
    hrow("  nmap         portas", "matrix       entrar na matrix"),
    hrow("  whois        dominio", "fortune      frase aleatoria"),
    hrow("  traceroute   rota rede", "quote        quote dev"),
    hrow("  ssh          conectar server", "weather      previsao tempo"),
    hrow("  sudo         tentar sorte", "motd         mensagem do dia"),
    "  ─────────────────────────────────────────────────────────────────",
    hrow("  TERMINAL", "INFO"),
    hrow("  ────────────────────────────────", "────────────────────────────────"),
    hrow("  clear / cls  limpar tela", "changelog    historico versoes"),
    hrow("  history      historico", "credits      quem fez"),
    hrow("  exit / Esc   fechar janela", "version      versao terminal"),
    hrow("  new          novo terminal", "ascii        arte ASCII"),
    "  ─────────────────────────────────────────────────────────────────",
    "  Tab = auto-completar   Up/Down = historico",
    "  ─────────────────────────────────────────────────────────────────",
  ],
};

export const BANNER: string[] = [
  "   ██████╗ ██╗      █████╗ ████████╗███████╗",
  "  ██╔════╝ ██║     ██╔══██╗╚══██╔══╝╚══███╔╝",
  "  ██║  ███╗██║     ███████║   ██║     ███╔╝ ",
  "  ██║   ██║██║     ██╔══██║   ██║    ███╔╝  ",
  "  ╚██████╔╝███████╗██║  ██║   ██║   ███████╗",
  "   ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝",
  "",
  "  Portfolio Terminal  v1.0.0   type 'help' to start",
  "  ",
];