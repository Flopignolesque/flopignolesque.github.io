/**
 * Fond WebGL du hero : une grille de points qui ondule doucement
 * et s'éclaire autour de la souris.
 *
 * Règles de perf :
 *  - pause quand le hero sort de l'écran (IntersectionObserver) ou que l'onglet est caché
 *  - résolution limitée : DPR 1.5 max sur desktop, réduite sur mobile (+ 30 images/s)
 *  - si WebGL est indisponible, rendu par le processeur (pas de GPU) ou appareil faible :
 *    on garde le fond CSS
 */
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const vertex = /* glsl */ `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uMouseActive;
  uniform float uCell;
  uniform vec3 uAccent;
  uniform float uIntensity;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    vec2 px = gl_FragCoord.xy;
    vec2 grid = px / uCell;
    vec2 id = floor(grid);
    vec2 local = fract(grid) - 0.5;

    // position normalisée du point (indépendante de la taille d'écran)
    vec2 p = (id + 0.5) * uCell / uResolution.y;

    // ondulation lente
    float t = uTime * 0.06;
    float wave = noise(p * 2.2 + vec2(t, t * 0.7)) * 0.65 + noise(p * 5.0 - t * 1.3) * 0.35;

    // halo autour de la souris
    float d = length((id + 0.5) * uCell - uMouse) / uResolution.y;
    float glow = smoothstep(0.32, 0.0, d) * uMouseActive;

    // taille du point
    float radius = mix(0.07, 0.2, wave) + glow * 0.12;
    float dotMask = smoothstep(radius, radius - 0.07, length(local));

    // plus discret à gauche et en bas (là où se trouve le texte)
    vec2 uv = px / uResolution;
    float fade = smoothstep(0.05, 0.85, uv.x * 0.7 + uv.y * 0.5);

    float alpha = dotMask * ((0.06 + wave * 0.32) * fade + glow * 0.75);
    vec3 color = mix(vec3(0.93), uAccent, clamp(glow * 1.4 + wave * 0.15, 0.0, 1.0));

    alpha *= uIntensity;
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

function isWeakDevice(): boolean {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return coarse && (cores <= 4 || memory <= 2);
}

function accentColor(): [number, number, number] {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
  const hex = value.startsWith('#') && value.length === 7 ? value : '#5cffb0';
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
}

/** WebGL rendu par le processeur (SwiftShader, llvmpipe...) : trop lent, on n'insiste pas */
function isSoftwareRenderer(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = `${gl.getParameter(gl.RENDERER)} ${info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : ''}`;
  return /swiftshader|llvmpipe|software|basic render/i.test(renderer);
}

export function initShader(canvas: HTMLCanvasElement) {
  if (isWeakDevice()) return;

  const mobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
  // Sur mobile : moitié de la résolution, le flou des points ne se voit pas
  const dpr = mobile ? 0.5 : Math.min(window.devicePixelRatio || 1, 1.5);

  let renderer: Renderer;
  try {
    renderer = new Renderer({ canvas, dpr, alpha: true, premultipliedAlpha: true, antialias: false });
  } catch {
    return; // WebGL indisponible : le fond CSS reste en place
  }
  const gl = renderer.gl;
  if (!gl || isSoftwareRenderer(gl)) {
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return;
  }
  gl.clearColor(0, 0, 0, 0);

  const geometry = new Triangle(gl);
  const program = new Program(gl, {
    vertex,
    fragment,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: [1, 1] },
      uMouse: { value: [-9999, -9999] },
      uMouseActive: { value: 0 },
      uCell: { value: 22 * dpr },
      uAccent: { value: accentColor() },
      // Plus discret sur mobile, où le texte recouvre toute la largeur
      uIntensity: { value: mobile ? 0.55 : 1 },
    },
  });
  const mesh = new Mesh(gl, { geometry, program });

  const parent = canvas.parentElement as HTMLElement;
  const resize = () => {
    const { width, height } = parent.getBoundingClientRect();
    renderer.setSize(width, height);
    program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
  };
  resize();
  new ResizeObserver(resize).observe(parent);

  /* Souris (lissée) */
  const target = { x: -9999, y: -9999, active: 0 };
  const current = { x: -9999, y: -9999, active: 0 };
  if (!mobile) {
    window.addEventListener(
      'pointermove',
      (e) => {
        const rect = canvas.getBoundingClientRect();
        target.x = (e.clientX - rect.left) * dpr;
        target.y = (rect.height - (e.clientY - rect.top)) * dpr; // WebGL : y vers le haut
        target.active = 1;
        if (current.x < -1000) {
          current.x = target.x;
          current.y = target.y;
        }
      },
      { passive: true },
    );
    document.documentElement.addEventListener('pointerleave', () => (target.active = 0));
  }

  /* Boucle de rendu, en pause quand invisible */
  let visible = true;
  let rafId = 0;
  let last = performance.now();
  let time = Math.random() * 100;

  let skip = false;
  const frame = (now: number) => {
    rafId = requestAnimationFrame(frame);
    // 30 images/s sur mobile
    if (mobile && (skip = !skip)) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;

    current.x += (target.x - current.x) * 0.08;
    current.y += (target.y - current.y) * 0.08;
    current.active += (target.active - current.active) * 0.05;

    program.uniforms.uTime.value = time;
    program.uniforms.uMouse.value = [current.x, current.y];
    program.uniforms.uMouseActive.value = current.active;
    renderer.render({ scene: mesh });
  };

  const play = () => {
    if (rafId || !visible || document.hidden) return;
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  };
  const pause = () => {
    cancelAnimationFrame(rafId);
    rafId = 0;
  };

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) play();
    else pause();
  }).observe(parent);

  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));

  play();
  canvas.classList.add('is-ready');
}
