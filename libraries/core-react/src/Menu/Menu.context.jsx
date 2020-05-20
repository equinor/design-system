import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

const initalState = {
  focusedIndex: -1,
  subMenu: {
    index: undefined,
    left: undefined,
    top: undefined,
  },
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
  const { focusedIndex, subMenu } = state

  const setFocusedIndex = (i) => {
    setState({ ...state, focusedIndex: i })
  }

  const setSubMenu = (target, index) => {
    const rect = target.getBoundingClientRect()
    const offset = rect ? rect.width + 8 : 0
    setState({
      ...state,
      subMenu: {
        index,
        left: index > -1 ? offset : undefined,
        top: 0,
      },
    })
  }

  return {
    setFocusedIndex,
    focusedIndex,
    setSubMenu,
    subMenu,
  }
}

export const useMenuSection = () => {}
