import React, { ReactNode, HTMLAttributes } from 'react'
import styled, { CSSObject } from 'styled-components'

type StackProps = {
  direction?: CSSObject['flexDirection']
  align?: CSSObject['alignItems']
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

type StyledStackProps = {
  $direction?: CSSObject['flexDirection']
  $align?: CSSObject['alignItems']
}

const StyledStack = styled.div<StyledStackProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${({ $align }) => $align || 'center'};
  gap: 1rem;
  flex-wrap: wrap;
  @media screen and (min-width: 600px) {
    flex-direction: ${({ $direction }) => $direction || 'row'};
  }
`

export const Stack = ({ children, direction, align, ...rest }: StackProps) => {
  return (
    <StyledStack $direction={direction} $align={align} {...rest}>
      {children}
    </StyledStack>
  )
}
