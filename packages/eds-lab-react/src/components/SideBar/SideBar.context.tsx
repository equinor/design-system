import {
  useState,
  useContext,
  ReactNode,
  createContext,
  useCallback,
} from 'react'

export type State = {
  isOpen: boolean
}

type UseSidebarProps<T> = T & {
  setIsOpen: (open: boolean) => void
}

const initalState: State = {
  isOpen: false,
}

const SideBarContext = createContext<State>(initalState)

type ProviderProps = { children: ReactNode }

export const SideBarProvider = ({ children }: ProviderProps): JSX.Element => {
  const [state, setState] = useState<State>(initalState)
  const { isOpen } = state

  const setIsOpen = useCallback((open: boolean) => {
    setState((prevState) => ({ ...prevState, isOpen: open }))
  }, [])

  const value = {
    setIsOpen,
    isOpen,
  }
  return (
    <SideBarContext.Provider value={value}>{children}</SideBarContext.Provider>
  )
}

export const useSideBar = (): UseSidebarProps<State> =>
  useContext<State>(SideBarContext) as UseSidebarProps<State>
