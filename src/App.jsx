import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import TryOn from './pages/TryOn.jsx'
import Vitrine from './pages/Vitrine.jsx'

export default function App() {
  const { pathname } = useLocation()
  // A "vitrine" (attract loop) ocupa a tela inteira, sem navbar/rodapé.
  const fullscreen = pathname === '/vitrine'

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      {!fullscreen && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/try-on" element={<TryOn />} />
          <Route path="/vitrine" element={<Vitrine />} />
        </Routes>
      </main>
      {!fullscreen && <Footer />}
    </div>
  )
}
