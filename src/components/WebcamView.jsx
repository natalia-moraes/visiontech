import { useEffect, useRef, useState } from 'react'
import { glassesCatalog } from '../data/glasses.js'
import { useGlasses } from '../context/GlassesContext.jsx'
import { useFaceLandmarker } from '../hooks/useFaceLandmarker.js'
import { createGlassesRenderer } from '../utils/drawGlasses.js'
import { buildSouvenir } from '../utils/buildSouvenir.js'
import Button from './Button.jsx'
import SouvenirModal from './SouvenirModal.jsx'

/**
 * Provador virtual completo:
 *  - acessa a webcam (getUserMedia)
 *  - detecta o rosto em tempo real com MediaPipe Face Landmarker
 *  - desenha a imagem dos óculos sobre os olhos num <canvas> sobreposto
 *  - permite trocar entre os 6 modelos do catálogo
 *  - ajusta escala/rotação automaticamente pela distância entre os olhos
 */
export default function WebcamView() {
  const videoRef = useRef(null)
  const overlayRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(0)
  const lastVideoTimeRef = useRef(-1)
  const activeImageRef = useRef(null)
  const activeFitRef = useRef(null)
  const rendererRef = useRef(createGlassesRenderer())

  const { selectedGlasses, setSelectedGlasses } = useGlasses()
  const { status: meshStatus, detect } = useFaceLandmarker()

  const [camState, setCamState] = useState('idle') // idle | loading | active | error
  const [capturedPhoto, setCapturedPhoto] = useState(null)

  // Lembrança (souvenir) gerada após a captura.
  const [souvenir, setSouvenir] = useState(null) // dataURL ou null
  const [souvenirOpen, setSouvenirOpen] = useState(false)

  // Modelo ativo: o selecionado no catálogo ou o primeiro como fallback.
  const activeGlasses = selectedGlasses ?? glassesCatalog[0]

  // Pré-carrega todas as imagens dos óculos uma única vez.
  const imagesRef = useRef({})
  useEffect(() => {
    glassesCatalog.forEach((g) => {
      const img = new Image()
      img.src = g.overlay
      imagesRef.current[g.id] = img
    })
  }, [])

  // Mantém a imagem e o encaixe ativos acessíveis dentro do loop de render.
  useEffect(() => {
    activeImageRef.current = imagesRef.current[activeGlasses.id]
    activeFitRef.current = activeGlasses.fit
  }, [activeGlasses.id, activeGlasses.fit])

  // ---- Câmera ------------------------------------------------------------
  const startCamera = async () => {
    setCamState('loading')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCamState('active')
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err)
      setCamState('error')
    }
  }

  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    rendererRef.current.reset()
    const ctx = overlayRef.current?.getContext('2d')
    if (ctx && overlayRef.current) {
      ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height)
    }
    setCamState('idle')
  }

  // ---- Loop de detecção + desenho ---------------------------------------
  useEffect(() => {
    if (camState !== 'active' || meshStatus !== 'ready') return

    const video = videoRef.current
    const canvas = overlayRef.current

    const ctx = canvas.getContext('2d')
    let latestLandmarks = null

    const render = () => {
      if (video.readyState >= 2) {
        // Mantém o canvas do mesmo tamanho do frame de vídeo.
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        }

        // Detecção só roda em frames novos do vídeo (~30fps)...
        if (video.currentTime !== lastVideoTimeRef.current) {
          lastVideoTimeRef.current = video.currentTime
          latestLandmarks = detect(video, performance.now())
        }

        // ...mas o desenho/interpolação roda a cada frame de animação (~60fps),
        // o que torna a suavização do movimento fluida.
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        rendererRef.current.render(
          ctx,
          latestLandmarks,
          activeImageRef.current,
          canvas.width,
          canvas.height,
          activeFitRef.current ?? {},
        )
      }
      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
    return () => cancelAnimationFrame(rafRef.current)
  }, [camState, meshStatus, detect])

  // Libera a câmera ao desmontar.
  useEffect(() => () => stopCamera(), [])

  // ---- Captura de foto (vídeo + óculos) ---------------------------------
  const capturePhoto = () => {
    const video = videoRef.current
    const overlay = overlayRef.current
    if (!video) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')

    // Espelha para combinar com o preview exibido ao usuário.
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    if (overlay) ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height)

    const photo = canvas.toDataURL('image/png')
    setCapturedPhoto(photo)

    // Gera a lembrança e abre o modal de resultado (não altera a captura).
    setSouvenir(null)
    setSouvenirOpen(true)
    buildSouvenir(photo)
      .then((dataUrl) => setSouvenir(dataUrl))
      .catch((err) => {
        console.error('Erro ao gerar a lembrança:', err)
        setSouvenirOpen(false)
      })
  }

  const meshLabel = {
    loading: 'Carregando IA de detecção facial…',
    ready: 'Detecção facial ativa',
    error: 'Falha ao carregar a detecção facial',
  }[meshStatus]

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Área central: vídeo + canvas sobreposto.
          No mobile usa retrato (mais alto) e no desktop 16:9. */}
      <div
        id="tryon-stage"
        className="relative aspect-[3/4] w-full scroll-mt-20 overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-white/10 sm:aspect-video"
      >
        <video
          ref={videoRef}
          playsInline
          muted
          className={`h-full w-full -scale-x-100 object-cover transition-opacity ${
            camState === 'active' ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Canvas sobreposto — onde os óculos são desenhados */}
        <canvas
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 h-full w-full -scale-x-100 object-cover"
        />

        {/* Placeholders de estado */}
        {camState !== 'active' && (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            {camState === 'idle' && (
              <div>
                <div className="text-6xl">📷</div>
                <p className="mt-4 text-slate-400">
                  Ative a câmera para iniciar o provador virtual.
                </p>
                <Button className="mt-6 whitespace-nowrap" onClick={startCamera}>
                  Ativar câmera
                </Button>
              </div>
            )}
            {camState === 'loading' && (
              <p className="animate-pulse text-slate-400">Conectando à câmera…</p>
            )}
            {camState === 'error' && (
              <div>
                <div className="text-6xl">🚫</div>
                <p className="mt-4 text-slate-400">
                  Não foi possível acessar a câmera. Verifique as permissões do
                  navegador.
                </p>
                <Button className="mt-6 whitespace-nowrap" variant="ghost" onClick={startCamera}>
                  Tentar novamente
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Status no rodapé do vídeo */}
        {camState === 'active' && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-slate-950/80 to-transparent p-4">
            <span className="rounded-full bg-slate-950/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              Experimentando: {activeGlasses.name}
            </span>
            <span
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur ${
                meshStatus === 'ready'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : meshStatus === 'error'
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-slate-950/70 text-slate-300'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  meshStatus === 'ready'
                    ? 'animate-pulse bg-emerald-400'
                    : meshStatus === 'error'
                      ? 'bg-red-400'
                      : 'animate-pulse bg-slate-400'
                }`}
              />
              {meshLabel}
            </span>
          </div>
        )}
      </div>

      {/* Painel lateral */}
      <aside className="flex flex-col gap-4">
        {/* Seletor de modelos */}
        <div className="rounded-2xl bg-slate-900/60 p-5 ring-1 ring-white/10">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Modelos
          </h3>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {glassesCatalog.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGlasses(g)}
                title={g.name}
                className={`overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-2 ring-2 transition ${
                  activeGlasses.id === g.id
                    ? 'ring-brand-400'
                    : 'ring-transparent hover:ring-white/20'
                }`}
              >
                <img src={g.overlay} alt={g.name} className="h-10 w-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Controles */}
        <div className="rounded-2xl bg-slate-900/60 p-5 ring-1 ring-white/10">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Controles
          </h3>
          <div className="mt-4 flex flex-col gap-3">
            <Button onClick={capturePhoto} disabled={camState !== 'active'}>
              📸 Capturar foto
            </Button>
            {camState === 'active' ? (
              <Button variant="ghost" onClick={stopCamera}>
                Desligar câmera
              </Button>
            ) : (
              <Button variant="ghost" onClick={startCamera}>
                Ativar câmera
              </Button>
            )}
          </div>
        </div>

        {/* Última captura */}
        <div className="rounded-2xl bg-slate-900/60 p-5 ring-1 ring-white/10">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Lembrança
          </h3>
          {capturedPhoto ? (
            <div className="mt-4 space-y-3">
              <img
                src={souvenir ?? capturedPhoto}
                alt="Lembrança VisionTech"
                className="w-full rounded-xl"
              />
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setSouvenirOpen(true)}
              >
                Ver lembrança
              </Button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Nenhuma foto capturada ainda.</p>
          )}
        </div>
      </aside>

      {souvenirOpen && (
        <SouvenirModal
          src={souvenir}
          loading={!souvenir}
          onClose={() => setSouvenirOpen(false)}
        />
      )}
    </div>
  )
}
