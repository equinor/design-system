import * as React from 'react'

import {
  useState,
  useContext,
  ReactNode,
  MouseEvent,
  KeyboardEvent,
} from 'react'

export type State = {
  focusedIndex: number
  onClose: (e?: MouseEvent | KeyboardEvent) => void
}

const initalState: State = {
  focusedIndex: -1,
  onClose: null,
}

const DrawerContext = React.createContext<State>(initalState)

type ProviderProps = { children: ReactNode }

type UseDrawer<T> = T & {
  setFocusedIndex: (index: number, drawerListId: string) => void
  setOnClose: (onClose: (e?: MouseEvent | KeyboardEvent) => void) => void
}

export const DrawerProvider = ({ children }: ProviderProps): JSX.Element => {
  const [state, setState] = useState<State>(initalState)
  const { focusedIndex, onClose } = state
  const setFocusedIndex: UseDrawer<State>['setFocusedIndex'] = (
    i,
    drawerListId,
  ) => {
    console.log('context', i, drawerListId)
    setState({ ...state, focusedIndex: i })
  }

  const setOnClose: UseDrawer<State>['setOnClose'] = (onClose) => {
    setState({ ...state, onClose })
  }

  const value = {
    setFocusedIndex,
    focusedIndex,
    setOnClose,
    onClose,
  }

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  )
}

export const useDrawer = (): UseDrawer<State> =>
  useContext<State>(DrawerContext) as UseDrawer<State>
