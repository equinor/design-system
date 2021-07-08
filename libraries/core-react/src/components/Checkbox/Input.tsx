/* eslint camelcase: "off" */
import { forwardRef, Ref, InputHTMLAttributes } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import {
  checkbox,
  checkbox_outline, // eslint-disable-line camelcase
  checkbox_indeterminate, // eslint-disable-line camelcase
} from '@equinor/eds-icons'
import type { IconData } from '@equinor/eds-icons'
import { checkbox as tokens } from './Checkbox.tokens'
import { spacingsTemplate, outlineTemplate } from '../../utils'
import { useToken } from '../../hooks'
import { useEds } from '../EdsProvider'

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
    ${({ theme }) => outlineTemplate(theme.states.focus.outline)}
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

type StyledInputWrapperProps = { disabled: boolean }

const InputWrapper = styled.span<StyledInputWrapperProps>`
  display: inline-flex;
  border-radius: 50%;
  ${({ theme }) => spacingsTemplate(theme.spacings)}
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ disabled }) =>
        disabled ? 'transparent' : tokens.states.hover.background};
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
    const { density } = useEds()
    const token = useToken({ density }, tokens)()

    const iconSize = 24
    const fill = disabled
      ? tokens.states.disabled.background
      : tokens.background

    const inputWrapperProps = {
      disabled,
    }

    const inputProps = {
      ref,
      disabled,
      ['data-indeterminate']: indeterminate,
      ...rest,
    }

    return (
      <ThemeProvider theme={token}>
        <InputWrapper {...inputWrapperProps}>
          <Input {...inputProps} />
          {indeterminate ? (
            <Svg
              width={iconSize}
              height={iconSize}
              viewBox={`0 0 ${iconSize} ${iconSize}`}
              fill={fill}
              aria-hidden
            >
              <StyledPath icon={checkbox_indeterminate} name="indeterminate" />
            </Svg>
          ) : (
            <Svg
              width={iconSize}
              height={iconSize}
              viewBox={`0 0 ${iconSize} ${iconSize}`}
              fill={fill}
              aria-hidden
            >
              <StyledPath icon={checkbox} name="checked" />
              <StyledPath icon={checkbox_outline} name="not-checked" />
            </Svg>
          )}
        </InputWrapper>
      </ThemeProvider>
    )
  },
)
