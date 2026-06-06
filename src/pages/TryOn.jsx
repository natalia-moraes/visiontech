import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGlasses } from '../context/GlassesContext.jsx'
import WebcamView from '../components/WebcamView.jsx'
import Button from '../components/Button.jsx'

export default function TryOn() {
  const { selectedGlasses } = useGlasses()

  // Ao abrir (ex.: após "Selecionar"), traz a área da câmera para o topo —
  // importante no mobile, onde o resumo do modelo empurrava a câmera para baixo.
  useEffect(() => {
    document
      .getElementById('tryon-stage')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [selectedGlasses?.id])

  return (
    <section className="container-max py-14">
      <div className="flex flex-col gap-2">
        <Link
          to="/"
          className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
        >
          ← Voltar ao catálogo
        </Link>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Try-On Virtual
        </h1>
        <p className="text-slate-400">
          Posicione o rosto no centro da câmera e veja o resultado em tempo real.
        </p>
      </div>

      {/* Resumo do modelo selecionado */}
      <div className="mt-8">
        {selectedGlasses ? (
          <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/10">
            <img
              src={selectedGlasses.image}
              alt={selectedGlasses.name}
              className="h-16 w-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-brand-400">
                Modelo selecionado
              </p>
              <p className="text-lg font-bold text-white">
                {selectedGlasses.name}
              </p>
              <p className="text-sm text-slate-400">
                {selectedGlasses.description}
              </p>
            </div>
            <Link to="/#catalogo">
              <Button variant="ghost">Trocar modelo</Button>
            </Link>
          </div>
        ) : (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-white/15 bg-slate-900/40 p-5">
            <p className="text-slate-400">
              Você ainda não escolheu um modelo. O try-on funciona mesmo assim,
              mas selecione um óculos para a experiência completa.
            </p>
            <Link to="/#catalogo">
              <Button>Ver catálogo</Button>
            </Link>
          </div>
        )}
      </div>

      <WebcamView />
    </section>
  )
}
