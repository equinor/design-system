/* eslint camelcase: "off" */
import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  checkbox,
  checkbox_outline, // eslint-disable-line camelcase
  checkbox_indeterminate, // eslint-disable-line camelcase
} from '@equinor/eds-icons'
import { checkbox as tokens } from './Checkbox.tokens'
import { typographyTemplate } from '../../_common/templates'
import { Icon } from '../..'

Icon.add({ checkbox, checkbox_outline, checkbox_indeterminate })
const { color, enabled } = tokens

const StyledCheckbox = styled.label`
  display: inline-flex;
  align-items: center;
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

const InputWrapper = styled.span`
  display: inline-flex;
  border-radius: 50%;
  padding: ${enabled.padding};
  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? 'transparent' : color.hover};
  }
`

const LabelText = styled.span`
  ${typographyTemplate(enabled.typography)}
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
      <LabelText>{label}</LabelText>
    </StyledCheckbox>
  )
})

Checkbox.displayName = 'eds-Checkbox'

Checkbox.propTypes = {
  /** Label for the checkbox */
  label: PropTypes.string.isRequired,
  /** If true, the checkbox will be disabled */
  disabled: PropTypes.bool,
  /** If true, the checkbox appears indeterminate. Important! You'll have to
   * set the native element to indeterminate yourself.
   */
  indeterminate: PropTypes.bool,
  /** Additional class names */
  className: PropTypes.string,
}

Checkbox.defaultProps = {
  disabled: false,
  indeterminate: false,
  className: undefined,
}
