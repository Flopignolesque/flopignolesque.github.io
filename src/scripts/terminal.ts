/**
 * Terminal interactif (easter egg). Chargé à la première ouverture.
 * Les données (textes, projets, compétences) viennent de /fr/terminal.json ou /en/terminal.json,
 * générés au build à partir du contenu du site.
 *
 * Sécurité : tout ce qui est affiché passe par textContent, jamais par innerHTML.
 */
import { decodeMail, copyText } from './mail';

interface TerminalData {
  lang: 'fr' | 'en';
  ui: {
    welcome: string;
    notFound: string;
    help: [string, string][];
    whoami: string[];
    cv: string;
    copied: string;
    hire: string[];
    hireLink: string;
    nmapStart: string;
    nmapHost: string;
    nmapDone: string;
    goingTo: string;
    unknownProject: string;
  };
  levels: Record<string, string>;
  projects: { slug: string; title: string; tagline: string; url: string }[];
  skills: { name: string; items: { name: string; level: string }[] }[];
  urls: { home: string; projects: string; contact: string; cv: string; other: string };
  mail: string;
}

const COMMANDS = ['help', 'whoami', 'ls projects', 'cd projects', 'cat cv', 'contact', 'skills', 'lang en', 'lang fr', 'sudo hire-me', 'nmap florian', 'clear', 'exit'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let data: TerminalData | null = null;
let initialized = false;
const history: string[] = [];
let historyIndex = 0;

const dialog = document.getElementById('terminal') as HTMLDialogElement;
const output = dialog.querySelector<HTMLElement>('[data-terminal-output]')!;
const form = dialog.querySelector<HTMLFormElement>('[data-terminal-form]')!;
const input = dialog.querySelector<HTMLInputElement>('[data-terminal-input]')!;
let opener: HTMLElement | null = null;

/* ---------------- Affichage ---------------- */

type Part = string | { text: string; className?: string; href?: string; download?: boolean };

function line(...parts: Part[]) {
  const row = document.createElement('div');
  for (const part of parts) {
    if (typeof part === 'string') {
      row.append(part);
      continue;
    }
    const el = part.href ? document.createElement('a') : document.createElement('span');
    el.textContent = part.text;
    if (part.className) el.className = part.className;
    if (part.href && el instanceof HTMLAnchorElement) {
      el.href = part.href;
      if (part.download) el.download = '';
    }
    row.append(el);
  }
  output.append(row);
  output.scrollTop = output.scrollHeight;
  return row;
}

const muted = (text: string): Part => ({ text, className: 'term-muted' });
const accent = (text: string): Part => ({ text, className: 'term-accent' });

function echo(command: string) {
  line(accent('florian@portfolio:~$ '), command);
}

function navigate(url: string) {
  line(muted(`${data!.ui.goingTo} ${url} ...`));
  setTimeout(() => (window.location.href = url), reduceMotion ? 0 : 350);
}

/* ---------------- Commandes ---------------- */

function cmdHelp() {
  const width = Math.max(...data!.ui.help.map(([cmd]) => cmd.length)) + 3;
  data!.ui.help.forEach(([cmd, desc]) => line(accent(cmd.padEnd(width)), muted(desc)));
}

function cmdLsProjects() {
  const width = Math.max(...data!.projects.map((p) => p.slug.length)) + 3;
  data!.projects.forEach((p) => line(accent(p.slug.padEnd(width)), muted(p.title)));
}

function cmdCd(arg: string) {
  if (!arg || arg === '~' || arg === '/' || arg === '..') return navigate(data!.urls.home);
  if (arg === 'projects' || arg === 'projets') return navigate(data!.urls.projects);
  const project = data!.projects.find((p) => p.slug === arg.replace(/\/$/, ''));
  if (project) return navigate(project.url);
  line({ text: `cd: ${arg}: ${data!.ui.unknownProject}`, className: 'term-error' });
  cmdLsProjects();
}

function cmdCatCv() {
  line(muted(data!.ui.cv));
  const a = document.createElement('a');
  a.href = data!.urls.cv;
  a.download = '';
  document.body.append(a);
  a.click();
  a.remove();
}

async function cmdContact() {
  const mail = decodeMail(data!.mail);
  line({ text: mail, href: `mailto:${mail}` });
  if (await copyText(mail)) line(muted(data!.ui.copied));
}

function cmdSkills() {
  line(accent('skills/'));
  data!.skills.forEach((group, gi) => {
    const lastGroup = gi === data!.skills.length - 1;
    line(muted(lastGroup ? '└── ' : '├── '), group.name);
    group.items.forEach((item, ii) => {
      const lastItem = ii === group.items.length - 1;
      const prefix = (lastGroup ? '    ' : '│   ') + (lastItem ? '└── ' : '├── ');
      line(muted(prefix), item.name, muted(`  [${data!.levels[item.level] ?? item.level}]`));
    });
  });
}

function cmdLang(arg: string) {
  if (arg !== 'fr' && arg !== 'en') {
    line({ text: 'usage: lang fr | lang en', className: 'term-error' });
    return;
  }
  if (arg === data!.lang) return;
  navigate(data!.urls.other);
}

function cmdHire() {
  data!.ui.hire.forEach((text) => line(text));
  line(accent('→ '), { text: data!.ui.hireLink, href: data!.urls.contact });
}

async function cmdNmap() {
  const ports: [string, string][] = [
    ['22/tcp', 'reseau'],
    ['80/tcp', 'web'],
    ['443/tcp', 'web'],
    ['1337/tcp', 'cyber'],
    ['2027/tcp', 'alternance'],
    ['3000/tcp', 'nocturne'],
  ];
  const wait = (ms: number) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
  input.disabled = true;
  line(data!.ui.nmapStart);
  await wait(450);
  line(data!.ui.nmapHost);
  line(muted('Host is up (0.0013s latency).'));
  await wait(300);
  line(muted('PORT      STATE  SERVICE'));
  for (const [port, service] of ports) {
    await wait(180);
    line(port.padEnd(10), accent('open   '), service);
  }
  await wait(250);
  line(muted(data!.ui.nmapDone));
  input.disabled = false;
  input.focus();
}

async function run(raw: string) {
  const command = raw.trim().replace(/\s+/g, ' ');
  echo(raw);
  if (!command) return;
  history.push(command);
  historyIndex = history.length;

  const [name, ...rest] = command.split(' ');
  const arg = rest.join(' ');
  const lower = command.toLowerCase();

  switch (true) {
    case lower === 'help':
      return cmdHelp();
    case lower === 'whoami':
      return data!.ui.whoami.forEach((text) => line(text));
    case lower === 'ls projects' || lower === 'ls projets' || lower === 'ls':
      return cmdLsProjects();
    case name.toLowerCase() === 'cd':
      return cmdCd(arg.toLowerCase());
    case lower === 'cat cv':
      return cmdCatCv();
    case lower === 'contact':
      return cmdContact();
    case lower === 'skills':
      return cmdSkills();
    case name.toLowerCase() === 'lang':
      return cmdLang(arg.toLowerCase());
    case lower === 'sudo hire-me' || lower === 'sudo hire me':
      return cmdHire();
    case lower.startsWith('nmap'):
      return cmdNmap();
    case lower === 'clear':
      output.replaceChildren();
      return;
    case lower === 'exit':
      dialog.close();
      return;
    default:
      line({ text: `${name}: ${data!.ui.notFound}`, className: 'term-error' });
  }
}

/* ---------------- Clavier : historique et autocomplétion ---------------- */

function complete() {
  const value = input.value.trimStart().toLowerCase();
  if (!value) return;
  const candidates = value.startsWith('cd ')
    ? ['cd projects', ...data!.projects.map((p) => `cd ${p.slug}`)]
    : COMMANDS;
  const matches = candidates.filter((c) => c.startsWith(value));
  if (matches.length === 1) {
    input.value = matches[0];
  } else if (matches.length > 1) {
    echo(input.value);
    line(muted(matches.join('    ')));
    // préfixe commun
    let prefix = matches[0];
    for (const m of matches) while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
    input.value = prefix;
  }
}

function setup() {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value;
    input.value = '';
    run(value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) input.value = history[--historyIndex] ?? '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] ?? '';
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      output.replaceChildren();
    }
  });

  dialog.querySelector('[data-terminal-close]')?.addEventListener('click', () => dialog.close());

  // Clic en dehors de la fenêtre (sur le fond) : fermeture
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) dialog.close();
    }
  });

  // Clic dans la sortie : on garde le focus sur la saisie
  output.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('a') && !window.getSelection()?.toString()) input.focus();
  });

  dialog.addEventListener('close', () => {
    window.dispatchEvent(new CustomEvent('scroll:unlock'));
    opener?.focus();
  });
}

export async function openTerminal() {
  if (dialog.open) return;
  opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  if (!initialized) {
    initialized = true;
    setup();
  }

  if (!data) {
    try {
      const response = await fetch(dialog.dataset.src!);
      data = (await response.json()) as TerminalData;
    } catch {
      return;
    }
    line(accent('FTW terminal'), muted(' v1.0'));
    line(muted(data.ui.welcome));
  }

  window.dispatchEvent(new CustomEvent('scroll:lock'));
  dialog.showModal();
  input.focus();
}
