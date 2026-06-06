import { glassesCatalog } from '../data/glasses.js'
import GlassesCard from './GlassesCard.jsx'

export default function Catalog() {
  return (
    <section id="catalogo" className="container-max py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
          Escolha o seu modelo
        </h2>
        <p className="mt-4 text-slate-400">
          Selecione um dos nossos modelos e experimente virtualmente em segundos.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {glassesCatalog.map((glasses) => (
          <GlassesCard key={glasses.id} glasses={glasses} />
        ))}
      </div>
    </section>
  )
}
