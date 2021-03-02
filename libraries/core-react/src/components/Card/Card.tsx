import * as React from 'react'
import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import * as tokens from './Card.tokens'
import { spacingsTemplate, bordersTemplate } from '@utils'

const { primary, info, warning, danger } = tokens

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
  position: relative;
  background-color: ${({ background }) => background};
  box-sizing: border-box;
  display: grid;
  grid-gap: 16px;
  grid-auto-columns: auto;
  align-items: center;
  align-content: start;
  cursor: ${({ cursor }) => cursor};
  ${bordersTemplate(primary.border)};
  ${spacingsTemplate(primary.spacings)}
`

type backgroundVariants = { variant: string; backgroundColor: string }[]

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className, variant = 'default', onClick, ...rest },
  ref,
) {
  const cursor = onClick ? 'pointer' : 'default'

  const cardVariant = variant === 'default' ? 'primary' : variant

  const token = tokens[cardVariant]

  const props = {
    ...rest,
    className,
    ref,
    background: token.background,
    cursor,
  }

  return (
    <StyledCard {...props} onClick={onClick}>
      {children}
    </StyledCard>
  )
})
