import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

const initalState = {
  focusedIndex: -1,
  open: false,
}

const MenuContext = React.createContext(initalState)

export const MenuProvider = ({ children }) => {
  const [state, setState] = useState(initalState)
  return (
    <MenuContext.Provider value={[state, setState]}>
      {children}
    </MenuContext.Provider>
  )
}

MenuProvider.propTypes = {
  /** @ignore */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

MenuProvider.defaultProps = {}

export const useMenu = () => {
  const [state, setState] = useContext(MenuContext)
  const { focusedIndex } = state

  const setFocusedIndex = (i) => {
    setState({ ...state, focusedIndex: i })
  }

  return {
    setFocusedIndex,
    focusedIndex,
  }
}

export const useMenuSection = () => {}
