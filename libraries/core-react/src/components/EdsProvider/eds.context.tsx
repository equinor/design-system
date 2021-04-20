import {
  useState,
  useContext,
  ReactNode,
  useEffect,
  createContext,
} from 'react'

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

const EdsContext = createContext<State>(initalState)

type ProviderProps = {
  density?: Density
  children: ReactNode
}

export const EdsProvider: React.FC<ProviderProps> = ({
  children,
  density = 'comfortable',
}) => {
  const [state, setState] = useState<State>({ ...initalState, density })

  const setDensity = (density: Density) =>
    setState((prevState) => ({ ...prevState, density }))

  useEffect(() => {
    if (typeof density !== 'undefined' && density !== state.density) {
      setDensity(density)
    }
  }, [density])

  const value = {
    density: state.density,
  }
  return <EdsContext.Provider value={value}>{children}</EdsContext.Provider>
}

export const useEds = (): UseEdsProps<State> =>
  useContext<State>(EdsContext) as UseEdsProps<State>
