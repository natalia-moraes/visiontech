import { SOUVENIR } from '../config.js'

/**
 * Gera a imagem de LEMBRANÇA (souvenir) a partir da foto já capturada pelo
 * provador. Desenha tudo num canvas offscreen (logo + foto emoldurada +
 * textos da feira) e devolve um dataURL PNG, pronto para exibir/baixar.
 *
 * Não interfere na captura: recebe o dataURL que o WebcamView já produz.
 *
 * @param {string} photoDataUrl  dataURL da foto capturada (vídeo + óculos)
 * @returns {Promise<string>}    dataURL PNG da lembrança
 */
const W = 1080
const H = 1180

// Carrega um dataURL/URL em um HTMLImageElement.
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Desenha a foto cobrindo a área (estilo object-fit: cover), com recorte.
function drawCover(ctx, img, x, y, w, h, radius) {
  ctx.save()
  // clip arredondado
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, radius)
  ctx.clip()

  const ir = img.width / img.height
  const r = w / h
  let dw = w
  let dh = h
  let dx = x
  let dy = y
  if (ir > r) {
    // imagem mais larga: ajusta pela altura e centraliza horizontalmente
    dh = h
    dw = h * ir
    dx = x - (dw - w) / 2
  } else {
    dw = w
    dh = w / ir
    dy = y - (dh - h) / 2
  }
  ctx.drawImage(img, dx, dy, dw, dh)
  ctx.restore()
}

export async function buildSouvenir(photoDataUrl) {
  const photo = await loadImage(photoDataUrl)

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  const font = (size, weight = '400', style = 'normal') =>
    `${style} ${weight} ${size}px Inter, system-ui, Arial, sans-serif`

  // Fundo
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#0b1220')
  bg.addColorStop(1, '#101a30')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Borda interna sutil
  ctx.strokeStyle = '#1f2b44'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(20, 20, W - 40, H - 40, 36)
  ctx.stroke()

  // Header / logo
  ctx.fillStyle = '#3478f6'
  ctx.beginPath()
  ctx.roundRect(72, 66, 96, 96, 24)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = font(58, '800')
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('V', 120, 133)

  ctx.textAlign = 'left'
  ctx.font = font(54, '800')
  ctx.fillStyle = '#ffffff'
  ctx.fillText('Vision', 190, 132)
  const visionW = ctx.measureText('Vision').width
  ctx.fillStyle = '#599dff'
  ctx.fillText('Tech', 190 + visionW, 132)

  // Foto capturada (emoldurada, recorte cover)
  const px = 72
  const py = 210
  const pw = W - 144
  const ph = 528
  drawCover(ctx, photo, px, py, pw, ph, 26)
  ctx.strokeStyle = '#2b3a55'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(px, py, pw, ph, 26)
  ctx.stroke()

  // Detalhe em gradiente (marca)
  const accent = ctx.createLinearGradient(0, 0, W, 0)
  accent.addColorStop(0, '#3478f6')
  accent.addColorStop(1, '#8b5cf6')

  // Footer
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.font = font(60, '800')
  ctx.fillText(SOUVENIR.fairName, W / 2, 860)

  ctx.fillStyle = accent
  ctx.beginPath()
  ctx.roundRect(W / 2 - 70, 892, 140, 6, 3)
  ctx.fill()

  ctx.fillStyle = '#93a4bf'
  ctx.font = font(38, '600')
  ctx.fillText(SOUVENIR.group, W / 2, 960)

  ctx.fillStyle = '#c7d2e0'
  ctx.font = font(36, '400', 'italic')
  ctx.fillText(`“${SOUVENIR.phrase}”`, W / 2, 1040)

  ctx.fillStyle = accent
  ctx.beginPath()
  ctx.roundRect(W / 2 - 100, 1098, 200, 10, 5)
  ctx.fill()

  return canvas.toDataURL('image/png')
}
