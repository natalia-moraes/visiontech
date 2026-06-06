import { OVERLAY_VIEWBOX } from './glassesSvg.js'

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  LANDMARKS DO MEDIAPIPE FACE MESH USADOS NESTE PROVADOR
 * ───────────────────────────────────────────────────────────────────────────
 *  O Face Landmarker devolve 478 pontos normalizados (x, y, z em 0..1).
 *  Para posicionar óculos de forma realista usamos:
 *
 *   • Olhos (escala + rotação + centralização horizontal)
 *       33  = canto EXTERNO do olho direito      133 = canto INTERNO do olho direito
 *       263 = canto EXTERNO do olho esquerdo     362 = canto INTERNO do olho esquerdo
 *       → o centro de cada olho é a média do canto interno e externo;
 *       → a distância entre os dois centros é a base da ESCALA;
 *       → o ângulo entre eles dá a ROTAÇÃO (roll / inclinação lateral).
 *
 *   • Nariz (centralização vertical + perspectiva)
 *       168 = topo da ponte nasal (entre os olhos) → âncora vertical estável,
 *             onde os óculos "apoiam"; acompanha o movimento de cabeça p/ cima/baixo.
 *         1 = ponta do nariz → usada para estimar o YAW (giro horizontal da cabeça):
 *             quanto o nariz se desloca em relação ao meio dos olhos.
 *
 *   • Têmporas (largura facial / referência de perspectiva)
 *       127 = lateral direita do rosto    356 = lateral esquerda do rosto
 *
 *  Combinando olhos + nariz a âncora fica estável tanto na horizontal quanto
 *  na vertical, e o YAW permite "afundar" o lado do rosto que está mais longe.
 * ───────────────────────────────────────────────────────────────────────────
 */
const LM = {
  rightEyeOuter: 33,
  rightEyeInner: 133,
  leftEyeOuter: 263,
  leftEyeInner: 362,
  noseBridge: 168,
  noseTip: 1,
  faceRight: 127,
  faceLeft: 356,
}

// Distância entre os centros das lentes no SVG (RIGHT_CX - LEFT_CX = 200).
const SVG_LENS_SPAN = 200
const ASPECT = OVERLAY_VIEWBOX.height / OVERLAY_VIEWBOX.width

const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
const lerp = (a, b, t) => a + (b - a) * t
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

// Quantos frames manter a última pose quando o rosto some por um instante
// (evita o óculos "piscar" em detecções intermitentes).
const HOLD_FRAMES = 6

/**
 * Cria um renderizador com ESTADO próprio. O estado guardado entre frames é o
 * que permite a SUAVIZAÇÃO (interpolação exponencial) — sem ele os valores
 * saltariam a cada detecção, causando tremulação.
 */
