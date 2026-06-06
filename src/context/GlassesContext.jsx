import { createContext, useContext, useMemo, useState } from 'react'

/**
 * Contexto global responsável por armazenar o modelo de óculos
 * selecionado pelo visitante e disponibilizá-lo para qualquer
 * página/componente (ex.: catálogo -> página de try-on).
 */
const GlassesContext = createContext(null)

export function GlassesProvider({ children }) {
  const [selectedGlasses, setSelectedGlasses] = useState(null)

  const clearSelection = () => setSelectedGlasses(null)

  const value = useMemo(
    () => ({ selectedGlasses, setSelectedGlasses, clearSelection }),
    [selectedGlasses],
  )

  return <GlassesContext.Provider value={value}>{children}</GlassesContext.Provider>
}

// Hook utilitário para consumir o contexto com segurança.
export function useGlasses() {
  const context = useContext(GlassesContext)
  if (!context) {
    throw new Error('useGlasses deve ser usado dentro de um <GlassesProvider>')
  }
  return context
}
