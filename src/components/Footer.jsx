export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950">
      <div className="container-max flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-500 text-sm font-black text-white">
            V
          </span>
          <span className="font-bold">
            Vision<span className="text-brand-400">Tech</span>
          </span>
        </div>
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} VisionTech — Projeto fictício para feira de
          tecnologia escolar.
        </p>
      </div>
    </footer>
  )
}