export function createGlassesRenderer() {
  // Pose suavizada acumulada entre frames.
  const s = {
    init: false,
    cx: 0,
    cy: 0,
    width: 0,
    angle: 0,
    skew: 0, // cisalhamento horizontal (perspectiva por yaw)
    scaleX: 1, // achatamento horizontal (perspectiva por yaw)
    misses: 0,
  }

  function reset() {
    s.init = false
    s.misses = 0
  }

  /**
   * Calcula a pose-alvo a partir dos landmarks e devolve {cx,cy,width,angle,skew,scaleX}.
   */
  function computeTarget(landmarks, width, height, cfg) {
    const px = (i) => ({ x: landmarks[i].x * width, y: landmarks[i].y * height })

    const rightEye = mid(px(LM.rightEyeOuter), px(LM.rightEyeInner))
    const leftEye = mid(px(LM.leftEyeOuter), px(LM.leftEyeInner))
    const noseBridge = px(LM.noseBridge)
    const noseTip = px(LM.noseTip)

    // (1) ESCALA — distância entre os centros dos olhos.
    const dx = leftEye.x - rightEye.x
    const dy = leftEye.y - rightEye.y
    const eyeDistance = Math.hypot(dx, dy)
    const glassesWidth =
      eyeDistance * (OVERLAY_VIEWBOX.width / SVG_LENS_SPAN) * (cfg.widthFactor ?? 1)

    // (2) ROTAÇÃO — inclinação lateral (roll) pela linha dos olhos.
    const angle = Math.atan2(dy, dx)

    // (3) CENTRALIZAÇÃO — mistura entre o meio dos olhos e a ponte do nariz.
    const eyeMid = mid(rightEye, leftEye)
    const cx = lerp(eyeMid.x, noseBridge.x, 0.5)
    const cy = lerp(eyeMid.y, noseBridge.y, 0.35)

    // (7) PERSPECTIVA — estima o YAW (giro horizontal) pelo deslocamento da
    // ponta do nariz em relação ao centro dos olhos, normalizado pela
    // distância interpupilar (independe da distância à câmera).
    const yaw = clamp((noseTip.x - eyeMid.x) / (eyeDistance || 1), -0.6, 0.6)
    const scaleX = 1 - Math.abs(yaw) * 0.45 // lado distante "afunda"
    const skew = yaw * 0.55 // cisalhamento que simula a rotação 3D

    // Deslocamento vertical fino por modelo (apoio no nariz / framing do PNG).
    const offsetY = (cfg.offsetY ?? 0) * glassesWidth * ASPECT

    return { cx, cy: cy + offsetY, width: glassesWidth, angle, skew, scaleX }
  }

  /**
   * Renderiza um frame. Deve ser chamado após o ctx.clearRect do loop.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {Array|null} landmarks   landmarks normalizados (ou null se não houve rosto)
   * @param {HTMLImageElement} image PNG/SVG transparente dos óculos
   * @param {number} width, height   dimensões do canvas
   * @param {object} cfg             { offsetY, widthFactor, smoothing }
   */
  function render(ctx, landmarks, image, width, height, cfg = {}) {
    if (!image || !image.complete || image.naturalWidth === 0) return

    if (landmarks) {
      const t = computeTarget(landmarks, width, height, cfg)
      const a = cfg.smoothing ?? 0.4 // 0 = travado, 1 = sem suavização

      if (!s.init) {
        // primeira detecção: assume a pose direto (sem "voar" da origem)
        Object.assign(s, t, { init: true })
      } else {
        // (6) SUAVIZAÇÃO — interpolação exponencial em direção ao alvo.
        s.cx = lerp(s.cx, t.cx, a)
        s.cy = lerp(s.cy, t.cy, a)
        s.width = lerp(s.width, t.width, a)
        s.angle = lerp(s.angle, t.angle, a)
        s.skew = lerp(s.skew, t.skew, a)
        s.scaleX = lerp(s.scaleX, t.scaleX, a)
      }
      s.misses = 0
    } else {
      // Rosto não detectado: mantém a última pose por alguns frames.
      if (!s.init || s.misses >= HOLD_FRAMES) return
      s.misses += 1
    }

    const w = s.width
    const h = w * ASPECT
    if (w <= 0) return

    ctx.save()
    ctx.translate(s.cx, s.cy)
    ctx.rotate(s.angle)
    // (7) aplica perspectiva: achatamento horizontal + cisalhamento.
    ctx.transform(s.scaleX, 0, s.skew, 1, 0, 0)

    // (5) SOMBRA — passada extra do óculos em preto, borrado e deslocado
    // para baixo, criando uma sombra suave projetada no rosto.
    const blur = Math.max(2, w * 0.012)
    ctx.save()
    ctx.globalAlpha = 0.3
    ctx.filter = `blur(${blur}px) brightness(0)`
    ctx.drawImage(image, -w / 2, -h / 2 + h * 0.1, w, h)
    ctx.restore()

    // Óculos em si (a transparência das lentes vem embutida na arte).
    ctx.drawImage(image, -w / 2, -h / 2, w, h)
    ctx.restore()
  }

  return { render, reset }
}
