import React, {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useCombinedRefs } from '../_common/useCombinedRefs'

const variants = {
  fullWidth: 'minmax(1%, 360px)',
  minWidth: 'max-content',
}

const StyledTabs = styled.div.attrs(() => ({
  role: 'tablist',
}))`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: ${({ variant }) => variants[variant]};
`

const Tabs = forwardRef(function Tabs({ value, onChange, ...props }, ref) {
  const currentTab = useRef(value)
  const [focusVisible, setFocusVisible] = useState(false)

  const selectedTabRef = useCallback((node) => {
    if (node !== null) {
      node.focus()
    }
  }, [])

  useEffect(() => {
    currentTab.current = value
  }, [value])

  const children = React.Children.map(props.children, (child, index) => {
    const tabRef =
      index === value ? useCombinedRefs(child.ref, selectedTabRef) : child.ref

    return React.cloneElement(child, {
      index,
      active: index === value,
      onClick: () => onChange(index),
      ref: tabRef,
      focusVisible,
    })
  })

  const focusableChildren = children
    .filter((child) => !child.props.disabled)
    .map((child) => child.props.index)

  const firstFocusableChild = focusableChildren[0]
  const lastFocusableChild = focusableChildren[focusableChildren.length - 1]

  const changeTabs = (direction, fallbackTab) => {
    const i = direction === 'left' ? 1 : -1
    const nextTab =
      focusableChildren[focusableChildren.indexOf(currentTab.current) - i]
    onChange(nextTab === undefined ? fallbackTab : nextTab)
  }

  const handleKeyPress = (event) => {
    const { key } = event
    setFocusVisible(true)
    if (key === 'ArrowLeft') {
      changeTabs('left', lastFocusableChild)
    }
    if (key === 'ArrowRight') {
      changeTabs('right', firstFocusableChild)
    }
  }

  const handleMouseDown = () => {
    setFocusVisible(false)
  }

  return (
    <StyledTabs
      onKeyDown={handleKeyPress}
      onMouseDown={handleMouseDown}
      ref={ref}
      {...props}
    >
      {children}
    </StyledTabs>
  )
})

Tabs.propTypes = {
  /** The index of the active tab */
  value: PropTypes.number,
  /** The callback function for selecting a tab */
  onChange: PropTypes.func,
  /** Sets the width of the tabs */
  variant: PropTypes.oneOf(['fullWidth', 'minWidth']),
  /** @ignore */
  children: PropTypes.node.isRequired,
}

Tabs.defaultProps = {
  value: 0,
  onChange: () => {},
  variant: 'minWidth',
}

export { Tabs }
