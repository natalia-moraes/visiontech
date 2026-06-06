import Hero from '../components/Hero.jsx'
import Catalog from '../components/Catalog.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import QrCode from '../components/QrCode.jsx'
import { SITE_URL } from '../config.js'

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Catalog />

      {/* Acesso rápido pelo celular via QR Code */}
      <section id="qrcode" className="border-t border-white/5 bg-slate-900/40">
        <div className="container-max flex flex-col items-center gap-6 py-16 text-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Acesse no seu celular
            </h2>
            <p className="mt-3 max-w-md text-slate-400">
              Aponte a câmera do celular para o QR Code e experimente os óculos
              virtualmente onde estiver.
            </p>
          </div>
          <QrCode url={SITE_URL} size={180} />
          <p className="text-sm text-slate-500 break-all">{SITE_URL}</p>
        </div>
      </section>
    </>
  )
}
