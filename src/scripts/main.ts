/**
 * Script principal, chargé sur toutes les pages. Il reste volontairement léger :
 * le reste (animations, shader, terminal, curseur) est téléchargé seulement si besoin.
 */
import { initMenu } from './menu';
import { initMail } from './mail';

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

initMenu();
initMail();

/* ---------- Animations (GSAP + Lenis) : seulement si autorisées ---------- */
if (root.classList.contains('motion')) {
  import('./motion')
    .then((m) => m.initMotion())
    .catch(() => root.classList.remove('motion'));
}

/* ---------- Curseur custom : desktop + souris uniquement ---------- */
if (finePointer && !reduceMotion) {
  import('./cursor').then((m) => m.initCursor());
}

/* ---------- Shader du hero ----------
 * Desktop : dès que le navigateur est disponible après le chargement.
 * Mobile : au premier contact (toucher, défilement), pour ne pas ralentir
 * l'arrivée sur la page. En attendant, le fond CSS est affiché. */
const heroCanvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
if (heroCanvas && !reduceMotion) {
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    import('./shader').then((m) => m.initShader(heroCanvas));
  };
  if (finePointer) {
    const idle = () =>
      'requestIdleCallback' in window ? window.requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 800);
    if (document.readyState === 'complete') idle();
    else window.addEventListener('load', idle, { once: true });
  } else {
    for (const type of ['pointerdown', 'touchstart', 'scroll', 'keydown']) {
      window.addEventListener(type, start, { once: true, passive: true });
    }
  }
}

/* ---------- Terminal : chargé à la première ouverture ---------- */
let terminalModule: Promise<typeof import('./terminal')> | null = null;
function openTerminal() {
  terminalModule ??= import('./terminal');
  terminalModule.then((m) => m.openTerminal());
}

document.querySelectorAll('[data-terminal-open]').forEach((el) => el.addEventListener('click', openTerminal));

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.key !== '²' && event.key !== '/') return;
  const target = event.target as HTMLElement | null;
  const typing =
    target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
  if (typing) return;
  const dialog = document.getElementById('terminal') as HTMLDialogElement | null;
  if (dialog?.open) return;
  event.preventDefault();
  openTerminal();
});
