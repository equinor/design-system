import * as React from 'react'
import { useState, useContext, ReactNode } from 'react'
import { Density } from './Table.types'

type State = {
  density: Density
}

const initalState: State = {
  density: 'comfortable',
}

type UseTableProps<T> = {
  setDensity: (density: Density) => void
} & T

const TableContext = React.createContext<State>(initalState)

type ProviderProps = { children: ReactNode }

export const TableProvider = ({ children }: ProviderProps): JSX.Element => {
  const [state, setState] = useState<State>(initalState)

  const setDensity = (density: Density) => setState({ ...state, density })

  const value = {
    setDensity,
    density: state.density,
  }
  return <TableContext.Provider value={value}>{children}</TableContext.Provider>
}

export const useTable = (): UseTableProps<State> =>
  useContext<State>(TableContext) as UseTableProps<State>
