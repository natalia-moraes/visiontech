/**
 * ───────────────────────────────────────────────────────────────────────────
 *  COLEÇÃO PREMIUM DE ÓCULOS EM SVG (overlay do provador virtual)
 * ───────────────────────────────────────────────────────────────────────────
 *  Arte vetorial frontal, transparente e leve, desenhada sobre o rosto no
 *  Canvas do try-on. Cada modelo tem armação metálica (gradiente vertical de
 *  brilho), lentes translúcidas com reflexos discretos e espessura de aro
 *  própria.
 *
 *  ⚠️ PONTOS DE ANCORAGEM (não alterar — o renderer depende deles):
 *     • viewBox ........ 480 x 200
 *     • centro lente E .. x = 140   centro lente D .. x = 340   (y = 100)
 *     • vão entre lentes  200  → mapeado para a distância entre os olhos.
 *
 *  Os PNGs reais continuam sendo usados APENAS nos cards do catálogo.
 * ───────────────────────────────────────────────────────────────────────────
 */

export const OVERLAY_VIEWBOX = { width: 480, height: 200 }

const LEFT_CX = 140
const RIGHT_CX = 340
const CY = 100

/* ── utilitários de cor (para derivar o brilho metálico do tom base) ─────── */
const clampByte = (n) => Math.max(0, Math.min(255, Math.round(n)))
const norm = (hex) => (hex.startsWith('#') ? hex : `#${hex}`)
function hexToRgb(hex) {
  const h = norm(hex).slice(1)
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}
const toHex = (rgb) =>
  '#' + rgb.map((v) => clampByte(v).toString(16).padStart(2, '0')).join('')
function mix(hex, target, t) {
  const a = hexToRgb(hex)
  const b = hexToRgb(target)
  return toHex(a.map((v, i) => v + (b[i] - v) * t))
}
const lighten = (hex, t) => mix(hex, '#ffffff', t)
const darken = (hex, t) => mix(hex, '#000000', t)

/* ── estilo por modelo: espessura do aro, encaixe e tom das lentes ───────── */
const STYLES = {
  round: { stroke: 8, io: 73, lensTint: '#dbeafe', bar: 'none', pads: true },
  aviator: { stroke: 6, io: 72, lensTint: '#d1fae5', bar: 'aviator', pads: true },
  square: { stroke: 13, io: 74, lensTint: '#e2e8f0', bar: 'none', pads: false },
  cat: { stroke: 11, io: 62, lensTint: '#f5d0fe', bar: 'none', pads: false },
  sport: { stroke: 15, io: 80, lensTint: '#bae6fd', bar: 'sport', pads: false },
  rimless: { stroke: 3.5, io: 70, lensTint: '#e2e8f0', bar: 'none', pads: false },
}

/* ── contorno de uma lente (s = -1 lente esquerda, +1 lente direita) ─────── */
function lensEl(shape, cx, s) {
  switch (shape) {
    case 'square':
      return `<rect x="${cx - 74}" y="33" width="148" height="134" rx="34" ry="34"/>`
    case 'aviator':
      return `<path d="M ${cx - 75} 60 C ${cx - 80} 64 ${cx - 78} 80 ${cx - 72} 104 C ${cx - 64} 138 ${cx - 34} 156 ${cx} 156 C ${cx + 34} 156 ${cx + 64} 138 ${cx + 72} 104 C ${cx + 78} 80 ${cx + 80} 64 ${cx + 75} 60 C ${cx + 40} 50 ${cx - 40} 50 ${cx - 75} 60 Z"/>`
    case 'cat':
      // cat-eye: canto superior externo puxado para cima e para fora (pontiagudo)
      return `<path d="M ${cx - s * 52} 72 Q ${cx + s * 28} 50 ${cx + s * 88} 40 Q ${cx + s * 90} 80 ${cx + s * 64} 118 Q ${cx + s * 32} 152 ${cx} 147 Q ${cx - s * 46} 145 ${cx - s * 60} 110 Q ${cx - s * 66} 86 ${cx - s * 52} 72 Z"/>`
    case 'sport':
      return `<path d="M ${cx - s * 80} 66 Q ${cx - s * 40} 56 ${cx + s * 64} 58 Q ${cx + s * 88} 60 ${cx + s * 84} 100 Q ${cx + s * 78} 150 ${cx + s * 4} 152 Q ${cx - s * 72} 152 ${cx - s * 88} 104 Q ${cx - s * 92} 74 ${cx - s * 80} 66 Z"/>`
    case 'rimless':
      return `<rect x="${cx - 70}" y="56" width="140" height="90" rx="26" ry="26"/>`
    case 'round':
    default:
      return `<circle cx="${cx}" cy="${CY}" r="73"/>`
  }
}

