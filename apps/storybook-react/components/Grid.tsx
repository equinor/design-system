import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'

const StyledGrid = styled.div<Props>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  row-gap: 1rem;
  column-gap: 1rem;
  padding: 2rem;
  @media (min-width: 1000px) {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    column-gap: 4rem;
    row-gap: 3rem;
  }
  ${({ centerContent }) =>
    centerContent &&
    `
    & > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 1rem;
    }
  `}
`

type Props = {
  centerContent: boolean
} & HTMLAttributes<HTMLDivElement>

const Grid = ({ centerContent, children }: Props): JSX.Element => {
  return <StyledGrid centerContent={centerContent}>{children}</StyledGrid>
}

export default Grid //eslint-disable-line
