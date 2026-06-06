import { useEffect, useState } from 'react'
import Button from './Button.jsx'
import QrCode from './QrCode.jsx'
import { uploadSouvenir } from '../utils/uploadSouvenir.js'

/**
 * Modal que exibe a imagem de lembrança gerada após a captura.
 * Permite gerar um QR Code (upload da imagem ao Cloudinary → URL pública).
 *
 * @param {string|null} src   dataURL da lembrança (null = ainda gerando)
 * @param {boolean} loading   true enquanto a lembrança está sendo gerada
 * @param {() => void} onClose
 */
export default function SouvenirModal({ src, loading, onClose }) {
  const [qrUrl, setQrUrl] = useState(null)
  const [upState, setUpState] = useState('idle') // idle | uploading | error
  const [errMsg, setErrMsg] = useState('')

  // Fecha com ESC.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleGenerateQr = async () => {
    if (!src) return
    setUpState('uploading')
    setErrMsg('')
    try {
      const url = await uploadSouvenir(src)
      setQrUrl(url)
      setUpState('idle')
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err)
      setErrMsg(err.message || 'Falha ao enviar a imagem.')
      setUpState('error')
    }
  }

  if (!src && !loading) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-md flex-col items-center gap-5 overflow-y-auto rounded-3xl bg-slate-900 p-6 ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/5 text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10"
        >
          ✕
        </button>

        <h2 className="text-center text-lg font-bold text-white">
          Sua lembrança VisionTech 🎉
        </h2>

        {loading || !src ? (
          <div className="grid aspect-[1080/1180] w-full place-items-center rounded-2xl bg-slate-800">
            <p className="animate-pulse text-slate-400">Gerando sua lembrança…</p>
          </div>
        ) : (
          <img
            src={src}
            alt="Lembrança VisionTech"
            className="w-full rounded-2xl shadow-2xl shadow-black/40"
          />
        )}

        {/* QR Code (após upload) */}
        {qrUrl && (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <QrCode url={qrUrl} size={180} />
            <p className="text-center text-sm font-semibold text-white">
              📱 Aponte a câmera do celular
            </p>
            <p className="text-center text-xs text-slate-400">
              para levar sua lembrança para casa
            </p>
          </div>
        )}

        {upState === 'error' && (
          <p className="text-center text-sm text-red-400">{errMsg}</p>
        )}

        <div className="flex w-full flex-col gap-3">
          {!qrUrl && (
            <Button
              className="w-full"
              onClick={handleGenerateQr}
              disabled={!src || upState === 'uploading'}
            >
              {upState === 'uploading'
                ? 'Enviando…'
                : upState === 'error'
                  ? 'Tentar novamente'
                  : '📱 Gerar QR Code'}
            </Button>
          )}
          <a
            href={src ?? undefined}
            download="visiontech-lembranca.png"
            className={!src ? 'pointer-events-none opacity-50' : ''}
          >
            <Button variant={qrUrl ? 'primary' : 'secondary'} className="w-full">
              ⬇ Baixar lembrança
            </Button>
          </a>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}
