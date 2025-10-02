/* eslint camelcase: "off" */
import { forwardRef, InputHTMLAttributes, useMemo, type JSX } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import {
  radio_button_selected, // eslint-disable-line camelcase
  radio_button_unselected, // eslint-disable-line camelcase
} from '@equinor/eds-icons'
import type { IconData } from '@equinor/eds-icons'
import { comfortable as tokens } from './Radio.tokens'
import {
  useToken,
  typographyTemplate,
  spacingsTemplate,
  outlineTemplate,
} from '@equinor/eds-utils'
import { useEds } from '../EdsProvider'

type StyledInputProps = {
  $iconSize: number
}

const Input = styled.input.attrs<StyledInputProps>(({ type = 'radio' }) => ({
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
type StyledRadioProps = { $disabled: boolean }

const StyledLabel = styled.label<StyledRadioProps>`
  display: inline-flex;
  align-items: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`

type StyledIconPathProps = {
  $icon: IconData
  name: string
}

const StyledPath = styled.path.attrs<StyledIconPathProps>(({ $icon }) => ({
  fillRule: 'evenodd',
  clipRule: 'evenodd',
  d: $icon.svgPathData as string,
}))<StyledIconPathProps>``

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

const LabelText = styled.span`
  ${typographyTemplate(tokens.typography)}
`

type StyledInputWrapperProps = { disabled: boolean }

const InputWrapper = styled.span<StyledInputWrapperProps>`
  ${({ theme }) => spacingsTemplate(theme.spacings)}
  display: inline-grid;
  grid: [input] 1fr / [input] 1fr;
  position: relative;
  isolation: isolate;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
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
export type RadioProps = {
  /** Label for the radio */
  label?: string
  /** If true, the radio button will be disabled */
  disabled?: boolean
} & InputHTMLAttributes<HTMLInputElement>

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, disabled = false, className, style, ...rest },
  ref,
) {
  const { density } = useEds()
  const token = useToken({ density }, tokens)

  const iconSize = 24
  const fill = disabled ? tokens.states.disabled.background : tokens.background

  const renderSVG = useMemo<JSX.Element>(() => {
    return (
      <Svg
        width={iconSize}
        height={iconSize}
        viewBox={`0 0 ${iconSize} ${iconSize}`}
        fill={fill}
        aria-hidden
      >
        <StyledPath $icon={radio_button_selected} name="selected" />
        <StyledPath $icon={radio_button_unselected} name="unselected" />
      </Svg>
    )
  }, [fill])

  return (
    <ThemeProvider theme={token}>
      {label ? (
        <StyledLabel $disabled={disabled} className={className} style={style}>
          <InputWrapper disabled={disabled}>
            <Input
              {...rest}
              ref={ref}
              disabled={disabled}
              $iconSize={iconSize}
            />
            {renderSVG}
          </InputWrapper>
          <LabelText>{label}</LabelText>
        </StyledLabel>
      ) : (
        <InputWrapper disabled={disabled} className={className} style={style}>
          <Input {...rest} ref={ref} disabled={disabled} $iconSize={iconSize} />
          {renderSVG}
        </InputWrapper>
      )}
    </ThemeProvider>
  )
})

Radio.displayName = 'Radio'
