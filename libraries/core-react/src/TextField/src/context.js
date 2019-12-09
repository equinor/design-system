import React from 'react'

export const initalState = {
  isFocused: false,
}

export const TextFieldContext = React.createContext(initalState)

export const propsFor = {
  variants: ['error', 'warning', 'success', 'default'],
}
