import * as React from 'react'
import { useState, useContext, ReactNode } from 'react'

export const propsFor = {
  variants: ['error', 'warning', 'success', 'default'],
}

type State = {
  isFocused: boolean
}

type UseTextFieldProps<T> = {
  handleFocus: () => void
  handleBlur: () => void
} & T

const initalState: State = {
  isFocused: false,
}

const TextFieldContext = React.createContext<State>(initalState)

type ProviderProps = { children: ReactNode }

export const TextFieldProvider = ({ children }: ProviderProps): JSX.Element => {
  const [state, setState] = useState<State>(initalState)

  const handleFocus = () => {
    setState({ ...state, isFocused: true })
  }
  const handleBlur = () => {
    setState({ ...state, isFocused: false })
  }
  const value = {
    handleFocus,
    handleBlur,
    isFocused: state.isFocused,
  }
  return (
    <TextFieldContext.Provider value={value}>
      {children}
    </TextFieldContext.Provider>
  )
}

export const useTextField = (): UseTextFieldProps<State> =>
  useContext<State>(TextFieldContext) as UseTextFieldProps<State>
