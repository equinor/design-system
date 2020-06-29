import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

const initalState = {
  focusedIndex: -1,
  position: {
    top: 0,
    left: 0,
    transform: null,
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
  const { focusedIndex, position } = state

  const setFocusedIndex = (i) => {
    setState({ ...state, focusedIndex: i })
  }

  const setPosition = (positionEl) => {
    const { left, top, height } = positionEl

    setState({
      ...state,
      position: {
        ...state.position,
        top: top + height + 2,
        left: left,
      },
    })
  }

  const setTransform = (positionEl, window) => {
    const { innerHeight, innerWidth } = window
    const { right, bottom, width, height } = positionEl
    let transform = null
    if (right > innerWidth) {
      transform = `translateX(-${width}px)`
    }

    if (bottom > innerHeight) {
      transform = `translateY(-${height}px)`
    }

    setState({
      ...state,
      position: {
        ...state.position,
        transform,
      },
    })
  }

  return {
    setFocusedIndex,
    focusedIndex,
    setPosition,
    position,
    setTransform,
  }
}

export const useMenuSection = () => {}
