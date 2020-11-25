import React, { useState, useContext, ReactNode } from 'react'

type State = {
  focusedIndex: number
}

const initalState: State = {
  focusedIndex: -1,
}

const DrawerContext = React.createContext<State>(initalState)

type ProviderProps = { children: ReactNode }

export const DrawerProvider = ({ children }: ProviderProps): JSX.Element => {
  const [state, setState] = useState<State>(initalState)
  const { focusedIndex } = state

  const setFocusedIndex: UseDrawer<State>['setFocusedIndex'] = (i) => {
    setState({ focusedIndex: i })
  }

  const value = {
    setFocusedIndex,
    focusedIndex,
  }
  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  )
}

type UseDrawer<T> = T & {
  setFocusedIndex: (index: number) => void
}

export const useDrawer = (): UseDrawer<State> =>
  useContext<State>(DrawerContext) as UseDrawer<State>
//   const [state, setState] = useContext<State>(DrawerContext)
//   const { focusedIndex } = state

//   const setFocusedIndex = (i) => {
//     setState({ ...state, focusedIndex: i })
//   }

//   return {
//     setFocusedIndex,
//     focusedIndex,
//   }
