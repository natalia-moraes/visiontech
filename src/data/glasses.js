import { buildGlassesSvg } from '../utils/glassesSvg.js'

// === PNGs reais do catálogo (carga resiliente) ==============================
// Usa import.meta.glob para resolver QUALQUER .png presente em assets/glasses.
// Se um arquivo não existir, simplesmente não entra no mapa e o card cai para
// o SVG — assim o build nunca quebra por um PNG ausente.
const pngModules = import.meta.glob('../assets/glasses/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
const png = (file) => pngModules[`../assets/glasses/${file}`]

const pngRedondo = png('fem-sol-redondo.png')
const pngRetangularFem = png('fem-sol-retangular.png')
const pngAviador = png('mas-sol-aviador.png')
const pngColorido = png('colorido.png')
const pngRetangularMas = png('mas-sol-retangular.png')
const pngMeme = png('meme.png')

/**
 * Dados mockados localmente do catálogo de óculos.
 *
 * - `shape` + `color` alimentam o gerador vetorial (src/utils/glassesSvg.js).
 * - `overlay` é a imagem transparente desenhada sobre o rosto no try-on.
 * - `image` é a arte exibida no card do catálogo.
 * - `fit` ajusta o encaixe daquele modelo no rosto (ver abaixo).
 *
 * ─── USANDO PNGs EM ALTA RESOLUÇÃO ──────────────────────────────────────────
 * Para trocar o vetor por um PNG real (recomendado: ~1024px de largura, fundo
 * transparente, óculos centralizado horizontalmente e com as lentes na metade
 * vertical da imagem):
 *
 *   import auroraPng from '../assets/glasses/aurora.png'
 *   { id:'aurora', ..., overlayPng: auroraPng }
 *
 * O provador usa `overlayPng` quando presente e cai para o SVG gerado caso
 * contrário. Ajuste o encaixe de cada PNG pelo objeto `fit`:
 *   - widthFactor: multiplica a largura (1 = vão das lentes = distância dos olhos)
 *   - offsetY:     desloca verticalmente (fração da altura; + desce, - sobe)
 *   - smoothing:   0..1, suavização do movimento (menor = mais estável)
 * ────────────────────────────────────────────────────────────────────────────
 */
const models = [
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Armação redonda em metal leve, ideal para o dia a dia.',
    price: 'R$ 349',
    shape: 'round',
    color: '1f57eb',
    overlayPng: pngRedondo,
    fit: { widthFactor: 1.0, offsetY: 0.02 },
  },
  {
    id: 'nebula',
    name: 'Nebula',
    description: 'Acetato quadrado com pegada retrô e toque moderno.',
    price: 'R$ 399',
    shape: 'square',
    color: '7c3aed',
    overlayPng: pngRetangularFem,
    fit: { widthFactor: 1.02, offsetY: 0.0 },
  },
  {
    id: 'orbit',
    name: 'Orbit',
    description: 'Modelo aviador clássico com lentes polarizadas.',
    price: 'R$ 459',
    shape: 'aviator',
    color: '0ea5e9',
    overlayPng: pngAviador,
    fit: { widthFactor: 1.0, offsetY: 0.05 },
  },
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Esportivo e resistente, perfeito para atividades ao ar livre.',
    price: 'R$ 529',
    shape: 'sport',
    color: '059669',
    overlayPng: pngColorido,
    fit: { widthFactor: 1.05, offsetY: 0.0 },
  },
  {
    id: 'lumen',
    name: 'Lumen',
    description: 'Design minimalista sem aro, ultraleve e discreto.',
    price: 'R$ 489',
    shape: 'rimless',
    color: 'db2777',
    overlayPng: pngRetangularMas,
    fit: { widthFactor: 1.0, offsetY: 0.02 },
  },
  {
    id: 'vortex',
    name: 'Vortex',
    description: 'Armação gatinho ousada para um visual marcante.',
    price: 'R$ 419',
    shape: 'cat',
    color: 'ea580c',
    overlayPng: pngMeme,
    fit: { widthFactor: 1.02, offsetY: -0.02 },
  },
]

const DEFAULT_FIT = { widthFactor: 1, offsetY: 0, smoothing: 0.4 }

export const glassesCatalog = models.map((model) => {
  // SVG premium gerado vetorialmente — usado SOMENTE no provador virtual.
  const svg = buildGlassesSvg({ shape: model.shape, color: model.color })
  return {
    ...model,
    fit: { ...DEFAULT_FIT, ...model.fit },
    // Provador virtual: sempre o SVG (frontal, transparente, ancorado).
    overlay: svg,
    // Catálogo (cards de produto): a fotografia PNG real.
    image: model.overlayPng ?? svg,
  }
})
