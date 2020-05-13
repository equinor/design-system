import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  checkbox,
  checkbox_outline, // eslint-disable-line camelcase
  checkbox_indeterminate, // eslint-disable-line camelcase
} from '@equinor/eds-icons'
import { checkbox as tokens } from './Checkbox.tokens'

import { Icon } from '../..'

Icon.add({ checkbox, checkbox_outline, checkbox_indeterminate })
const { color, enabled } = tokens

const StyledCheckbox = styled.label`
  display: inline-flex;
  align-items: center;
  /* padding: 16px */
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

const StyledPath = styled.path.attrs(({ icon }) => ({
  fillRule: 'evenodd',
  clipRule: 'evenodd',
  d: icon.svgPathData,
}))``

const Input = styled.input.attrs(({ type = 'checkbox' }) => ({
  type,
}))`
  /* Visually hide the original radio input*/
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  &:focus {
    outline: none;
  }
  &[data-focus-visible-added]:focus + svg {
    outline: ${enabled.outline};
    outline-offset: ${enabled.outlineOffset};
  }
  &:not(:checked) ~ svg path[name='checked'] {
    display: none;
  }
  &:not(:checked) ~ svg path[name='not-checked'] {
    display: inline;
  }
  &:checked ~ svg path[name='not-checked'] {
    display: none;
  }
  &:checked ~ svg path[name='checked'] {
    display: inline;
  }
`

const Svg = styled.svg.attrs(({ height, width, fill }) => ({
  name: null,
  xmlns: 'http://www.w3.org/2000/svg',
  height,
  width,
  fill,
}))``

// @TODO: klikk bounds fra token
const InputWrapper = styled.span`
  display: inline-flex;
  border-radius: 50%;
  padding: 12px;
  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? 'transparent' : color.hover};
  }
`

export const Checkbox = forwardRef((props, ref) => {
  const { label, disabled, indeterminate, className, ...rest } = props

  const iconSize = 24
  return (
    <StyledCheckbox disabled={disabled} className={className}>
      <InputWrapper disabled={disabled}>
        <Input
          {...rest}
          ref={ref}
          disabled={disabled}
          data-indeterminate={indeterminate}
        />
        {indeterminate ? (
          <Icon
            name="checkbox_indeterminate"
            size={24}
            color={disabled ? color.disabled : color.primary}
            aria-hidden
          />
        ) : (
          <Svg
            width={iconSize}
            height={iconSize}
            viewBox={`0 0 ${iconSize} ${iconSize}`}
            fill={disabled ? color.disabled : color.primary}
          >
            <StyledPath icon={checkbox} name="checked" />
            <StyledPath icon={checkbox_outline} name="not-checked" />
          </Svg>
        )}
      </InputWrapper>
      <span>{label}</span>
    </StyledCheckbox>
  )
})

Checkbox.displayName = 'eds-Checkbox'

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  // If true, the checkbox will be disabled
  disabled: PropTypes.bool,
  indeterminate: PropTypes.bool,
  className: PropTypes.string,
}

Checkbox.defaultProps = {
  disabled: false,
  indeterminate: false,
}
