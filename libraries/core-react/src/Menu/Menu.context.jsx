import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

const initalState = {
  focusedIndex: -1,
  visibility: 'hidden',
  position: {
    top: 0,
    left: 0,
    transform: null,
  },
  anchor: {
    height: 0,
    width: 0,
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
  const { focusedIndex, position, visibility } = state
  const offset = 2
  const setFocusedIndex = (i) => {
    setState({ ...state, focusedIndex: i })
  }

  const setPosition = (bounding) => {
    const { left, top, height, width } = bounding

    setState({
      ...state,
      position: {
        ...state.position,
        top: top + height + offset,
        left: left,
      },
      anchor: {
        height,
        width,
      },
    })
  }

  const setTransform = (bounding, window) => {
    const { innerHeight, innerWidth } = window
    const { right, bottom, width, height } = bounding

    let transform = ''
    if (right > innerWidth) {
      transform += `translateX(-${width - state.anchor.width}px)`
    }

    if (bottom > innerHeight) {
      transform += `translateY(-${height + state.anchor.height + offset}px)`
    }

    setState({
      ...state,
      visibility: 'visible',
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
    visibility,
  }
}

export const useMenuSection = () => {}
