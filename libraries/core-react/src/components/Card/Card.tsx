import * as React from 'react'
import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { card as tokens } from './Card.tokens'
import { spacingsTemplate } from '@utils'

const { spacings, shape, backgroundVariants } = tokens

type StyledCardProps = {
  background: string
  cursor: string
} & HTMLAttributes<HTMLDivElement>

export type CardProps = {
  /** Variant */
  variant?: 'default' | 'info' | 'warning' | 'danger'
} & HTMLAttributes<HTMLDivElement>

const StyledCard = styled.div<StyledCardProps>`
  height: fit-content;
  width: 100%;
  min-width: ${shape.minWidth};
  position: relative;
  background-color: ${({ background }) => background};
  box-sizing: border-box;
  display: grid;
  grid-gap: 16px;
  grid-auto-columns: auto;
  align-items: center;
  align-content: start;
  border-radius: ${shape.borderRadius};
  min-height: ${shape.minHeight};
  cursor: ${({ cursor }) => cursor};

  ${spacingsTemplate(spacings)}
`

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className, variant = 'default', onClick, ...rest },
  ref,
) {
  const cursor = onClick ? 'pointer' : 'default'

  const props = {
    ...rest,
    className,
    ref,
    background: backgroundVariants[variant],
    cursor,
  }

  return (
    <StyledCard {...props} onClick={onClick}>
      {children}
    </StyledCard>
  )
})

// Card.displayName = 'eds-card'
