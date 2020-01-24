import React, { forwardRef, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useKeyPress } from '../_common/useKeyPress'
import { Tab } from './Tab'

const StyledTabs = styled.div.attrs((props) => ({
  role: 'tablist',
}))`
  display: grid;
  grid-auto-flow: column;
`

const Tabs = forwardRef(function Tabs(props, ref) {
  useKeyPress('ArrowLeft', () => {
    console.log('arrow left pressed')
  })
  useKeyPress('ArrowRight', () => {
    console.log('arrow right pressed')
  })

  const children = React.Children.map(props.children, (child, index) =>
    React.cloneElement(child, {
      index,
      active: index === props.value,
      onClick: (event) => props.onChange(event, index),
    }),
  )

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

export { Tabs }
