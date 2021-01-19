/* eslint camelcase: "off" */
import * as React from 'react'
import { forwardRef, Ref, InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import {
  checkbox,
  checkbox_outline, // eslint-disable-line camelcase
  checkbox_indeterminate, // eslint-disable-line camelcase
} from '@equinor/eds-icons'
import type { IconData } from '@equinor/eds-icons'
import { checkbox as tokens } from './Checkbox.tokens'
import { useEds } from '../../EdsProvider'

const { color, enabled } = tokens

type StyledIconPathProps = {
  icon: IconData
  name: string
}

const StyledPath = styled.path.attrs<StyledIconPathProps>(({ icon }) => ({
  fillRule: 'evenodd',
  clipRule: 'evenodd',
  d: icon.svgPathData,
}))<StyledIconPathProps>``

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

type StyledInputWrapperProps = {
  disabled: boolean
  density: 'comfortable' | 'compact'
}

const InputWrapper = styled.span<StyledInputWrapperProps>`
  ${({ density }) =>
    density === 'comfortable'
      ? css`
          padding: ${enabled.padding};
        `
      : ''}
  display: inline-flex;
  border-radius: 50%;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ disabled }) =>
        disabled ? 'transparent' : color.hover};
    }
  }
`
export type InputProps = {
  /** If true, the checkbox will be disabled */
  disabled?: boolean
  /** If true, the checkbox appears indeterminate. Important! You'll have to
   * set the native element to indeterminate yourself.
   */
  indeterminate?: boolean
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'disabled'> & {
    ref?: Ref<HTMLInputElement>
  }

export const CheckboxInput = forwardRef<HTMLInputElement, InputProps>(
  function CheckboxInput({ disabled = false, indeterminate, ...rest }, ref) {
    const iconSize = 24

    const { density } = useEds()
    return (
      <InputWrapper disabled={disabled} density={density}>
        <Input
          {...rest}
          ref={ref}
          disabled={disabled}
          data-indeterminate={indeterminate}
        />
        {indeterminate ? (
          <Svg
            width={iconSize}
            height={iconSize}
            viewBox={`0 0 ${iconSize} ${iconSize}`}
            fill={disabled ? color.disabled : color.primary}
            aria-hidden
          >
            <StyledPath icon={checkbox_indeterminate} name="indeterminate" />
          </Svg>
        ) : (
          <Svg
            width={iconSize}
            height={iconSize}
            viewBox={`0 0 ${iconSize} ${iconSize}`}
            fill={disabled ? color.disabled : color.primary}
            aria-hidden
          >
            <StyledPath icon={checkbox} name="checked" />
            <StyledPath icon={checkbox_outline} name="not-checked" />
          </Svg>
        )}
      </InputWrapper>
    )
  },
)
