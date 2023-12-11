/* eslint camelcase: "off" */
import { forwardRef, InputHTMLAttributes } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import {
  checkbox,
  checkbox_outline, // eslint-disable-line camelcase
  checkbox_indeterminate, // eslint-disable-line camelcase
} from '@equinor/eds-icons'
import type { IconData } from '@equinor/eds-icons'
import { checkbox as tokens } from './Checkbox.tokens'
import { spacingsTemplate, outlineTemplate, useToken } from '@equinor/eds-utils'
import { useEds } from '../EdsProvider'

type StyledIconPathProps = {
  $icon: IconData
  name: string
}

const StyledPath = styled.path.attrs<StyledIconPathProps>(({ $icon }) => ({
  fillRule: 'evenodd',
  clipRule: 'evenodd',
  d: $icon.svgPathData as string,
}))<StyledIconPathProps>``

type StyledInputProps = {
  $iconSize: number
}

const Input = styled.input.attrs<StyledInputProps>(({ type = 'checkbox' }) => ({
  type,
}))<StyledInputProps>`
  --scale: ${({ theme, $iconSize }) =>
    parseFloat(theme.clickbound.height) / $iconSize};
  appearance: none;
  width: 100%;
  height: 100%;
  margin: 0;
  grid-area: input;
  transform: scale(var(--scale));
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  &:focus {
    outline: none;
  }
  &[data-focus-visible-added]:focus + svg {
    ${({ theme }) => outlineTemplate(theme.states.focus.outline)}
  }
  &:focus-visible + svg {
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
}))`
  grid-area: input;
  pointer-events: none;
`

type StyledInputWrapperProps = { disabled: boolean }

const InputWrapper = styled.span<StyledInputWrapperProps>`
  display: inline-grid;
  grid: [input] 1fr / [input] 1fr;
  position: relative;
  isolation: isolate;
  ${({ theme }) => spacingsTemplate(theme.spacings)}
  &::before {
    content: '';
    position: absolute;
    width: ${({ theme }) => theme.width};
    aspect-ratio: 1/1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 100%;
  }
  @media (hover: hover) and (pointer: fine) {
    > svg {
      z-index: 1;
    }
    &:hover {
      &::before {
        background-color: ${({ disabled }) =>
          disabled ? 'transparent' : tokens.states.hover.background};
      }
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
} & InputHTMLAttributes<HTMLInputElement>

export const CheckboxInput = forwardRef<HTMLInputElement, InputProps>(
  function CheckboxInput(
    { disabled = false, indeterminate, style, className, ...rest },
    ref,
  ) {
    const { density } = useEds()
    const token = useToken({ density }, tokens)

    const iconSize = 24
    const fill = disabled
      ? tokens.states.disabled.background
      : tokens.background

    const inputWrapperProps = {
      disabled,
      style,
      className,
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
          <Input $iconSize={iconSize} {...inputProps} />
          {indeterminate ? (
            <Svg
              width={iconSize}
              height={iconSize}
              viewBox={`0 0 ${iconSize} ${iconSize}`}
              fill={fill}
              aria-hidden
            >
              <StyledPath $icon={checkbox_indeterminate} name="indeterminate" />
            </Svg>
          ) : (
            <Svg
              width={iconSize}
              height={iconSize}
              viewBox={`0 0 ${iconSize} ${iconSize}`}
              fill={fill}
              aria-hidden
            >
              <StyledPath $icon={checkbox} name="checked" />
              <StyledPath $icon={checkbox_outline} name="not-checked" />
            </Svg>
          )}
        </InputWrapper>
      </ThemeProvider>
    )
  },
)
