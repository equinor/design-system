import React, { forwardRef } from 'react'
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
      outlineOffset,
    },
  },
} = tokens

const focusedStyles = css`
  z-index: 1;
  outline: ${outlineWidth} ${outlineStyle} ${outlineColor};
  outline-offset: ${outlineOffset};
`

const StyledTab = styled.button.attrs(({ active, disabled }) => ({
  type: 'button',
  role: 'tab',
  'aria-selected': active,
  'aria-disabled': disabled,
  tabIndex: active ? '0' : '-1',
}))`
  appearance: none;
  box-sizing: border-box;
  font-family: inherit;
  border: none;
  outline: none;
  font-size: 1rem;
  height: ${height};
  padding-left: ${paddingLeft};
  padding-right: ${paddingRight};
  color: ${({ active }) => (active ? activated.color : enabled.color)};
  background-color: ${enabled.backgroundColor};
  position: relative;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;

  &[data-focus] {
    ${focusedStyles}
  }
  &[data-focus-visible-added]:focus {
    ${focusedStyles}
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
  /** If `true`, the tab will be active. */
  active: PropTypes.bool,
  /** If `true`, the tab will be disabled. */
  disabled: PropTypes.bool,
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
}

Tab.defaultProps = {
  active: false,
  disabled: false,
  className: null,
}
