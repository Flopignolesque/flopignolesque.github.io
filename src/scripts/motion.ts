/**
 * Toutes les animations (chargé uniquement si prefers-reduced-motion n'est pas activé).
 *
 * Attributs utilisables dans le HTML :
 *   data-reveal              fondu + léger décalage vers le haut à l'apparition
 *   data-reveal="lines"      le texte apparaît ligne par ligne (SplitText)
 *
 * Règle : ne jamais mettre data-reveal sur ce qui est visible dès l'arrivée sur la page
 * (titre, intro) : ça retarderait l'affichage (LCP).
 *   data-reveal-group        les enfants directs apparaissent l'un après l'autre
 *   data-scramble            le texte se "déchiffre" au chargement
 *   data-scramble-view       le texte se "déchiffre" quand il arrive à l'écran
 *   data-count="896"         compteur animé de 0 à la valeur
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const SCRAMBLE_CHARS = '01<>/\\_#$%&*+=?';

function scramble(el: HTMLElement, delay = 0) {
  const text = el.textContent ?? '';
  if (!el.getAttribute('aria-label') && el.tagName !== 'SPAN') el.setAttribute('aria-label', text.trim());
  // Les caractères aléatoires sont plus larges que le texte final : sur un titre
  // de plusieurs lignes, ça changerait le nombre de lignes et la page "sauterait" (CLS).
  // Donc : effet uniquement sur les textes d'une seule ligne, figés pendant l'animation.
  const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || el.offsetHeight;
  if (el.offsetHeight > lineHeight * 1.5) return;
  el.style.height = `${el.offsetHeight}px`;
  el.style.whiteSpace = 'nowrap';
  gsap.to(el, {
    delay,
    duration: Math.min(0.9, 0.35 + text.length * 0.025),
    ease: 'none',
    scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.8, revealDelay: 0.15 },
    onComplete: () => {
      el.style.height = '';
      el.style.whiteSpace = '';
    },
  });
}

export function initMotion() {
  const root = document.documentElement;

  /* ---------- Scroll fluide ---------- */
  const lenis = new Lenis({ anchors: true, autoRaf: false, lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.addEventListener('scroll:lock', () => lenis.stop());
  window.addEventListener('scroll:unlock', () => lenis.start());

  /* ---------- Texte qui se déchiffre ---------- */
  document.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el, i) => scramble(el, 0.1 + i * 0.12));

  document.querySelectorAll<HTMLElement>('[data-scramble-view]').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => scramble(el) });
  });

  /* ---------- Révélations simples ---------- */
  document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal="lines"])').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      },
    );
  });

  /* ---------- Révélations ligne par ligne ---------- */
  document.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      // le texte reste lisible tel quel par les lecteurs d'écran (pas d'aria-label sur un <p>)
      aria: 'none',
      onSplit(self) {
        gsap.set(el, { opacity: 1 });
        return gsap.from(self.lines, {
          yPercent: 105,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });

  /* ---------- Groupes (cartes, listes) ---------- */
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = Array.from(group.children) as HTMLElement[];
    gsap.set(items, { opacity: 0, y: 28 });
    gsap.set(group, { opacity: 1 });
    ScrollTrigger.batch(items, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08, overwrite: true }),
    });
  });

  /* ---------- Compteurs ---------- */
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;
    const counter = { value: 0 };
    el.textContent = '0';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(counter, {
          value: target,
          duration: target > 100 ? 1.6 : 1.1,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = String(Math.round(counter.value))),
        }),
    });
  });

  /* ---------- Ligne de la timeline (parcours) ---------- */
  document.querySelectorAll<HTMLElement>('.timeline-progress').forEach((line) => {
    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: line.parentElement,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 0.6,
        },
      },
    );
  });

  root.classList.add('motion-ready');
  // Les polices peuvent changer la hauteur des blocs : on recalcule les positions.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
