/* eslint camelcase: "off" */
import { forwardRef, Ref, InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import {
  radio_button_selected, // eslint-disable-line camelcase
  radio_button_unselected, // eslint-disable-line camelcase
} from '@equinor/eds-icons'
import type { IconData } from '@equinor/eds-icons'
import { comfortable as tokens } from './Radio.tokens'
import {
  typographyTemplate,
  spacingsTemplate,
  outlineTemplate,
} from '../../utils'

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
    ${outlineTemplate(tokens.states.focus.outline)}
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
  ${typographyTemplate(tokens.typography)}
`

type StyledInputWrapperProps = { disabled: boolean }

const InputWrapper = styled.span<StyledInputWrapperProps>`
  ${spacingsTemplate(tokens.spacings)}
  display: inline-flex;
  border-radius: 50%;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ disabled }) =>
        disabled ? 'transparent' : tokens.states.hover.background};
    }
  }
`
export type RadioProps = {
  /** Label for the radio */
  label: string
  /** If true, the radio button will be disabled */
  disabled?: boolean
} & InputHTMLAttributes<HTMLInputElement> & {
    ref?: Ref<HTMLInputElement>
  }

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, disabled = false, className, ...rest },
  ref,
) {
  const iconSize = 24
  const fill = disabled ? tokens.states.disabled.background : tokens.background
  return (
    <StyledRadio disabled={disabled} className={className}>
      <InputWrapper disabled={disabled}>
        <Input {...rest} ref={ref} disabled={disabled} />
        <Svg
          width={iconSize}
          height={iconSize}
          viewBox={`0 0 ${iconSize} ${iconSize}`}
          fill={fill}
          aria-hidden
        >
          <StyledPath icon={radio_button_selected} name="selected" />
          <StyledPath icon={radio_button_unselected} name="unselected" />
        </Svg>
      </InputWrapper>
      <LabelText>{label}</LabelText>
    </StyledRadio>
  )
})

Radio.displayName = 'Radio'
