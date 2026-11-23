/**
 * Curseur custom : un point qui suit la souris + un anneau qui suit avec inertie.
 * L'anneau grossit au survol des éléments cliquables. Desktop uniquement.
 */
const HOVER_SELECTOR = 'a, button, [role="button"], input, label, summary, [data-cursor]';

export function initCursor() {
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(dot, ring);

  const root = document.documentElement;
  const mouse = { x: -100, y: -100 };
  const ringPos = { x: -100, y: -100 };
  let rafId = 0;
  let running = false;

  const loop = () => {
    ringPos.x += (mouse.x - ringPos.x) * 0.18;
    ringPos.y += (mouse.y - ringPos.y) * 0.18;
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    // On arrête la boucle quand l'anneau a rattrapé la souris (économie de batterie)
    if (Math.abs(mouse.x - ringPos.x) < 0.1 && Math.abs(mouse.y - ringPos.y) < 0.1) {
      running = false;
      return;
    }
    rafId = requestAnimationFrame(loop);
  };

  const wake = () => {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(loop);
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      root.classList.add('has-cursor');
      wake();
    },
    { passive: true },
  );

  document.addEventListener('pointerover', (e) => {
    const target = e.target as Element | null;
    ring.classList.toggle('is-hover', !!target?.closest(HOVER_SELECTOR));
  });

  document.documentElement.addEventListener('pointerleave', () => {
    root.classList.remove('has-cursor');
    cancelAnimationFrame(rafId);
    running = false;
  });

  // Le curseur custom ne doit pas gêner la saisie au clavier dans le terminal
  window.addEventListener('keydown', () => root.classList.remove('has-cursor'));
}
