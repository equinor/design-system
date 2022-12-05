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
  closeMenuOnClickIndexes: number[]
  onClose: (e?: MouseEvent) => void
}

type UseMenu<T> = T & {
  setFocusedIndex: (index: number) => void
  setInitialFocus: (initialFocus: FocusTarget) => void
  setOnClose: (onClose: (e?: MouseEvent) => void) => void
  addCloseMenuOnClickIndex: (index: number) => void
  removeCloseMenuOnClickIndex: (index: number) => void
}

const initalState: State = {
  focusedIndex: -1,
  initialFocus: null,
  onClose: null,
  closeMenuOnClickIndexes: [],
}

const MenuContext = createContext<State>(initalState)

type ProviderProps = { children: ReactNode }

export const MenuProvider = ({ children }: ProviderProps): JSX.Element => {
  const [state, setState] = useState<State>(initalState)

  const { focusedIndex, initialFocus, onClose, closeMenuOnClickIndexes } = state

  const setFocusedIndex: UseMenu<State>['setFocusedIndex'] = (i) => {
    setState((prevState) => ({ ...prevState, focusedIndex: i }))
  }
  const setInitialFocus: UseMenu<State>['setInitialFocus'] = (initialFocus) => {
    setState((prevState) => ({ ...prevState, initialFocus: initialFocus }))
  }

  const addCloseMenuOnClickIndex: UseMenu<State>['addCloseMenuOnClickIndex'] = (
    index: number,
  ) => {
    const newCloseMenuOnClickIndexes = [...closeMenuOnClickIndexes]

    if (!newCloseMenuOnClickIndexes.includes(index)) {
      newCloseMenuOnClickIndexes.push(index)
    }

    setState((prevState) => ({
      ...prevState,
      closeMenuOnClickIndexes: newCloseMenuOnClickIndexes,
    }))
  }

  const removeCloseMenuOnClickIndex: UseMenu<State>['removeCloseMenuOnClickIndex'] =
    (index: number) => {
      const newCloseMenuOnClickIndexes = [...closeMenuOnClickIndexes]
      const location = newCloseMenuOnClickIndexes.indexOf(index)

      if (location > -1) {
        newCloseMenuOnClickIndexes.splice(location, 1)
      }

      setState((prevState) => ({
        ...prevState,
        closeMenuOnClickIndexes: newCloseMenuOnClickIndexes,
      }))
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
    closeMenuOnClickIndexes,
    addCloseMenuOnClickIndex,
    removeCloseMenuOnClickIndex,
  }
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}
export const useMenu = (): UseMenu<State> =>
  useContext<State>(MenuContext) as UseMenu<State>
