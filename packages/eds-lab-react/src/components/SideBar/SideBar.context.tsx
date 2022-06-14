import {
  useState,
  useContext,
  ReactNode,
  createContext,
  useCallback,
} from 'react'

export type State = {
  isOpen: boolean
  onToggle: (state: boolean) => void
}

type UseSidebarProps<T> = T & {
  setIsOpen: (open: boolean) => void
  setOnToggle: (onToggle: (state: boolean) => void) => void
}

const initalState: State = {
  isOpen: false,
  onToggle: null,
}

const SideBarContext = createContext<State>(initalState)

type ProviderProps = { children: ReactNode }

export const SideBarProvider = ({ children }: ProviderProps): JSX.Element => {
  const [state, setState] = useState<State>(initalState)
  const { isOpen, onToggle } = state

  const setIsOpen = useCallback(
    (open: boolean) => {
      setState((prevState) => ({ ...prevState, isOpen: open }))
      onToggle?.(open)
    },
    [onToggle],
  )

  const setOnToggle: UseSidebarProps<State>['setOnToggle'] = (onToggle) => {
    setState((prevState) => ({ ...prevState, onToggle }))
  }

  const value = {
    setIsOpen,
    setOnToggle,
    onToggle,
    isOpen,
  }
  return (
    <SideBarContext.Provider value={value}>{children}</SideBarContext.Provider>
  )
}

export const useSideBar = (): UseSidebarProps<State> =>
  useContext<State>(SideBarContext) as UseSidebarProps<State>
