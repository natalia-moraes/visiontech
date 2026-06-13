import { useEffect, useState } from 'react'
import { glassesCatalog } from '../data/glasses.js'
import QrCode from '../components/QrCode.jsx'
import { SITE_URL } from '../config.js'

/**
 * "Modo vitrine" (attract loop) — tela cheia para ficar em loop num 2º notebook
 * chamando o público para o stand. Slides trocam sozinhos e repetem para sempre.
 * Rota oculta /vitrine (sem navbar/rodapé). Abrir em tela cheia (F11).
 */
const SLIDE_COUNT = 4
const INTERVAL = 7000

function Slide({ active, children }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center px-10 text-center transition-opacity duration-700 ${
        active ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {children}
    </div>
  )
}

export default function Vitrine() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SLIDE_COUNT), INTERVAL)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950 text-white">
      {/* brilhos decorativos */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-brand-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[34rem] w-[34rem] rounded-full bg-purple-600/25 blur-3xl" />

      {/* logo fixo */}
      <div className="absolute left-8 top-7 z-10 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500 text-2xl font-black">
          V
        </span>
        <span className="text-2xl font-bold tracking-tight">
          Vision<span className="text-brand-400">Tech</span>
        </span>
      </div>

      {/* Slide 1 — chamada */}
      <Slide active={i === 0}>
        <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-6 py-2 text-lg font-medium text-brand-300 ring-1 ring-white/10">
          ✨ Realidade Aumentada
        </span>
        <h1 className="max-w-5xl text-6xl font-black leading-tight tracking-tight lg:text-8xl">
          Experimente óculos{' '}
          <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
            no seu rosto
          </span>
        </h1>
        <p className="mt-8 text-3xl text-slate-300">
          Venha ao nosso stand e veja na hora 🕶️
        </p>
        <div className="mt-10 animate-float text-7xl">🕶️</div>
      </Slide>

      {/* Slide 2 — vitrine de modelos */}
      <Slide active={i === 1}>
        <h2 className="text-5xl font-black tracking-tight lg:text-6xl">
          6 estilos pra brincar
        </h2>
        <p className="mt-3 text-2xl text-slate-400">
          Lentes coloridas e muita diversão
        </p>
        <div className="mt-10 grid max-w-6xl grid-cols-3 gap-6">
          {glassesCatalog.map((g) => (
            <div
              key={g.id}
              className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 ring-1 ring-white/10"
            >
              <img
                src={g.overlay}
                alt={g.name}
                className="mx-auto h-20 w-full object-contain"
              />
              <p className="mt-3 text-xl font-bold">{g.name}</p>
            </div>
          ))}
        </div>
      </Slide>

      {/* Slide 3 — lembrança */}
      <Slide active={i === 2}>
        <div className="text-7xl">📸</div>
        <h2 className="mt-6 max-w-4xl text-6xl font-black leading-tight tracking-tight lg:text-7xl">
          Tire uma foto e leve sua{' '}
          <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
            lembrança
          </span>
        </h2>
        <p className="mt-8 text-3xl text-slate-300">
          Sua foto com os óculos, com a moldura da Feira do Conhecimento 2026
        </p>
      </Slide>

      {/* Slide 4 — QR */}
      <Slide active={i === 3}>
        <h2 className="text-5xl font-black tracking-tight lg:text-6xl">
          📱 Experimente no seu celular
        </h2>
        <p className="mt-4 text-2xl text-slate-400">
          Aponte a câmera para o QR Code
        </p>
        <div className="mt-10 rounded-3xl bg-white p-5 shadow-2xl shadow-black/40">
          <QrCode url={SITE_URL} size={260} />
        </div>
        <p className="mt-6 text-xl text-slate-500">{SITE_URL}</p>
      </Slide>

      {/* indicadores de slide */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
        {Array.from({ length: SLIDE_COUNT }).map((_, n) => (
          <span
            key={n}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              n === i ? 'w-10 bg-brand-400' : 'w-2.5 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
