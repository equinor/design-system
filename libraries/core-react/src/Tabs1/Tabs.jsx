import React, { forwardRef, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useKeyPress } from '../_common/useKeyPress'
import { Tab } from './Tab'
import { tab as tokens } from './Tabs.tokens'

/*
  TODO:
  Merge refs
  Home
  End
*/

const StyledTabs = styled.div.attrs(() => ({
  role: 'tablist',
}))`
  display: grid;
  grid-auto-flow: column;
`

const Tabs = forwardRef(function Tabs({ value, ...props }, ref) {
  const nextTab = useRef(value)

  const selectedTabRef = useCallback((node) => {
    if (node !== null) {
      node.focus()
    }
  }, [])

  const children = React.Children.map(props.children, (child, index) =>
    React.cloneElement(child, {
      index,
      active: index === value,
      onClick: () => props.onChange(index),
      ref: index === value ? selectedTabRef : undefined,
    }),
  )

  const focusableChildren = children
    .filter((child) => !child.props.disabled)
    .map((child) => child.props.index)

  useKeyPress('ArrowLeft', () => {
    const next =
      focusableChildren[focusableChildren.indexOf(nextTab.current) - 1]
    props.onChange(
      next === undefined
        ? focusableChildren[focusableChildren.length - 1]
        : next,
    )
  })

  useKeyPress('ArrowRight', () => {
    const next =
      focusableChildren[focusableChildren.indexOf(nextTab.current) + 1]
    props.onChange(next === undefined ? focusableChildren[0] : next)
  })

  useEffect(() => {
    nextTab.current = value
  }, [value])

  return (
    <StyledTabs ref={ref} {...props}>
      {children}
    </StyledTabs>
  )
})

Tabs.propTypes = {
  variants: PropTypes.oneOf(['fullWidth', 'minWidth']),
}

Tabs.defaultProps = {
  variants: 'fullWidth',
}

Tabs.Tab = Tab
Tabs.tokens = tokens

export { Tabs }
