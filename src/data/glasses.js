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
    name: 'Nerd Chique',
    description: 'Redondo retrô com lente oceano — pra quem é gênio e sabe.',
    price: 'R$ 349',
    shape: 'round',
    color: '1f57eb',
    overlayPng: pngRedondo,
    lens: { from: '#38bdf8', to: '#4f46e5' }, // lente colorida: Oceano (azul→roxo)
    fit: { widthFactor: 1.0, offsetY: 0.02 },
  },
  {
    id: 'nebula',
    name: 'Chefão',
    description: 'Quadrado de acetato, lente fumê. Modo sério ativado.',
    price: 'R$ 399',
    shape: 'square',
    color: '7c3aed',
    overlayPng: pngRetangularFem,
    fit: { widthFactor: 1.02, offsetY: 0.0 },
  },
  {
    id: 'orbit',
    name: 'Maverick',
    description: 'Aviador clássico com lente pôr do sol. Pronto pra decolar.',
    price: 'R$ 459',
    shape: 'aviator',
    color: '0ea5e9',
    overlayPng: pngAviador,
    lens: { from: '#ffb24d', to: '#ff4d7d' }, // lente colorida: Pôr do sol (laranja→rosa)
    fit: { widthFactor: 1.0, offsetY: 0.05 },
  },
  {
    id: 'pulse',
    name: 'Maromba',
    description: 'Esportivo neon que não para na academia.',
    price: 'R$ 529',
    shape: 'sport',
    color: '059669',
    overlayPng: pngColorido,
    lens: { from: '#a3e635', to: '#06b6d4' }, // lente colorida: Neon (limão→ciano)
    fit: { widthFactor: 1.05, offsetY: 0.0 },
  },
  {
    id: 'lumen',
    name: 'Modo Sussa',
    description: 'Minimalista gelo, leve e de boa. Sem firula.',
    price: 'R$ 489',
    shape: 'rimless',
    color: 'db2777',
    overlayPng: pngRetangularMas,
    lens: { from: '#c4b5fd', to: '#60a5fa' }, // lente colorida: Gelo (lilás→azul claro)
    fit: { widthFactor: 1.0, offsetY: 0.02 },
  },
  {
    id: 'vortex',
    name: 'Gata Bacana',
    description: 'Gatinho rosa ousado pra arrasar na feira.',
    price: 'R$ 419',
    shape: 'cat',
    color: 'ea580c',
    overlayPng: pngMeme,
    lens: { from: '#fb7185', to: '#d946ef' }, // lente colorida: Rosa (rosa→magenta)
    fit: { widthFactor: 1.02, offsetY: -0.02 },
  },
]

const DEFAULT_FIT = { widthFactor: 1, offsetY: 0, smoothing: 0.4 }

export const glassesCatalog = models.map((model) => {
  // SVG premium gerado vetorialmente — usado SOMENTE no provador virtual.
  const svg = buildGlassesSvg({ shape: model.shape, color: model.color, lens: model.lens })
  return {
    ...model,
    fit: { ...DEFAULT_FIT, ...model.fit },
    // Provador virtual: sempre o SVG (frontal, transparente, ancorado).
    overlay: svg,
    // Catálogo (cards de produto): a fotografia PNG real.
    image: model.overlayPng ?? svg,
  }
})
