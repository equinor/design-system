import React, { forwardRef, useContext } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { tab as tokens } from './Tabs.tokens'

const {
  clickbound: height,
  spacing: { left: paddingLeft, right: paddingRight },
  states: {
    enabled: { border, ...enabled },
    hover,
    disabled: _disabled,
    activated,
    focused: {
      outline: {
        width: outlineWidth,
        style: outlineStyle,
        color: outlineColor,
      },
    },
  },
} = tokens

const StyledTab = styled.button.attrs(({ active, disabled }) => ({
  type: 'button',
  role: 'tab',
  'aria-selected': active,
  'aria-disabled': disabled,
  tabIndex: active ? '0' : '-1',
}))`
  appearance: none;
  box-sizing: border-box;
  border: none;
  outline: none;
  height: ${height};
  padding-left: ${paddingLeft};
  padding-right: ${paddingRight};
  color: ${({ active }) => (active ? activated.color : enabled.color)};
  background-color: ${enabled.backgroundColor};
  position: relative;

  &[data-focus],
  &:focus {
    outline: ${outlineWidth} ${outlineStyle} ${outlineColor};
    z-index: 1;
  }

  &[data-hover],
  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? _disabled.hover.backgroundColor : hover.backgroundColor};
    color: ${({ active }) => (active ? activated.hover.color : enabled.color)};
    cursor: ${({ disabled }) =>
      disabled ? _disabled.hover.cursor : 'pointer'};
  }

  &::after {
    content: '';
    height: ${({ disabled }) => (disabled ? '0' : border.width.bottom)};
    background-color: ${({ active }) =>
      active ? activated.border.color : border.color};
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }
`

export const Tab = forwardRef(function Tab(props, ref) {
  return <StyledTab ref={ref} {...props} />
})

Tab.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
}

Tab.defaultProps = {
  active: false,
  disabled: false,
}
