import React, { useState, useContext, ReactNode, MouseEvent } from 'react'

export type State = {
  focusedIndex: number
  isPositioned: boolean
  position: {
    top: number
    left: number
    transform: string
  }
  onClose: (e?: MouseEvent) => void
}

type UseMenu<T> = T & {
  setFocusedIndex: (index: number) => void
  setPosition: (
    anchorRect: ClientRect,
    menuRect: ClientRect,
    window: Window,
  ) => void
  setOnClose: (onClose: (e?: MouseEvent) => void) => void
}

const initalState: State = {
  focusedIndex: -1,
  isPositioned: false,
  position: {
    top: 0,
    left: 0,
    transform: null,
  },
  onClose: null,
}

const MenuContext = React.createContext<State>(initalState)

const calculateTransform = (
  bounding: ClientRect,
  anchor: ClientRect,
  window: Window,
  offset: number,
) => {
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

const calculatePosition = (
  { left, top, height }: ClientRect,
  offset: number,
) => ({
  top: top + height + offset,
  left: left,
})

type ProviderProps = { children: ReactNode }

export const MenuProvider = ({ children }: ProviderProps): JSX.Element => {
  const [state, setState] = useState<State>(initalState)

  const { focusedIndex, position, isPositioned, onClose } = state
  const offset = 2

  const setFocusedIndex: UseMenu<State>['setFocusedIndex'] = (i) => {
    setState({ ...state, focusedIndex: i })
  }

  const setPosition: UseMenu<State>['setPosition'] = (
    anchorRect,
    menuRect,
    window,
  ) => {
    setState({
      ...state,
      isPositioned: true,
      position: {
        ...state.position,
        ...calculatePosition(anchorRect, offset),
        transform: calculateTransform(menuRect, anchorRect, window, offset),
      },
    })
  }

  const setOnClose: UseMenu<State>['setOnClose'] = (onClose) => {
    setState({ ...state, onClose })
  }

  const value = {
    setFocusedIndex,
    focusedIndex,
    setPosition,
    position,
    isPositioned,
    setOnClose,
    onClose,
  }
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}
export const useMenu = (): UseMenu<State> =>
  useContext<State>(MenuContext) as UseMenu<State>
