import React from 'react'

export const initalState = {
  isFocused: false,
}

const TextFieldContext = React.createContext(initalState)

TextFieldContext.displayName = 'TextFieldContext'

export { TextFieldContext }

export const propsFor = {
  variants: ['error', 'warning', 'success', 'default'],
}
