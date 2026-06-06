const steps = [
  {
    icon: '👓',
    title: 'Escolha o modelo',
    text: 'Navegue pelo catálogo e selecione o óculos que mais combina com você.',
  },
  {
    icon: '📷',
    title: 'Ative a câmera',
    text: 'Permita o acesso à webcam para iniciar a experiência de try-on.',
  },
  {
    icon: '✨',
    title: 'Veja na hora',
    text: 'Visualize o modelo no seu rosto e capture uma foto para comparar.',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="border-y border-white/5 bg-slate-900/40">
      <div className="container-max py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Como funciona
          </h2>
          <p className="mt-4 text-slate-400">
            Três passos simples para encontrar o óculos perfeito.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl bg-slate-900/60 p-6 ring-1 ring-white/10"
            >
              <span className="absolute right-5 top-5 text-5xl font-black text-white/5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="text-4xl">{step.icon}</div>
              <h3 className="mt-4 text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
