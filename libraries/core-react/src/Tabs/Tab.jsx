import React, { forwardRef, useContext } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { TabsContext } from './Tabs.context'
import { tab as tokens } from './Tabs.tokens'

const {
  clickbound: height,
  spacing: { left: paddingLeft, right: paddingRight },
  states: {
    enabled,
    disabled: { hover: disabledHover, ...disabled },
    hover,
    focused: {
      outline: {
        width: outlineWidth,
        style: outlineStyle,
        color: outlineColor,
      },
    },
    activated: { hover: activatedHover, ...activated },
  },
} = tokens

const enabledStyles = {
  ...enabled,
  paddingLeft,
  paddingRight,
  height,
  '&:hover': {
    ...hover,
  },
}

const activeStyles = {
  ...activated,
  '&:hover': {
    ...activatedHover,
  },
}

const disabledStyles = {
  ...disabled,
  '&:hover': {
    ...disabledHover,
  },
}

const focusStyles = {
  outlineWidth,
  outlineStyle,
  outlineColor,
}

const StyledTab = styled.button`
  appearance: none;
  ${() => enabledStyles}
  ${(props) => props.active && activeStyles}
  ${(props) => props.disabled && disabledStyles}
  &:focus {
    ${() => focusStyles}
  }
`

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