/* ── reflexos de vidro recortados dentro da lente ────────────────────────── */
function reflections(cx, clip) {
  return `
    <g clip-path="url(#${clip})">
      <g transform="rotate(-26 ${cx} ${CY})" fill="#ffffff">
        <rect x="${cx - 92}" y="${CY - 96}" width="22" height="210" opacity="0.20"/>
        <rect x="${cx - 58}" y="${CY - 96}" width="10" height="210" opacity="0.12"/>
      </g>
      <ellipse cx="${cx - 20}" cy="${CY - 34}" rx="30" ry="13" fill="#ffffff" opacity="0.10"/>
    </g>`
}

export function buildGlassesSvg({ shape = 'round', color = '1f57eb' } = {}) {
  const base = norm(color)
  const st = STYLES[shape] ?? STYLES.round
  const { stroke: W, io, bar, pads } = st

  const leftLens = lensEl(shape, LEFT_CX, -1)
  const rightLens = lensEl(shape, RIGHT_CX, 1)

  // ponte do nariz (mais alta/arqueada no aviador, estilo "keyhole")
  const bridgeY = shape === 'aviator' ? 80 : 90
  const bridge = `<path d="M ${LEFT_CX + io} 94 Q 240 ${bridgeY} ${RIGHT_CX - io} 94"/>`

  // hastes (com leve subida em direção às têmporas)
  const temples =
    `<path d="M ${LEFT_CX - io} 86 L 12 72"/>` +
    `<path d="M ${RIGHT_CX + io} 86 L 468 72"/>`

  // barra superior (duplo aro do aviador / brow do esportivo)
  let topBar = ''
  if (bar === 'aviator') topBar = `<path d="M ${LEFT_CX + 28} 64 L ${RIGHT_CX - 28} 64"/>`
  if (bar === 'sport') topBar = `<path d="M ${LEFT_CX + 18} 60 Q 240 50 ${RIGHT_CX - 18} 60"/>`

  // plaquetas de nariz discretas (modelos metálicos finos)
  const nosePads = pads
    ? `<path d="M ${LEFT_CX + io - 4} 108 q -10 10 -18 11"/>` +
      `<path d="M ${RIGHT_CX - io + 4} 108 q 10 10 18 11"/>`
    : ''

  const frameInner = `${leftLens}${rightLens}${bridge}${temples}${topBar}${nosePads}`

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${OVERLAY_VIEWBOX.width}" height="${OVERLAY_VIEWBOX.height}" viewBox="0 0 ${OVERLAY_VIEWBOX.width} ${OVERLAY_VIEWBOX.height}">
  <defs>
    <!-- brilho metálico vertical do aro -->
    <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${lighten(base, 0.6)}"/>
      <stop offset="22%"  stop-color="${lighten(base, 0.22)}"/>
      <stop offset="50%"  stop-color="${base}"/>
      <stop offset="74%"  stop-color="${darken(base, 0.3)}"/>
      <stop offset="100%" stop-color="${darken(base, 0.05)}"/>
    </linearGradient>
    <!-- lente escura tipo óculos de sol (cinza-escuro -> quase preto), translúcida -->
    <linearGradient id="lens" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#3a4150" stop-opacity="0.52"/>
      <stop offset="50%"  stop-color="#1b2130" stop-opacity="0.60"/>
      <stop offset="100%" stop-color="#0a0e17" stop-opacity="0.68"/>
    </linearGradient>
    <clipPath id="clipL">${leftLens}</clipPath>
    <clipPath id="clipR">${rightLens}</clipPath>
  </defs>

  <!-- 1) preenchimento translúcido das lentes -->
  <g fill="url(#lens)">${leftLens}${rightLens}</g>

  <!-- 2) reflexos de vidro (recortados em cada lente) -->
  ${reflections(LEFT_CX, 'clipL')}
  ${reflections(RIGHT_CX, 'clipR')}

  <!-- 3) sombra interna do aro (profundidade) -->
  <g fill="none" stroke="${darken(base, 0.45)}" stroke-opacity="0.5" stroke-width="${W + 2.5}" stroke-linejoin="round" stroke-linecap="round">
    ${frameInner}
  </g>

  <!-- 4) aro metálico -->
  <g fill="none" stroke="url(#metal)" stroke-width="${W}" stroke-linejoin="round" stroke-linecap="round">
    ${frameInner}
  </g>

  <!-- 5) brilho fino no topo do aro -->
  <g fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="${Math.max(1, W * 0.28)}" stroke-linecap="round">
    ${leftLens}${rightLens}
  </g>

  <!-- 6) dobradiças -->
  <g fill="${lighten(base, 0.1)}">
    <circle cx="${LEFT_CX - io}" cy="86" r="4.5"/>
    <circle cx="${RIGHT_CX + io}" cy="86" r="4.5"/>
  </g>
</svg>`.trim()

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
