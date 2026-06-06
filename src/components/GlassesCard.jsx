import { useNavigate } from 'react-router-dom'
import { useGlasses } from '../context/GlassesContext.jsx'
import Button from './Button.jsx'

export default function GlassesCard({ glasses }) {
  const navigate = useNavigate()
  const { setSelectedGlasses } = useGlasses()

  // Salva o modelo no contexto global e navega para o try-on.
  const handleSelect = () => {
    setSelectedGlasses(glasses)
    navigate('/try-on')
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-slate-900/60 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:ring-brand-400/50">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        <img
          src={glasses.image}
          alt={`Óculos modelo ${glasses.name}`}
          loading="lazy"
          className="aspect-[3/2] w-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {glasses.price}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-white">{glasses.name}</h3>
        <p className="mt-1 flex-1 text-sm text-slate-400">{glasses.description}</p>
        <Button className="mt-4 w-full" onClick={handleSelect}>
          Selecionar
        </Button>
      </div>
    </article>
  )
}
