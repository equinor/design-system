import * as React from 'react'
import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import * as tokens from './Divider.tokens'
import type { DividerToken } from './Divider.tokens'

const { divider } = tokens

type StyleProps = {
  backgroundColor: string
  marginTop: string
  marginBottom: string
  dividerHeight: string
}

const StyledDivider = styled.hr<StyleProps>`
  border: none;
  background-color: ${(props) => props.backgroundColor};
  margin-top: ${(props) => props.marginTop};
  margin-bottom: ${(props) => props.marginBottom};
  height: ${(props) => props.dividerHeight};
`

const getVariant = (variant: 'small' | 'medium'): DividerToken => {
  if (tokens[variant]) {
    return tokens[variant]
  }
}

const getColor = (color: 'lighter' | 'light' | 'medium'): string => {
  const colorValue = color === 'medium' ? 'mediumColor' : color
  if (divider.color[colorValue]) {
    return divider.color[colorValue]
  }
}

export type DividerProps = {
  /** Color variants */
  color?: 'lighter' | 'light' | 'medium'
  /** Vertical spacings */
  variant?: 'small' | 'medium'
  /** @ignore */
  className?: string
} & HTMLAttributes<HTMLHRElement>

export const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider(
  { color = 'medium', variant = 'medium', className = '' },
  ref,
) {
  const variantToken = getVariant(variant)
  const colorToken = getColor(color)

  const styleProps: StyleProps = {
    backgroundColor: colorToken,
    marginTop: variantToken.spacings.top,
    marginBottom: variantToken.spacings.bottom,
    dividerHeight: divider.height,
  }
  return <StyledDivider {...styleProps} className={className} ref={ref} />
})

// Divider.displayName = 'Divider'
