import * as React from 'react'
import { useState, useContext, ReactNode, MouseEvent } from 'react'

export type State = {
  focusedIndex: number
  onClose: (e?: MouseEvent) => void
}

type UseMenu<T> = T & {
  setFocusedIndex: (index: number) => void
  setOnClose: (onClose: (e?: MouseEvent) => void) => void
}

const initalState: State = {
  focusedIndex: -1,
  onClose: null,
}

const MenuContext = React.createContext<State>(initalState)

type ProviderProps = { children: ReactNode }

export const MenuProvider = ({ children }: ProviderProps): JSX.Element => {
  const [state, setState] = useState<State>(initalState)

  const { focusedIndex, onClose } = state

  const setFocusedIndex: UseMenu<State>['setFocusedIndex'] = (i) => {
    setState((prevState) => ({ ...prevState, focusedIndex: i }))
  }

  const setOnClose: UseMenu<State>['setOnClose'] = (onClose) => {
    setState((prevState) => ({ ...prevState, onClose }))
  }

  const value = {
    setFocusedIndex,
    focusedIndex,
    setOnClose,
    onClose,
  }
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}
export const useMenu = (): UseMenu<State> =>
  useContext<State>(MenuContext) as UseMenu<State>
