import React, { forwardRef, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TabsContext } from './Tabs.context'
import { tab as tokens } from './Tabs.tokens'

const {
  clickbound,
  spacing: { left: paddingLeft, right: paddingRight },
  states: {
    enabled,
    disabled: { disabledHover, ...disabled },
    hover: { backgroundColor: hoverBackgroundColor },
    focused,
    activated: {
      hover: { color: activatedHoverColor },
      activatedPressed,
      ...activated
    },
  },
} = tokens

const StyledTab = styled.button(({ active }) => ({
  ...enabled,
  color: active ? activated.color : enabled.color,
  appearance: 'none',
  paddingLeft,
  paddingRight,
  '&:hover': {
    backgroundColor: hoverBackgroundColor,
    color: active ? activatedHoverColor : enabled.color,
  },
}))

export const Tab = forwardRef(function Tab(props, ref) {
  const { changeHandler } = useContext(TabsContext)

  return (
    <StyledTab
      onClick={(event) => changeHandler(event, props.index)}
      ref={ref}
      {...props}
    />
  )
})

Tab.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
}

Tab.defaultProps = {
  active: false,
  disabled: false,
}
