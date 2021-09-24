import { useState, useContext, createContext, ReactNode } from 'react'

type State = {
  selectedItems: string[]
  inputItems: string[]
  multiple: boolean
  highlightedIndex?: number
}

const initalState: State = {
  selectedItems: null,
  inputItems: null,
  multiple: false,
  highlightedIndex: null,
}

type UseComboboxProps<T> = {
  setSelectedItems: (selectedItems: string[]) => void
  setInputItems: (setInputItems: string[]) => void
  setHighlightedIndex: (index: number) => void
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

  const setHighlightedIndex = (highlightedIndex: number) =>
    setState((prevState) => ({ ...prevState, highlightedIndex }))

  const value = {
    selectedItems: state.selectedItems,
    inputItems: state.inputItems,
    multiple: state.multiple,
    highlightedIndex: state.highlightedIndex,
    setSelectedItems,
    setInputItems,
    setHighlightedIndex,
  }

  console.log('provider', value)

  return (
    <ComboboxContext.Provider value={value}>
      {children}
    </ComboboxContext.Provider>
  )
}

export const useComboboxContext = (): UseComboboxProps<State> =>
  useContext<State>(ComboboxContext) as UseComboboxProps<State>
