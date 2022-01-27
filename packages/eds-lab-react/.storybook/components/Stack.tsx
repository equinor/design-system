import styled from 'styled-components'

type StackProps = {
  direction?: 'column' | 'row'
}

export const Stack = styled.div<StackProps>`
  display: flex;
  flex-direction: ${({ direction = 'column' }) => direction};
  justify-content: center;
  align-items: center;
  gap: 1rem;
  @media screen and (min-width: 600px) {
    flex-direction: ${({ direction }) => (direction ? direction : 'row')};
  }
`
