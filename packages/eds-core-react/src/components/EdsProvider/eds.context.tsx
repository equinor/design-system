import {
  useState,
  useContext,
  ReactNode,
  useEffect,
  createContext,
} from 'react'

export type Density = 'compact' | 'comfortable'

type State = {
  density: Density
  rootElement?: HTMLElement | null
}

const initalState: State = {
  /** Density for all components inside `EdsProvider` */
  density: 'comfortable',
}

type UseEdsProps<T> = {
  /** Use this to update the `density` from nested components in `EdsProvider` */
  setDensity: (density: Density) => void
} & T

const EdsContext = createContext<State>(initalState)

export type EdsProviderProps = {
  density?: Density
  rootElement?: HTMLElement | null
  children: ReactNode
}

export const EdsProvider: React.FC<EdsProviderProps> = ({
  children,
  density,
  rootElement,
}) => {
  const [state, setState] = useState<State>({
    ...initalState,
    density: density || 'comfortable',
  })

  const setDensity = (density: Density) =>
    setState((prevState) => ({ ...prevState, density }))

  useEffect(() => {
    if (typeof density !== 'undefined' && density !== state.density) {
      setDensity(density)
    }
  }, [density, state.density])

  const value = {
    density: state.density,
    rootElement,
    setDensity,
  }
  return <EdsContext.Provider value={value}>{children}</EdsContext.Provider>
}

export const useEds = (): UseEdsProps<State> =>
  useContext<State>(EdsContext) as UseEdsProps<State>
