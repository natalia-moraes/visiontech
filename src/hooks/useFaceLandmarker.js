import { useEffect, useRef, useState } from 'react'
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

/**
 * Hook que carrega o modelo de Face Landmarker do MediaPipe (Tasks Vision)
 * e expõe uma função `detect(video, timestamp)` para uso dentro de um loop
 * de requestAnimationFrame.
 *
 * O WASM e o modelo são baixados de CDNs públicas — em produção, você pode
 * hospedar esses arquivos localmente e apontar os caminhos abaixo.
 */
const WASM_PATH =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
const MODEL_PATH =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

export function useFaceLandmarker() {
  const landmarkerRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(WASM_PATH)
        const landmarker = await FaceLandmarker.createFromOptions(
          filesetResolver,
          {
            baseOptions: { modelAssetPath: MODEL_PATH, delegate: 'GPU' },
            runningMode: 'VIDEO',
            numFaces: 1,
          },
        )
        if (cancelled) {
          landmarker.close()
          return
        }
        landmarkerRef.current = landmarker
        setStatus('ready')
      } catch (err) {
        console.error('Falha ao carregar o FaceLandmarker:', err)
        if (!cancelled) setStatus('error')
      }
    }

    init()

    return () => {
      cancelled = true
      landmarkerRef.current?.close()
      landmarkerRef.current = null
    }
  }, [])

  /**
   * Detecta os landmarks faciais de um frame de vídeo.
   * @returns array de landmarks normalizados (x,y,z em 0..1) ou null.
   */
  const detect = (video, timestamp) => {
    const landmarker = landmarkerRef.current
    if (!landmarker || !video || video.readyState < 2) return null
    const result = landmarker.detectForVideo(video, timestamp)
    return result?.faceLandmarks?.[0] ?? null
  }

  return { status, detect }
}
