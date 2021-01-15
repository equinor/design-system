import * as React from 'react'
import { useState, useContext, ReactNode } from 'react'

type Density = 'compact' | 'comfortable'

type State = {
  density: Density
}

const initalState: State = {
  density: 'comfortable',
}

type UseEdsProps<T> = {
  setDensity: (density: Density) => void
} & T

const EdsContext = React.createContext<State>(initalState)

type ProviderProps = { children: ReactNode }

export const EdsProvider = ({ children }: ProviderProps): JSX.Element => {
  const [state, setState] = useState<State>(initalState)

  const setDensity = (density: Density) => setState({ ...state, density })

  const value = {
    setDensity,
    density: state.density,
  }
  return <EdsContext.Provider value={value}>{children}</EdsContext.Provider>
}

export const useEds = (): UseEdsProps<State> =>
  useContext<State>(EdsContext) as UseEdsProps<State>
