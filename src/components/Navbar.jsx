import { Link, useNavigate } from 'react-router-dom'
import Button from './Button.jsx'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
      <nav className="container-max flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-lg font-black text-white">
            V
          </span>
          <span className="text-lg font-bold tracking-tight">
            Vision<span className="text-brand-400">Tech</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          <a href="/#catalogo" className="transition-colors hover:text-white">
            Catálogo
          </a>
          <a href="/#como-funciona" className="transition-colors hover:text-white">
            Como funciona
          </a>
          <Link to="/try-on" className="transition-colors hover:text-white">
            Try-On
          </Link>
        </div>

        <Button size="md" onClick={() => navigate('/try-on')}>
          Experimentar
        </Button>
      </nav>
    </header>
  )
}
