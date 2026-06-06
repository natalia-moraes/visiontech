import { useNavigate } from 'react-router-dom'
import Button from './Button.jsx'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden">
      {/* brilhos decorativos de fundo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      </div>

      <div className="container-max relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-brand-300 ring-1 ring-white/10">
            ✨ Tecnologia de try-on virtual
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Experimente o{' '}
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              futuro
            </span>{' '}
            no seu rosto.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-300">
            Escolha um modelo de óculos e veja na hora como ele fica em você,
            usando apenas a câmera do seu dispositivo. Sem instalar nada.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" onClick={() => navigate('/try-on')}>
              Experimentar Agora →
            </Button>
            <Button variant="ghost" size="lg" onClick={() => {
              document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              Ver catálogo
            </Button>
          </div>

          <dl className="mt-12 flex gap-10">
            {[
              { k: '6+', v: 'Modelos exclusivos' },
              { k: '100%', v: 'No navegador' },
              { k: '0s', v: 'Tempo de espera' },
            ].map((stat) => (
              <div key={stat.v}>
                <dt className="text-2xl font-black text-white">{stat.k}</dt>
                <dd className="text-sm text-slate-400">{stat.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* mockup visual */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="animate-float relative aspect-square w-full max-w-md rounded-3xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 p-1 ring-1 ring-white/10">
            <div className="grid h-full w-full place-items-center rounded-[22px] bg-slate-900/80">
              <div className="text-center">
                <div className="mx-auto mb-4 text-7xl">🕶️</div>
                <p className="text-sm font-medium text-slate-400">
                  Pré-visualização em tempo real
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
