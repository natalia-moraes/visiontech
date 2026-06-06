/**
 * Botão reutilizável com variações de estilo.
 * variant: 'primary' | 'secondary' | 'ghost'
 */
const variants = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30',
  secondary: 'bg-white text-slate-900 hover:bg-slate-100',
  ghost:
    'bg-white/5 text-slate-100 ring-1 ring-white/15 hover:bg-white/10 backdrop-blur',
}

const sizes = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
