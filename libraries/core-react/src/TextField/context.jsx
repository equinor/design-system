import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

export const propsFor = {
  variants: ['error', 'warning', 'success', 'default'],
}

const initalState = {
  isFocused: false,
}

const TextFieldContext = React.createContext(initalState)

export const TextFieldProvider = ({ children }) => {
  const [state, setState] = useState(initalState)
  return (
    // @ts-ignore
    <TextFieldContext.Provider value={[state, setState]}>
      {children}
    </TextFieldContext.Provider>
  )
}

TextFieldProvider.propTypes = {
  /** @ignore */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

TextFieldProvider.defaultProps = {
  children: [],
}

export const useTextField = () => {
  // @ts-ignore
  const [state, setState] = useContext(TextFieldContext)

  const handleFocus = () => {
    setState({ ...state, isFocused: true })
  }
  const handleBlur = () => {
    setState({ ...state, isFocused: false })
  }

  return {
    handleFocus,
    handleBlur,
    isFocused: state.isFocused,
    isDisabled: state.isDisabled,
  }
}
