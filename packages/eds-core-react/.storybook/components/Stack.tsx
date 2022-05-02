import styled, { CSSProperties } from 'styled-components'

type StackProps = {
  direction?: CSSProperties['flexDirection']
  align?: CSSProperties['alignItems']
}

export const Stack = styled.div<StackProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${({ align }) => align || 'center'};
  gap: 1rem;
  @media screen and (min-width: 600px) {
    flex-direction: ${({ direction }) => direction || 'row'};
  }
`
