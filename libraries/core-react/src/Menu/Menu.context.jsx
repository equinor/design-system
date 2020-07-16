import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

const initalState = {
  focusedIndex: -1,
  isPositioned: false,
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

const calculateTransform = (bounding, anchor, window, offset) => {
  const { innerHeight, innerWidth } = window
  const right = anchor.left + bounding.width
  const bottom = anchor.top + bounding.height
  let transform = ''
  if (right > innerWidth) {
    transform += `translateX(-${bounding.width - anchor.width}px)`
  }

  if (bottom > innerHeight) {
    transform += `translateY(-${bounding.height + anchor.height + offset}px)`
  }
  return transform
}

const calculatePosition = ({ left, top, height }, offset) => ({
  top: top + height + offset,
  left: left,
})

export const useMenu = () => {
  const [state, setState] = useContext(MenuContext)
  const { focusedIndex, position, isPositioned } = state
  const offset = 2

  const setFocusedIndex = (i) => {
    setState({ ...state, focusedIndex: i })
  }

  const setPosition = (anchor, menu, window) => {
    setState({
      ...state,
      isPositioned: true,
      position: {
        ...state.position,
        ...calculatePosition(anchor, offset),
        transform: calculateTransform(menu, anchor, window, offset),
      },
    })
  }

  return {
    setFocusedIndex,
    focusedIndex,
    setPosition,
    position,
    isPositioned,
  }
}

export const useMenuSection = () => {}
