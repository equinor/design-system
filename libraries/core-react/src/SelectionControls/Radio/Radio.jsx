/* eslint camelcase: "off" */
// @ts-nocheck
import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  radio_button_selected, // eslint-disable-line camelcase
  radio_button_unselected, // eslint-disable-line camelcase
} from '@equinor/eds-icons'
import { radio as tokens } from './Radio.tokens'
import { typographyTemplate } from '../../_common/templates'

const { color, enabled } = tokens

const Input = styled.input.attrs(({ type = 'radio' }) => ({
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

  &:not(:checked) ~ svg path[name='selected'] {
    display: none;
  }
  &:not(:checked) ~ svg path[name='unselected'] {
    display: inline;
  }
  &:checked ~ svg path[name='unselected'] {
    display: none;
  }
  &:checked ~ svg path[name='selected'] {
    display: inline;
  }
`

const StyledRadio = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

const StyledPath = styled.path.attrs(({ icon }) => ({
  fillRule: 'evenodd',
  clipRule: 'evenodd',
  d: icon.svgPathData,
}))``

const Svg = styled.svg.attrs(({ height, width, fill }) => ({
  name: null,
  xmlns: 'http://www.w3.org/2000/svg',
  height,
  width,
  fill,
}))``

const LabelText = styled.span`
  ${typographyTemplate(enabled.typography)}
`

const InputWrapper = styled.span`
  display: inline-flex;
  border-radius: 50%;
  padding: ${enabled.padding};
  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? 'transparent' : color.hover};
  }
`

export const Radio = forwardRef(
  ({ label, disabled = false, className, ...rest }, ref) => {
    const iconSize = 24
    return (
      <StyledRadio disabled={disabled} className={className}>
        <InputWrapper disabled={disabled}>
          <Input {...rest} ref={ref} disabled={disabled} />
          <Svg
            width={iconSize}
            height={iconSize}
            viewBox={`0 0 ${iconSize} ${iconSize}`}
            fill={disabled ? color.disabled : color.primary}
            aria-hidden
          >
            <StyledPath icon={radio_button_selected} name="selected" />
            <StyledPath icon={radio_button_unselected} name="unselected" />
          </Svg>
        </InputWrapper>
        <LabelText>{label}</LabelText>
      </StyledRadio>
    )
  },
)

Radio.displayName = 'eds-radio'

Radio.propTypes = {
  /** Label for the radio */
  label: PropTypes.string.isRequired,
  /** If true, the radio button will be disabled */
  disabled: PropTypes.bool,
  /** Additional class names */
  className: PropTypes.string,
}

Radio.defaultProps = {
  disabled: false,
  className: undefined,
}
