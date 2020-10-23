import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { divider as tokens } from './Divider.tokens'

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

export type DividerProps = {
  /** Color variants */
  color?: 'lighter' | 'light' | 'medium'
  /** Vertical spacings */
  variant?: 'small' | 'medium'
  /** @ignore */
  className?: string
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider(
  { color = 'medium', variant = 'medium', className = '' },
  ref,
) {
  const styleProps = {
    backgroundColor: tokens.color[color],
    marginTop: tokens[variant].spacings.top,
    marginBottom: tokens[variant].spacings.bottom,
    dividerHeight: tokens.height,
  }
  return <StyledDivider {...styleProps} className={className} ref={ref} />
})

// Divider.displayName = 'Divider'
