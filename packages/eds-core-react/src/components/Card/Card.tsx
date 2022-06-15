import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { Paper } from '../Paper'
import type { Elevations } from '@equinor/eds-tokens'
import * as tokens from './Card.tokens'
import { bordersTemplate } from '@equinor/eds-utils'

const { primary } = tokens

type allowedElevations = keyof Pick<Elevations, 'none' | 'raised' | 'overlay'>

type StyledCardProps = {
  background: string
  cursor: string
} & HTMLAttributes<HTMLDivElement>

export type CardProps = {
  /** Variant */
  variant?: 'default' | 'info' | 'warning' | 'danger'
  /** Elevation */
  elevation?: allowedElevations
} & HTMLAttributes<HTMLDivElement>

const StyledCard = styled(Paper)<StyledCardProps>`
  width: 100%;
  position: relative;
  background-color: ${({ background }) => background};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  grid-gap: 16px;
  cursor: ${({ cursor }) => cursor};
  ${bordersTemplate(primary.border)};
`

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, variant = 'default', elevation = 'none', onClick, ...rest },
  ref,
) {
  const cursor = onClick ? 'pointer' : 'default'

  const cardVariant = variant === 'default' ? 'primary' : variant

  const token = tokens[cardVariant]

  const props = {
    ref,
    background: token.background,
    cursor,
    ...rest,
  }

  return (
    <StyledCard elevation={elevation} {...props} onClick={onClick}>
      {children}
    </StyledCard>
  )
})
