import {
  useState,
  useContext,
  ReactNode,
  MouseEvent,
  createContext,
} from 'react'
import type { FocusTarget } from './Menu.types'

export type State = {
  focusedIndex: number
  initialFocus: FocusTarget
  onClose: (e?: MouseEvent) => void
}

type UseMenu<T> = T & {
  setFocusedIndex: (index: number) => void
  setInitialFocus: (initialFocus: FocusTarget) => void
  setOnClose: (onClose: (e?: MouseEvent) => void) => void
}

const initalState: State = {
  focusedIndex: -1,
  initialFocus: null,
  onClose: null,
}

const MenuContext = createContext<State>(initalState)

type ProviderProps = { children: ReactNode }

export const MenuProvider = ({ children }: ProviderProps): JSX.Element => {
  const [state, setState] = useState<State>(initalState)

  const { focusedIndex, initialFocus, onClose } = state

  const setFocusedIndex: UseMenu<State>['setFocusedIndex'] = (i) => {
    setState((prevState) => ({ ...prevState, focusedIndex: i }))
  }
  const setInitialFocus: UseMenu<State>['setInitialFocus'] = (initialFocus) => {
    setState((prevState) => ({ ...prevState, initialFocus: initialFocus }))
  }

  const setOnClose: UseMenu<State>['setOnClose'] = (onClose) => {
    const onCloseHelper = () => {
      setFocusedIndex(-1)
      setInitialFocus(null)
      onClose()
    }
    setState((prevState) => ({ ...prevState, onClose: onCloseHelper }))
  }

  const value = {
    setFocusedIndex,
    focusedIndex,
    setInitialFocus,
    initialFocus,
    setOnClose,
    onClose,
  }
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}
export const useMenu = (): UseMenu<State> =>
  useContext<State>(MenuContext) as UseMenu<State>
