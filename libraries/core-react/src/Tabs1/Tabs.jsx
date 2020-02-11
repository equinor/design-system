import React, { forwardRef, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useCombinedRefs } from '../_common/useCombinedRefs'
import { Tab } from './Tab'
import { tab as tokens } from './Tabs.tokens'

const StyledTabs = styled.div.attrs(() => ({
  role: 'tablist',
}))`
  display: grid;
  grid-auto-flow: column;
`

const Tabs = forwardRef(function Tabs({ value, onChange, ...props }, ref) {
  const currentTab = useRef(value)

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
    if (key === 'ArrowLeft') {
      changeTabs('left', lastFocusableChild)
    }
    if (key === 'ArrowRight') {
      changeTabs('right', firstFocusableChild)
    }
  }

  return (
    <StyledTabs onKeyDown={handleKeyPress} ref={ref} {...props}>
      {children}
    </StyledTabs>
  )
})

Tabs.propTypes = {
  onChange: PropTypes.func,
  variants: PropTypes.oneOf(['fullWidth', 'minWidth']),
}

Tabs.defaultProps = {
  onChange: () => {},
  variants: 'fullWidth',
}

Tabs.Tab = Tab
Tabs.tokens = tokens

export { Tabs }
