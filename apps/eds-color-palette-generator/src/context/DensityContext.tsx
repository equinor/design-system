'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { localStorageUtils, type Density } from '@/utils/localStorage'

type DensityContextType = {
  density: Density
  setDensity: (density: Density) => void
}

const DensityContext = createContext<DensityContextType | undefined>(undefined)

/**
 * The Tokens Studio density mode (relaxed, comfortable or compact) for the
 * page content, remembered across visits. Comfortable is the Tokens Studio
 * default. Applied to <main> by the Main component.
 */
export function DensityProvider({ children }: { children: ReactNode }) {
  // Comfortable on the server and the first render, so hydration matches;
  // the saved choice is applied after mount.
  const [density, setDensityState] = useState<Density>('comfortable')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only sync with the saved choice after hydration
    setDensityState(localStorageUtils.getDensity('comfortable'))
  }, [])

  const setDensity = useCallback((next: Density) => {
    localStorageUtils.setDensity(next)
    setDensityState(next)
  }, [])

  return (
    <DensityContext.Provider value={{ density, setDensity }}>
      {children}
    </DensityContext.Provider>
  )
}

export function useDensity(): DensityContextType {
  const context = useContext(DensityContext)
  if (!context) {
    throw new Error('useDensity must be used within a DensityProvider')
  }
  return context
}
