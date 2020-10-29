/* eslint camelcase: "off" */
import React, { forwardRef, Ref } from 'react'
import styled from 'styled-components'
import {
  radio_button_selected, // eslint-disable-line camelcase
  radio_button_unselected, // eslint-disable-line camelcase
} from '@equinor/eds-icons'
import type { IconData } from '@equinor/eds-icons'
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
type StyledRadioProps = Pick<RadioProps, 'disabled'>

const StyledRadio = styled.label<StyledRadioProps>`
  display: inline-flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

type StyledIconPathProps = {
  icon: IconData
  name: string
}

const StyledPath = styled.path.attrs<StyledIconPathProps>(({ icon }) => ({
  fillRule: 'evenodd',
  clipRule: 'evenodd',
  d: icon.svgPathData,
}))<StyledIconPathProps>``

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

type StyledInputWrapperProps = { disabled: boolean }

const InputWrapper = styled.span<StyledInputWrapperProps>`
  display: inline-flex;
  border-radius: 50%;
  padding: ${enabled.padding};
  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? 'transparent' : color.hover};
  }
`
export type RadioProps = {
  /** Label for the radio */
  label: string
  /** If true, the radio button will be disabled */
  disabled?: boolean
} & JSX.IntrinsicElements['input'] & {
    ref?: Ref<HTMLInputElement>
  }

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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

Radio.displayName = 'Radio'
