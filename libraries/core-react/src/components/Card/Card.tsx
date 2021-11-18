import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import * as tokens from './Card.tokens'
import { spacingsTemplate, bordersTemplate } from '../../utils'

const { primary } = tokens

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
  /* MARTA */
  grid-template-columns: ${primary.spacings.left} auto ${primary.spacings.right};
  grid-template-rows: ${primary.spacings.top} auto ${primary.spacings.bottom};
  grid-template-areas:
    'xxx xxx xxx'
    'zzz yyy aaa'
    'qqq qqq qqq';
  /* 'text text text'
    'actions actions actions'; */
  /* MARTA */
  cursor: ${({ cursor }) => cursor};
  ${bordersTemplate(primary.border)};
  /* ${spacingsTemplate(primary.spacings)} */
`

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, variant = 'default', onClick, ...rest },
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
    <StyledCard {...props} onClick={onClick}>
      {children}
    </StyledCard>
  )
})
