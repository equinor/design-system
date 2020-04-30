import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

const initalState = {
  focusedIndex: -1,
}

const DrawerContext = React.createContext(initalState)

export const DrawerProvider = ({ children }) => {
  const [state, setState] = useState(initalState)
  return (
    <DrawerContext.Provider value={[state, setState]}>
      {children}
    </DrawerContext.Provider>
  )
}

DrawerProvider.propTypes = {
  /** @ignore */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

DrawerProvider.defaultProps = {}

export const useDrawer = () => {
  const [state, setState] = useContext(DrawerContext)
  const { focusedIndex } = state

  const setFocusedIndex = (i) => {
    setState({ ...state, focusedIndex: i })
  }

  return {
    setFocusedIndex,
    focusedIndex,
  }
}
