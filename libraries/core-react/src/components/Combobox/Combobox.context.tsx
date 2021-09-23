import { useState, useContext, createContext, ReactNode } from 'react'

type State = {
  selectedItems: string[]
  inputItems: string[]
  multiple: boolean
}

const initalState: State = {
  selectedItems: null,
  inputItems: null,
  multiple: false,
}

type UseComboboxProps<T> = {
  setSelectedItems: (selectedItems: string[]) => void
  setInputItems: (setInputItems: string[]) => void
} & T

const ComboboxContext = createContext<State>(initalState)

export type ComboboxProvideProps = {
  children?: ReactNode
  selectedItems: string[]
  inputItems: string[]
  multiple: boolean
}

export const ComboboxProvider: React.FC<ComboboxProvideProps> = ({
  children,
  selectedItems,
  inputItems,
  multiple,
}) => {
  const [state, setState] = useState<State>({
    selectedItems,
    inputItems,
    multiple,
  })

  const setSelectedItems = (selectedItems: string[]) =>
    setState((prevState) => ({ ...prevState, selectedItems }))

  const setInputItems = (inputItems: string[]) =>
    setState((prevState) => ({ ...prevState, inputItems }))

  const value = {
    selectedItems: state.selectedItems,
    inputItems: state.inputItems,
    multiple: state.multiple,
    setSelectedItems,
    setInputItems,
  }

  return (
    <ComboboxContext.Provider value={value}>
      {children}
    </ComboboxContext.Provider>
  )
}

export const useComboboxContext = (): UseComboboxProps<State> =>
  useContext<State>(ComboboxContext) as UseComboboxProps<State>
